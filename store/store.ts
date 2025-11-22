import { create } from "zustand";
import { AppState, Note, Notebook } from "@/types";

/**
 * Extended AppState with notes cache and notebooks
 */
interface ExtendedAppState extends AppState {
  notesCache: Record<string, Note[]>;
  setNotesCache: (notebookId: string, notes: Note[]) => void;
  updateNoteInCache: (notebookId: string, noteId: string, updates: Partial<Note>) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  notebooks: Notebook[];
  setNotebooks: (notebooks: Notebook[]) => void;
}

/**
 * Global application state store using Zustand
 * Manages active notebook and note selections, and notes cache
 */
export const useAppStore = create<ExtendedAppState>((set) => ({
  activeNotebookId: null,
  activeNoteId: null,
  notesCache: {},
  refreshTrigger: 0,
  notebooks: [],
  setActiveNotebook: (id) => set({ activeNotebookId: id, activeNoteId: null }),
  setActiveNote: (id) => set({ activeNoteId: id }),
  setNotesCache: (notebookId, notes) =>
    set((state) => ({
      notesCache: { ...state.notesCache, [notebookId]: notes },
    })),
  updateNoteInCache: (notebookId, noteId, updates) =>
    set((state) => {
      const notes = state.notesCache[notebookId];
      if (!notes) return state;

      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, ...updates, updatedAt: new Date() } : note
      );

      return {
        notesCache: { ...state.notesCache, [notebookId]: updatedNotes },
      };
    }),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  setNotebooks: (notebooks) => set({ notebooks }),
}));
