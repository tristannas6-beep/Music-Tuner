import { useState, useRef, useEffect, useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * useTuner - Advanced DSP pitch detection hook.
 * Features: HPF, Hann Window, Zero-Padding, YIN with Parabolic Interpolation, 
 * EMA smoothing, Native Haptic Feedback, and Solfege support.
 */

interface TunerState {
  pitch: number; // Sub-sample accurate frequency in Hz
  note: string;
  cents: number;
  isDetecting: boolean;
  rms: number;
}

const LETTERS_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SOLFEGE_NOTES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Professional EMA Alpha (0.2 is "fast yet solid")
const EMA_ALPHA_CENTS = 0.2;
const EMA_ALPHA_PITCH = 0.15;

// Haptic throttle
const HAPTIC_COOLDOWN_MS = 2000;

export const useTuner = (a4Calibration: number = 440, noteNaming: 'Letters' | 'Solfege' = 'Letters') => {
  const [state, setState] = useState<TunerState>({
    pitch: 0,
    note: '--',
    cents: 0,
    isDetecting: false,
    rms: 0,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // EMA State persistence
  const emaCentsRef = useRef(0);
  const emaPitchRef = useRef(0);
  
  // Filter state for 1st-order HPF
  const lastSampleRef = useRef(0);
  const lastOutputRef = useRef(0);

  // Haptic state
  const lastHapticTimeRef = useRef(0);

  const startTuning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 4096; // 4096 base window
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setState(prev => ({ ...prev, isDetecting: true }));
      tick();
    } catch (err) {
      console.error('DSP: Audio initialization failed', err);
    }
  };

  const stopTuning = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setState(prev => ({ ...prev, isDetecting: false, pitch: 0, note: '--', cents: 0 }));
  };

  const tick = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const sampleRate = audioContextRef.current.sampleRate;

    // 1. INPUT PRE-PROCESSING: 1st-Order HPF
    const filteredBuffer = applyHighPassFilter(buffer, sampleRate, 40, lastSampleRef, lastOutputRef);

    // 2. SIGNAL PREPARATION: Hann Windowing
    const windowedBuffer = applyHannWindow(filteredBuffer);

    // 3. CORE PROCESSING: YIN with Sub-Sample Accuracy
    const { pitch, rms } = computeAdvancedPitchYIN(windowedBuffer, sampleRate);

    // High resolution pitch detection with Noise Gate
    if (pitch !== -1 && rms > 0.01) {
      const { note, exactCents } = frequencyToPitchData(pitch, a4Calibration, noteNaming);

      // 5. OUTPUT STABILIZATION: EMA
      emaPitchRef.current = emaPitchRef.current === 0 
        ? pitch 
        : (EMA_ALPHA_PITCH * pitch + (1 - EMA_ALPHA_PITCH) * emaPitchRef.current);
      
      emaCentsRef.current = (EMA_ALPHA_CENTS * exactCents + (1 - EMA_ALPHA_CENTS) * emaCentsRef.current);

      const finalCents = Math.round(emaCentsRef.current * 10) / 10;

      // 6. NATIVE UX: Haptics on "Perfect"
      if (Math.abs(finalCents) < 3.0) {
        const now = Date.now();
        if (now - lastHapticTimeRef.current > HAPTIC_COOLDOWN_MS) {
          Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
          lastHapticTimeRef.current = now;
        }
      }

      setState(prev => ({
        ...prev,
        pitch: emaPitchRef.current,
        note,
        cents: finalCents,
        rms
      }));
    } else {
      setState(prev => ({ ...prev, rms, pitch: 0 }));
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, [a4Calibration, noteNaming]);

  useEffect(() => {
    return () => {
      stopTuning();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return { ...state, startTuning, stopTuning, analyser: analyserRef.current };
};

/**
 * DSP: 1st-Order High Pass Filter
 */
function applyHighPassFilter(
  buffer: Float32Array, 
  sampleRate: number, 
  cutoff: number,
  lastSample: { current: number },
  lastOutput: { current: number }
) {
  const dt = 1.0 / sampleRate;
  const RC = 1.0 / (2 * Math.PI * cutoff);
  const alpha = RC / (RC + dt);
  
  const output = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    output[i] = alpha * (lastOutput.current + buffer[i] - lastSample.current);
    lastSample.current = buffer[i];
    lastOutput.current = output[i];
  }
  return output;
}

/**
 * DSP: Hann Windowing Function
 */
function applyHannWindow(buffer: Float32Array) {
  const N = buffer.length;
  const windowed = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    const w = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
    windowed[n] = buffer[n] * w;
  }
  return windowed;
}

/**
 * DSP Core: Enhanced YIN with Sub-Sample Parabolic Interpolation
 */
function computeAdvancedPitchYIN(buffer: Float32Array, sampleRate: number) {
  const threshold = 0.1;
  const size = buffer.length;
  
  // Zero Padding
  const paddedBuffer = new Float32Array(size * 2);
  paddedBuffer.set(buffer); 
  
  const paddedSize = paddedBuffer.length;
  const half = Math.floor(paddedSize / 2);
  
  // RMS Noise Gate
  let sumSq = 0;
  for (let i = 0; i < size; i++) sumSq += buffer[i] * buffer[i];
  const rms = Math.sqrt(sumSq / size);
  if (rms < 0.005) return { pitch: -1, rms };

  // 1. Squared Difference Function
  const yin = new Float32Array(half);
  for (let tau = 0; tau < half; tau++) {
    for (let i = 0; i < half; i++) {
      const delta = paddedBuffer[i] - paddedBuffer[i + tau];
      yin[tau] += delta * delta;
    }
  }

  // 2. Cumulative Mean Normalized Difference
  yin[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < half; tau++) {
    runningSum += yin[tau];
    yin[tau] *= tau / (runningSum || 1);
  }

  // 3. Absolute Thresholding
  let tau = -1;
  for (let t = 2; t < half; t++) {
    if (yin[t] < threshold) {
      while (t + 1 < half && yin[t + 1] < yin[t]) t++;
      tau = t;
      break;
    }
  }

  // Fallback to local minimum
  if (tau === -1) {
    let bestMin = 1;
    for (let t = 2; t < half; t++) {
      if (yin[t] < bestMin) { bestMin = yin[t]; tau = t; }
    }
    if (bestMin > 0.4) return { pitch: -1, rms };
  }

  // 4. Sub-Sample Accuracy (Parabolic Interpolation)
  let refinedTau = tau;
  if (tau > 0 && tau < half - 1) {
    const s0 = yin[tau - 1];
    const s1 = yin[tau];
    const s2 = yin[tau + 1];
    const divisor = 2 * (2 * s1 - s2 - s0);
    if (Math.abs(divisor) > 1e-6) {
      refinedTau = tau + (s2 - s0) / divisor;
    }
  }

  return { pitch: sampleRate / refinedTau, rms };
}

/**
 * DSP: Frequency to Note/Cents calculation with Solfege support.
 */
function frequencyToPitchData(hz: number, a4: number, noteNaming: 'Letters' | 'Solfege') {
  const h = 12 * (Math.log(hz / a4) / Math.log(2));
  const noteIdx = Math.round(h) + 69;
  
  const notesArray = noteNaming === 'Solfege' ? SOLFEGE_NOTES : LETTERS_NOTES;
  const name = notesArray[noteIdx % 12];
  
  const oct = Math.floor(noteIdx / 12) - 1;
  const exactCents = (h - Math.round(h)) * 100;
  
  const octaveSuffix = noteNaming === 'Solfege' ? ` (${oct})` : oct;
  return { note: `${name}${octaveSuffix}`, exactCents };
}
