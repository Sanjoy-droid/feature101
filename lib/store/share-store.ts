import { create } from "zustand";

interface ShareAnalytics {
  platform: string;
  url: string;
  timestamp: Date;
}

interface ShareStore {
  shareHistory: ShareAnalytics[];
  addShare: (platform: string, url: string) => void;
  getShareCount: (platform: string) => number;
  clearHistory: () => void;
}

export const useShareStore = create<ShareStore>((set, get) => ({
  shareHistory: [],

  addShare: (platform, url) =>
    set((state) => ({
      shareHistory: [
        ...state.shareHistory,
        { platform, url, timestamp: new Date() },
      ],
    })),

  getShareCount: (platform) =>
    get().shareHistory.filter((s) => s.platform === platform).length,

  clearHistory: () => set({ shareHistory: [] }),
}));
