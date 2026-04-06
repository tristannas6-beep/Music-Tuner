import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * usePitchPipe - Hook to generate reference tones for tuning.
 * Provides smooth, pop-free audio synthesis for any musical note.
 */

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const usePitchPipe = (a4Calibration: number = 440) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopNote = useCallback(() => {
    if (gainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      // Smooth fade out to prevent clicking
      gainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        }
      }, 100);
    }
    setActiveNote(null);
  }, []);

  const playNote = useCallback((note: string) => {
    if (activeNote === note) {
      stopNote();
      return;
    }

    // Initialize AudioContext if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const now = audioContextRef.current.currentTime;

    // Clean up previous note if any
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }

    // Setup nodes
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    // Use Triangle wave for a warmer, "premium" feel over pure sine
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteToHz(note, a4Calibration), now);

    gain.connect(audioContextRef.current.destination);
    osc.connect(gain);

    // Fade in
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.05);

    osc.start();

    oscillatorRef.current = osc;
    gainRef.current = gain;
    setActiveNote(note);
  }, [activeNote, a4Calibration, stopNote]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { activeNote, playNote, stopNote };
};

/**
 * noteToHz - Converts a musical note (e.g., "A4") to its frequency in Hz.
 * n = 12 * log2(f/440) + 69  =>  f = 440 * 2^((n-69)/12)
 */
function noteToHz(noteStr: string, a4: number): number {
  const noteName = noteStr.match(/[A-Z]#?/)?.[0];
  const octave = parseInt(noteStr.match(/\d+/)?.[0] || '4');
  
  if (!noteName) return a4;

  const semiOffset = NOTES.indexOf(noteName);
  const midiNumber = (octave + 1) * 12 + semiOffset;
  
  return a4 * Math.pow(2, (midiNumber - 69) / 12);
}
