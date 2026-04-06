import { useState, useRef, useEffect, useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * useMetronome - A professional-grade rhythmic engine (Pro Suite)
 * Features: High-precision scheduling, Subdivision, Sound Profiles, and Pulsed Haptics.
 */

export type Subdivision = '1/4' | '1/8' | 'Triplet' | '1/16';
export type SoundProfile = 'Digital' | 'Wood' | 'Cowbell';

const LOOK_AHEAD_MS = 25.0;
const SCHEDULE_AHEAD_SEC = 0.1;

export const useMetronome = (hapticsEnabled: boolean = true) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentSub, setCurrentSub] = useState(0);
  const [subdivision, setSubdivision] = useState<Subdivision>('1/4');
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('Digital');
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0.0);
  const timerIdRef = useRef<number | null>(null);
  const beatRef = useRef(0); 
  const subRef = useRef(0);  
  const bpmRef = useRef(120);
  const subTypeRef = useRef<Subdivision>('1/4');
  const hapticRef = useRef(true);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { subTypeRef.current = subdivision; }, [subdivision]);
  useEffect(() => { hapticRef.current = hapticsEnabled; }, [hapticsEnabled]);

  const playClick = useCallback((time: number, isAccent: boolean, isSub: boolean) => {
    if (!audioContextRef.current) return;

    // Haptics Sync: Trigger slightly before or at audio time via timeout
    if (hapticRef.current && !isSub) {
      const delay = (time - audioContextRef.current.currentTime) * 1000;
      setTimeout(() => {
        Haptics.impact({ 
          style: isAccent ? ImpactStyle.Heavy : ImpactStyle.Light 
        }).catch(() => {});
      }, Math.max(0, delay - 10)); // 10ms offset for latency
    }

    const osc = audioContextRef.current.createOscillator();
    const envelope = audioContextRef.current.createGain();

    let freq = isAccent ? 1200 : 800;
    if (isSub) freq *= 0.8;
    
    let decay = 0.1;

    switch (soundProfile) {
      case 'Wood':
        osc.type = 'sine';
        freq = isAccent ? 600 : 450;
        if (isSub) freq *= 0.8;
        decay = 0.05;
        break;
      case 'Cowbell':
        osc.type = 'square';
        freq = isAccent ? 800 : 600;
        if (isSub) freq *= 0.8;
        decay = 0.15;
        break;
      default: // Digital
        osc.type = 'triangle';
        break;
    }

    osc.frequency.setValueAtTime(freq, time);
    envelope.gain.setValueAtTime(isAccent ? 1 : 0.6, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(envelope);
    envelope.connect(audioContextRef.current.destination);

    osc.start(time);
    osc.stop(time + decay);
  }, [soundProfile]);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + SCHEDULE_AHEAD_SEC) {
      const isAccent = beatRef.current === 0 && subRef.current === 0;
      const isSub = subRef.current !== 0;
      
      playClick(nextNoteTimeRef.current, isAccent, isSub);
      
      const scheduledTime = nextNoteTimeRef.current;
      setTimeout(() => {
        if (isPlaying) {
          setCurrentBeat(beatRef.current);
          setCurrentSub(subRef.current);
        }
      }, (scheduledTime - audioContextRef.current.currentTime) * 1000);

      const secondsPerBeat = 60.0 / bpmRef.current;
      let notesPerBeat = 1;
      
      if (subTypeRef.current === '1/8') notesPerBeat = 2;
      else if (subTypeRef.current === 'Triplet') notesPerBeat = 3;
      else if (subTypeRef.current === '1/16') notesPerBeat = 4;

      nextNoteTimeRef.current += secondsPerBeat / notesPerBeat;
      
      subRef.current++;
      if (subRef.current >= notesPerBeat) {
        subRef.current = 0;
        beatRef.current = (beatRef.current + 1) % 4;
      }
    }

    timerIdRef.current = window.setTimeout(scheduler, LOOK_AHEAD_MS);
  }, [isPlaying, playClick]);

  const toggleMetronome = useCallback(() => {
    if (isPlaying) {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      setIsPlaying(false);
      setCurrentBeat(0);
      setCurrentSub(0);
      beatRef.current = 0;
      subRef.current = 0;
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

  const tapTempo = useCallback(() => {
    const now = performance.now();
    const newTaps = [...tapTimes, now];
    if (newTaps.length > 4) newTaps.shift();
    if (newTaps.length >= 2) {
      const diffs = [];
      for (let i = 1; i < newTaps.length; i++) {
        diffs.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgDiff = diffs.reduce((a, b) => a + b) / diffs.length;
      const calcBpm = Math.round(60000 / avgDiff);
      if (calcBpm >= 30 && calcBpm <= 400) setBpm(calcBpm);
    }
    setTapTimes(newTaps);
  }, [tapTimes]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return { 
    bpm, setBpm, 
    isPlaying, toggleMetronome, 
    currentBeat, currentSub,
    subdivision, setSubdivision,
    soundProfile, setSoundProfile,
    tapTempo 
  };
};
