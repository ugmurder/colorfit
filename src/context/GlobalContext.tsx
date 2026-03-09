import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SeasonType, GlobalState } from '../types';

interface GlobalContextType extends GlobalState {
  setUserImage: (image: string | null) => void;
  setProcessedUserImage: (image: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setSelectedSeason: (season: SeasonType | null) => void;
  resetAll: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const STORAGE_KEY = 'personal_color_scores';

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [processedUserImage, setProcessedUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<SeasonType | null>(null);

  const resetAll = () => {
    setUserImage(null);
    setProcessedUserImage(null);
    setIsProcessing(false);
    setSelectedSeason(null);
  };

  return (
    <GlobalContext.Provider value={{
      userImage,
      processedUserImage,
      isProcessing,
      selectedSeason,
      setUserImage,
      setProcessedUserImage,
      setIsProcessing,
      setSelectedSeason,
      resetAll
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
