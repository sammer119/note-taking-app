import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Notebook operations
  createNotebook: (data: { name: string }) =>
    ipcRenderer.invoke("db:createNotebook", data),
  getAllNotebooks: () => ipcRenderer.invoke("db:getAllNotebooks"),
  getNotebook: (id: string) => ipcRenderer.invoke("db:getNotebook", id),
  updateNotebook: (id: string, data: { name?: string }) =>
    ipcRenderer.invoke("db:updateNotebook", id, data),
  deleteNotebook: (id: string) => ipcRenderer.invoke("db:deleteNotebook", id),

  // Note operations
  createNote: (data: {
    notebookId: string;
    title: string;
    content?: string;
  }) => ipcRenderer.invoke("db:createNote", data),
  getNotesByNotebook: (notebookId: string) =>
    ipcRenderer.invoke("db:getNotesByNotebook", notebookId),
  getNote: (id: string) => ipcRenderer.invoke("db:getNote", id),
  updateNote: (id: string, data: { title?: string; content?: string }) =>
    ipcRenderer.invoke("db:updateNote", id, data),
  deleteNote: (id: string) => ipcRenderer.invoke("db:deleteNote", id),
  searchNotes: (query: string) => ipcRenderer.invoke("db:searchNotes", query),

  // Utility
  getDbPath: () => ipcRenderer.invoke("db:getPath"),
  isElectron: true,
});
