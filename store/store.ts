import { create } from "zustand";
import { AppState } from "@/types";

/**
 * Global application state store using Zustand
 * Manages active notebook and note selections
 */
export const useAppStore = create<AppState>((set) => ({
  activeNotebookId: null,
  activeNoteId: null,
  setActiveNotebook: (id) => set({ activeNotebookId: id, activeNoteId: null }),
  setActiveNote: (id) => set({ activeNoteId: id }),
}));
