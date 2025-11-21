/**
 * Core data types for the note-taking application
 */

/**
 * Represents a notebook that contains multiple notes
 */
export interface Notebook {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a note within a notebook
 */
export interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string; // Stored as HTML from Tiptap editor
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data transfer object for creating a new notebook
 */
export interface CreateNotebookDTO {
  name: string;
}

/**
 * Data transfer object for updating an existing notebook
 */
export interface UpdateNotebookDTO {
  name?: string;
}

/**
 * Data transfer object for creating a new note
 */
export interface CreateNoteDTO {
  notebookId: string;
  title: string;
  content?: string;
}

/**
 * Data transfer object for updating an existing note
 */
export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  notebookId?: string;
}

/**
 * Application state for active selections
 */
export interface AppState {
  activeNotebookId: string | null;
  activeNoteId: string | null;
  setActiveNotebook: (id: string | null) => void;
  setActiveNote: (id: string | null) => void;
}
