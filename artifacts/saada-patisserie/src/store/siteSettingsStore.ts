import { create } from 'zustand';
import {
  SiteSettings,
  DEFAULT_SETTINGS,
  subscribeToSettings,
  saveSettingsToFirestore,
} from '@/lib/firestore';

interface SiteSettingsState {
  settings: Required<SiteSettings>;
  isLoading: boolean;
  isSaving: boolean;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  saveSettings: () => Promise<void>;
}

export const useSiteSettingsStore = create<SiteSettingsState>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  isLoading: true,
  isSaving: false,

  updateSettings: (patch) =>
    set((s) => ({ settings: { ...s.settings, ...patch } })),

  saveSettings: async () => {
    set({ isSaving: true });
    try {
      await saveSettingsToFirestore(get().settings);
    } finally {
      set({ isSaving: false });
    }
  },
}));

// ── Real-time Firestore subscription ──
subscribeToSettings((remote) => {
  useSiteSettingsStore.setState((s) => ({
    settings: { ...s.settings, ...remote },
    isLoading: false,
  }));
});
