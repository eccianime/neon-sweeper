import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DifficultyOption = "easy" | "medium" | "hard" | "custom";

export const CUSTOM_GRID = { cols: 12, rows: 15 };
export const CUSTOM_MIN_MINES = 10;
export const CUSTOM_MAX_MINES = Math.floor(
  CUSTOM_GRID.cols * CUSTOM_GRID.rows * 0.35,
); // 63

interface SettingsState {
  difficulty: DifficultyOption;
  customMines: number;
  sfxEnabled: boolean;
  musicEnabled: boolean;

  setDifficulty: (d: DifficultyOption) => void;
  setCustomMines: (n: number) => void;
  setSfxEnabled: (v: boolean) => void;
  setMusicEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      difficulty: "easy",
      customMines: 20,
      sfxEnabled: true,
      musicEnabled: true,

      setDifficulty: (d) => set({ difficulty: d }),
      setCustomMines: (n) =>
        set({
          customMines: Math.min(
            CUSTOM_MAX_MINES,
            Math.max(CUSTOM_MIN_MINES, Math.round(n) || CUSTOM_MIN_MINES),
          ),
        }),
      setSfxEnabled: (v) => set({ sfxEnabled: v }),
      setMusicEnabled: (v) => set({ musicEnabled: v }),
    }),
    {
      name: "neon-sweeper-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
