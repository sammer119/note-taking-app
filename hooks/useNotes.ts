import { useState, useEffect } from "react";
import {
  createNote,
  updateNote,
  deleteNote,
  getNotesByNotebook,
  getNote,
} from "@/lib/storage-adapter";
import { CreateNoteDTO, UpdateNoteDTO, Note } from "@/types";
import { useAppStore } from "@/store/store";

/**
 * Custom hook for managing notes in a specific notebook
 * Uses centralized state from Zustand store for real-time updates across components
 */
export function useNotes(notebookId: string | null) {
  const notesCache = useAppStore((state) => state.notesCache);
  const setNotesCache = useAppStore((state) => state.setNotesCache);
  const refreshTrigger = useAppStore((state) => state.refreshTrigger);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const notes = notebookId ? (notesCache[notebookId] || []) : [];

  const loadNotes = async () => {
    if (!notebookId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getNotesByNotebook(notebookId);
      setNotesCache(notebookId, data);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!notebookId) {
      setLoading(false);
      return;
    }
    loadNotes();
  }, [notebookId, refreshTrigger]);

  const create = async (data: CreateNoteDTO): Promise<Note> => {
    const note = await createNote(data);
    await loadNotes(); // Refresh list
    return note;
  };

  const update = async (id: string, data: UpdateNoteDTO): Promise<void> => {
    await updateNote(id, data);
    await loadNotes(); // Refresh list
  };

  const remove = async (id: string): Promise<void> => {
    await deleteNote(id);
    await loadNotes(); // Refresh list
  };

  return {
    notes,
    loading,
    error,
    create,
    update,
    remove,
    refresh: loadNotes,
  };
}

/**
 * Custom hook for managing a single note
 */
export function useNote(noteId: string | null) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!noteId) {
      setNote(null);
      setLoading(false);
      return;
    }
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    if (!noteId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getNote(noteId);
      setNote(data || null);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to load note:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    note,
    loading,
    error,
    refresh: loadNote,
  };
}
