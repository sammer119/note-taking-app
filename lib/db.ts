import Dexie, { Table } from "dexie";
import { Notebook, Note } from "@/types";

/**
 * Database class for managing notebooks and notes using IndexedDB
 */
export class NotesDatabase extends Dexie {
  notebooks!: Table<Notebook, string>;
  notes!: Table<Note, string>;

  constructor() {
    super("NotesDatabase");

    this.version(1).stores({
      notebooks: "id, name, createdAt, updatedAt",
      notes: "id, notebookId, title, createdAt, updatedAt",
    });
  }
}

// Create a singleton instance
export const db = new NotesDatabase();
