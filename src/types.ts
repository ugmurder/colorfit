export type Color = {
  name: string;
  hex: string;
  rgb: [number, number, number];
};

export type SeasonCategory = 'spring' | 'summer' | 'autumn' | 'winter';

export type SeasonType = {
  id: string;
  name: string;
  category: SeasonCategory;
  coreDesc: string;
  colors: Color[];
};

export type GlobalState = {
  userImage: string | null;
  processedUserImage: string | null;
  isProcessing: boolean;
  selectedSeason: SeasonType | null;
};
