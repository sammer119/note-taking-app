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
 * Unified storage layer that works with both IndexedDB (web) and SQLite (Electron)
 */

const isElectron = () => {
  return typeof window !== "undefined" && window.electronAPI?.isElectron;
};

// ==================== Notebook Operations ====================

export async function createNotebook(
  data: CreateNotebookDTO
): Promise<Notebook> {
  if (isElectron()) {
    return await window.electronAPI!.createNotebook(data);
  }

  const notebook: Notebook = {
    id: crypto.randomUUID(),
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.notebooks.add(notebook);
  return notebook;
}

export async function getAllNotebooks(): Promise<Notebook[]> {
  if (isElectron()) {
    return await window.electronAPI!.getAllNotebooks();
  }

  return await db.notebooks.orderBy("updatedAt").reverse().toArray();
}

export async function getNotebook(id: string): Promise<Notebook | undefined> {
  if (isElectron()) {
    return await window.electronAPI!.getNotebook(id);
  }

  return await db.notebooks.get(id);
}

export async function updateNotebook(
  id: string,
  data: UpdateNotebookDTO
): Promise<void> {
  if (isElectron()) {
    return await window.electronAPI!.updateNotebook(id, data);
  }

  await db.notebooks.update(id, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteNotebook(id: string): Promise<void> {
  if (isElectron()) {
    return await window.electronAPI!.deleteNotebook(id);
  }

  await db.transaction("rw", db.notebooks, db.notes, async () => {
    await db.notes.where("notebookId").equals(id).delete();
    await db.notebooks.delete(id);
  });
}

// ==================== Note Operations ====================

export async function createNote(data: CreateNoteDTO): Promise<Note> {
  if (isElectron()) {
    return await window.electronAPI!.createNote(data);
  }

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

export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  if (isElectron()) {
    return await window.electronAPI!.getNotesByNotebook(notebookId);
  }

  return await db.notes
    .where("notebookId")
    .equals(notebookId)
    .reverse()
    .sortBy("updatedAt");
}

export async function getNote(id: string): Promise<Note | undefined> {
  if (isElectron()) {
    return await window.electronAPI!.getNote(id);
  }

  return await db.notes.get(id);
}

export async function updateNote(id: string, data: UpdateNoteDTO): Promise<void> {
  if (isElectron()) {
    return await window.electronAPI!.updateNote(id, data);
  }

  await db.notes.update(id, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteNote(id: string): Promise<void> {
  if (isElectron()) {
    return await window.electronAPI!.deleteNote(id);
  }

  await db.notes.delete(id);
}

export async function searchNotes(query: string): Promise<Note[]> {
  if (isElectron()) {
    return await window.electronAPI!.searchNotes(query);
  }

  const lowercaseQuery = query.toLowerCase();
  const allNotes = await db.notes.toArray();

  return allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery)
  );
}

// ==================== Utility ====================

export function getStorageType(): "electron" | "web" {
  return isElectron() ? "electron" : "web";
}

export async function getDbPath(): Promise<string | null> {
  if (isElectron()) {
    return await window.electronAPI!.getDbPath();
  }
  return null;
}
