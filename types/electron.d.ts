export interface ElectronAPI {
  // Notebook operations
  createNotebook: (data: { name: string }) => Promise<any>;
  getAllNotebooks: () => Promise<any[]>;
  getNotebook: (id: string) => Promise<any | undefined>;
  updateNotebook: (id: string, data: { name?: string }) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;

  // Note operations
  createNote: (data: {
    notebookId: string;
    title: string;
    content?: string;
  }) => Promise<any>;
  getNotesByNotebook: (notebookId: string) => Promise<any[]>;
  getNote: (id: string) => Promise<any | undefined>;
  updateNote: (
    id: string,
    data: { title?: string; content?: string }
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<any[]>;

  // Utility
  getDbPath: () => Promise<string>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
