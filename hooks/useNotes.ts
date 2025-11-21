import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { createNote, updateNote, deleteNote } from "@/lib/storage";
import { CreateNoteDTO, UpdateNoteDTO, Note } from "@/types";

/**
 * Custom hook for managing notes in a specific notebook
 * Provides real-time updates from IndexedDB
 */
export function useNotes(notebookId: string | null) {
  // Live query that automatically updates when the database changes
  const notes = useLiveQuery(
    async () => {
      if (!notebookId) return [] as Note[];
      return await db.notes
        .where("notebookId")
        .equals(notebookId)
        .reverse()
        .sortBy("updatedAt");
    },
    [notebookId]
  );

  const create = async (data: CreateNoteDTO): Promise<Note> => {
    return await createNote(data);
  };

  const update = async (id: string, data: UpdateNoteDTO): Promise<void> => {
    await updateNote(id, data);
  };

  const remove = async (id: string): Promise<void> => {
    await deleteNote(id);
  };

  return {
    notes: notes ?? [],
    loading: notes === undefined,
    create,
    update,
    remove,
  };
}

/**
 * Custom hook for managing a single note
 */
export function useNote(noteId: string | null) {
  const note = useLiveQuery(
    async () => {
      if (!noteId) return undefined;
      return await db.notes.get(noteId);
    },
    [noteId]
  );

  return {
    note: note ?? null,
    loading: note === undefined && noteId !== null,
  };
}
