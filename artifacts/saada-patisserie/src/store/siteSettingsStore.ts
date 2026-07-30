import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SiteSettingsState {
  heroImageUrl: string;
  setHeroImageUrl: (url: string) => void;
}

export const useSiteSettingsStore = create<SiteSettingsState>()(
  persist(
    (set) => ({
      heroImageUrl: '',
      setHeroImageUrl: (url) => set({ heroImageUrl: url }),
    }),
    {
      name: 'saada-site-settings',
    }
  )
);
