import { useState, useRef, useEffect, useCallback } from 'react';

interface PitchData {
  pitch: number;
  note: string;
  cents: number;
  rms: number;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const usePitchDetector = (sampleRate = 44100, bufferSize = 2048) => {
  const [data, setData] = useState<PitchData | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = bufferSize;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setData(null);
  };

  const updatePitch = useCallback(() => {
    if (!analyserRef.current) return;

    const buffer = new Float32Array(bufferSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const result = autoCorrelate(buffer, audioContextRef.current?.sampleRate || sampleRate);
    
    if (result.pitch !== -1) {
      setData(result);
    } else {
      setData((prev) => prev ? { ...prev, rms: result.rms } : null);
    }

    rafIdRef.current = requestAnimationFrame(updatePitch);
  }, [bufferSize, sampleRate]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return { data, isListening, startListening, stopListening };
};

function autoCorrelate(buffer: Float32Array, sampleRate: number): PitchData {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);

  // Noise gate
  if (rms < 0.01) return { pitch: -1, note: '--', cents: 0, rms };

  let r1 = 0, r2 = buffer.length - 1, thres = 0.2;
  for (let i = 0; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[buffer.length - i]) < thres) { r2 = buffer.length - i; break; }
  }

  const newBuffer = buffer.slice(r1, r2);
  const size = newBuffer.length;
  const c = new Float32Array(size).fill(0);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + newBuffer[j] * newBuffer[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  
  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  const T0 = maxpos;
  const pitch = sampleRate / T0;

  // Convert to note
  const noteNum = 12 * (Math.log(pitch / 440) / Math.log(2));
  const noteIndex = Math.round(noteNum) + 69;
  const noteName = NOTES[noteIndex % 12];
  const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);

  return { pitch, note: noteName, cents, rms };
}
