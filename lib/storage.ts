/**
 * Re-export unified storage functions for backward compatibility
 * This file now uses storage-unified which automatically detects
 * whether to use IndexedDB (web) or SQLite (Electron)
 */

export {
  createNotebook,
  getAllNotebooks,
  getNotebook,
  updateNotebook,
  deleteNotebook,
  createNote,
  getNotesByNotebook,
  getNote,
  updateNote,
  deleteNote,
  searchNotes,
  getStorageType,
  getDbPath,
} from "./storage-unified";
