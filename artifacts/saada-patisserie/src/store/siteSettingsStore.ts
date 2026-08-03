import { create } from 'zustand';
import { SiteSettings, subscribeToSettings, saveSettingsToFirestore } from '@/lib/firestore';

interface SiteSettingsState {
  heroImageUrl: string;
  isLoading: boolean;
  setHeroImageUrl: (url: string) => Promise<void>;
}

export const useSiteSettingsStore = create<SiteSettingsState>((set) => ({
  heroImageUrl: '',
  isLoading: true,

  setHeroImageUrl: async (url) => {
    set({ heroImageUrl: url });
    await saveSettingsToFirestore({ heroImageUrl: url });
  },
}));

// ── Subscribe to Firestore settings in real-time ──
subscribeToSettings((settings: SiteSettings) => {
  useSiteSettingsStore.setState({
    heroImageUrl: settings.heroImageUrl ?? '',
    isLoading: false,
  });
});
