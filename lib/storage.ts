import { db } from "./db";
import {
  Notebook,
  Note,
  CreateNotebookDTO,
  UpdateNotebookDTO,
  CreateNoteDTO,
  UpdateNoteDTO,
} from "@/types";

/**
 * Storage helper functions for managing notebooks and notes
 */

// ==================== Notebook Operations ====================

/**
 * Create a new notebook
 */
export async function createNotebook(
  data: CreateNotebookDTO
): Promise<Notebook> {
  const notebook: Notebook = {
    id: crypto.randomUUID(),
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.notebooks.add(notebook);
  return notebook;
}

/**
 * Get all notebooks
 */
export async function getAllNotebooks(): Promise<Notebook[]> {
  return await db.notebooks.orderBy("updatedAt").reverse().toArray();
}

/**
 * Get a notebook by ID
 */
export async function getNotebook(id: string): Promise<Notebook | undefined> {
  return await db.notebooks.get(id);
}

/**
 * Update a notebook
 */
export async function updateNotebook(
  id: string,
  data: UpdateNotebookDTO
): Promise<void> {
  await db.notebooks.update(id, {
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * Delete a notebook and all its notes
 */
export async function deleteNotebook(id: string): Promise<void> {
  await db.transaction("rw", db.notebooks, db.notes, async () => {
    // Delete all notes in the notebook
    await db.notes.where("notebookId").equals(id).delete();
    // Delete the notebook
    await db.notebooks.delete(id);
  });
}

// ==================== Note Operations ====================

/**
 * Create a new note
 */
export async function createNote(data: CreateNoteDTO): Promise<Note> {
  const note: Note = {
    id: crypto.randomUUID(),
    notebookId: data.notebookId,
    title: data.title,
    content: data.content || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.notes.add(note);
  return note;
}

/**
 * Get all notes in a notebook
 */
export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  return await db.notes
    .where("notebookId")
    .equals(notebookId)
    .reverse()
    .sortBy("updatedAt");
}

/**
 * Get a note by ID
 */
export async function getNote(id: string): Promise<Note | undefined> {
  return await db.notes.get(id);
}

/**
 * Update a note
 */
export async function updateNote(id: string, data: UpdateNoteDTO): Promise<void> {
  await db.notes.update(id, {
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}

/**
 * Search notes by title or content
 */
export async function searchNotes(query: string): Promise<Note[]> {
  const lowercaseQuery = query.toLowerCase();
  const allNotes = await db.notes.toArray();

  return allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery)
  );
}
