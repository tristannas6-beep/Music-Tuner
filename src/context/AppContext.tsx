import React, { createContext, useContext, useState, type ReactNode } from 'react';

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
}

interface AppContextType extends AppState {
  setInstrument: (inst: InstrumentType) => void;
  setTuning: (tuning: TuningInfo) => void;
  setA4Calibration: (val: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setNoteNaming: (naming: 'Letters' | 'Solfege') => void;
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('Guitar');
  const [activeTuning, setActiveTuning] = useState<TuningInfo>(tunings['Guitar'][0]);
  const [a4Calibration, setA4Calibration] = useState(440);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [noteNaming, setNoteNaming] = useState<'Letters' | 'Solfege'>('Letters');

  const setInstrument = (inst: InstrumentType) => {
    setSelectedInstrument(inst);
    setActiveTuning(tunings[inst][0]);
  };

  return (
    <AppContext.Provider value={{
      selectedInstrument,
      activeTuning,
      a4Calibration,
      theme,
      noteNaming,
      setInstrument,
      setTuning: setActiveTuning,
      setA4Calibration,
      setTheme,
      setNoteNaming,
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
