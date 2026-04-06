import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useMetronome - A high-precision metronome hook.
 * Uses the Web Audio API "Look-Ahead" scheduler to prevent beat drift.
 */

const LOOK_AHEAD_MS = 25.0; // How frequently to check for next notes
const SCHEDULE_AHEAD_SEC = 0.1; // How far ahead to schedule sounds

export const useMetronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0.0); // When the next note is due
  const timerIdRef = useRef<number | null>(null);
  const beatRef = useRef(0);
  const bpmRef = useRef(120);

  // Update BPM ref to keep it in sync with state for the sound scheduler
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  const playClick = useCallback((time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const envelope = audioContextRef.current.createGain();

    osc.type = 'triangle';
    // Frequency: Accent 1000Hz, Normal 800Hz
    osc.frequency.setValueAtTime(isAccent ? 1000 : 800, time);

    envelope.gain.setValueAtTime(1, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(audioContextRef.current.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }, []);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    // While there are notes that will need to play before the next check, schedule them
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + SCHEDULE_AHEAD_SEC) {
      const isAccent = beatRef.current === 0;
      
      playClick(nextNoteTimeRef.current, isAccent);
      
      // Update UI state (sync with audio)
      const scheduledTime = nextNoteTimeRef.current;
      setTimeout(() => {
        if (isPlaying) {
          setCurrentBeat(beatRef.current);
        }
      }, (scheduledTime - audioContextRef.current.currentTime) * 1000);

      // Advance next note time
      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTimeRef.current += secondsPerBeat;
      
      // Cycle through beats (4/4 time assumed for this tuner)
      beatRef.current = (beatRef.current + 1) % 4;
    }

    timerIdRef.current = window.setTimeout(scheduler, LOOK_AHEAD_MS);
  }, [isPlaying, playClick]);

  const toggleMetronome = useCallback(() => {
    if (isPlaying) {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      setIsPlaying(false);
      setCurrentBeat(0);
      beatRef.current = 0;
    } else {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      setIsPlaying(true);
      scheduler();
    }
  }, [isPlaying, scheduler]);

  // Tap Tempo Implementation
  const tapTempo = useCallback(() => {
    const now = performance.now();
    const newTaps = [...tapTimes, now];
    
    // Keep only the last 4 taps
    if (newTaps.length > 4) newTaps.shift();
    
    if (newTaps.length >= 2) {
      const diffs = [];
      for (let i = 1; i < newTaps.length; i++) {
        diffs.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgDiff = diffs.reduce((a, b) => a + b) / diffs.length;
      const calcBpm = Math.round(60000 / avgDiff);
      
      if (calcBpm >= 30 && calcBpm <= 300) {
        setBpm(calcBpm);
      }
    }
    
    setTapTimes(newTaps);
  }, [tapTimes]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return { bpm, setBpm, isPlaying, toggleMetronome, currentBeat, tapTempo };
};
