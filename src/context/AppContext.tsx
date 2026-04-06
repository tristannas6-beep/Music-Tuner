import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Preferences } from '@capacitor/preferences';

export type InstrumentType = 'Guitar' | 'Bass' | 'Ukulele' | 'Violin';

export interface TuningInfo {
  name: string;
  notes: string[];
}

interface AppState {
  selectedInstrument: InstrumentType;
  activeTuning: TuningInfo;
  a4Calibration: number;
  theme: 'dark' | 'light';
  noteNaming: 'Letters' | 'Solfege';
  isAutoMode: boolean;
  selectedStringIndex: number | null;
}

interface AppContextType extends AppState {
  setInstrument: (inst: InstrumentType) => Promise<void>;
  setTuning: (tuning: TuningInfo) => Promise<void>;
  setA4Calibration: (val: number) => Promise<void>;
  setTheme: (theme: 'dark' | 'light') => Promise<void>;
  setNoteNaming: (naming: 'Letters' | 'Solfege') => Promise<void>;
  setIsAutoMode: (val: boolean) => Promise<void>;
  setSelectedStringIndex: (idx: number | null) => Promise<void>;
  isLoaded: boolean;
}

const tunings: Record<InstrumentType, TuningInfo[]> = {
  Guitar: [
    { name: 'Standard', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { name: 'Drop D', notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
    { name: 'Half Step Down', notes: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'] },
  ],
  Bass: [
    { name: 'Standard', notes: ['E1', 'A1', 'D2', 'G2'] },
    { name: 'Drop D', notes: ['D1', 'A1', 'D2', 'G2'] },
  ],
  Ukulele: [
    { name: 'Standard (gCEA)', notes: ['G4', 'C4', 'E4', 'A4'] },
  ],
  Violin: [
    { name: 'Standard', notes: ['G3', 'D4', 'A4', 'E5'] },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'music_tuner_settings';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('Guitar');
  const [activeTuning, setActiveTuning] = useState<TuningInfo>(tunings['Guitar'][0]);
  const [a4Calibration, setA4Calibration] = useState(440);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [noteNaming, setNoteNaming] = useState<'Letters' | 'Solfege'>('Letters');
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);

  // Load state from Preferences on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          const saved = JSON.parse(value);
          if (saved.selectedInstrument) setSelectedInstrument(saved.selectedInstrument);
          if (saved.activeTuning) setActiveTuning(saved.activeTuning);
          if (saved.a4Calibration) setA4Calibration(saved.a4Calibration);
          if (saved.theme) setTheme(saved.theme);
          if (saved.noteNaming) setNoteNaming(saved.noteNaming);
          if (saved.isAutoMode !== undefined) setIsAutoMode(saved.isAutoMode);
          if (saved.selectedStringIndex !== undefined) setSelectedStringIndex(saved.selectedStringIndex);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  // Generic save function
  const saveSettings = async (updates: Partial<AppState>) => {
    const current: AppState = {
      selectedInstrument,
      activeTuning,
      a4Calibration,
      theme,
      noteNaming,
      isAutoMode,
      selectedStringIndex
    };
    const newState = { ...current, ...updates };
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(newState),
    });
  };

  const setInstrument = async (inst: InstrumentType) => {
    const defaultTuning = tunings[inst][0];
    setSelectedInstrument(inst);
    setActiveTuning(defaultTuning);
    setSelectedStringIndex(null); // Reset selection
    await saveSettings({ selectedInstrument: inst, activeTuning: defaultTuning, selectedStringIndex: null });
  };

  const setTuning = async (tuning: TuningInfo) => {
    setActiveTuning(tuning);
    setSelectedStringIndex(null); // Reset selection
    await saveSettings({ activeTuning: tuning, selectedStringIndex: null });
  };

  const updateA4Calibration = async (val: number) => {
    setA4Calibration(val);
    await saveSettings({ a4Calibration: val });
  };

  const updateTheme = async (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    await saveSettings({ theme: newTheme });
  };

  const updateNoteNaming = async (naming: 'Letters' | 'Solfege') => {
    setNoteNaming(naming);
    await saveSettings({ noteNaming: naming });
  };

  const updateAutoMode = async (val: boolean) => {
    setIsAutoMode(val);
    if (val) setSelectedStringIndex(null);
    await saveSettings({ isAutoMode: val, selectedStringIndex: val ? null : selectedStringIndex });
  };

  const updateSelectedString = async (idx: number | null) => {
    setSelectedStringIndex(idx);
    if (idx !== null) setIsAutoMode(false);
    await saveSettings({ selectedStringIndex: idx, isAutoMode: idx !== null ? false : isAutoMode });
  };

  return (
    <AppContext.Provider value={{
      selectedInstrument,
      activeTuning,
      a4Calibration,
      theme,
      noteNaming,
      isAutoMode,
      selectedStringIndex,
      isLoaded,
      setInstrument,
      setTuning,
      setA4Calibration: updateA4Calibration,
      setTheme: updateTheme,
      setNoteNaming: updateNoteNaming,
      setIsAutoMode: updateAutoMode,
      setSelectedStringIndex: updateSelectedString,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
