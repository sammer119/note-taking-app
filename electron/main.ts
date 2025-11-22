import { app, BrowserWindow, ipcMain, protocol } from "electron";
import path from "path";
import Database from "better-sqlite3";
import { readFile } from "fs/promises";

let mainWindow: BrowserWindow | null = null;
let db: Database.Database | null = null;

// Register custom protocol as privileged BEFORE app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      allowServiceWorkers: true,
    },
  },
]);

function createWindow() {
  // Check if we're in development mode
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // In production, use app:// protocol
    mainWindow.loadURL("app://./index.html");
  }

  mainWindow.webContents.on("did-fail-load", (_, errorCode, errorDescription) => {
    console.error("Failed to load:", errorCode, errorDescription);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function initDatabase() {
  try {
    const userDataPath = app.getPath("userData");
    const dbPath = path.join(userDataPath, "notes.db");

    db = new Database(dbPath);

    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS notebooks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        notebookId TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (notebookId) REFERENCES notebooks(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_notes_notebookId ON notes(notebookId);
      CREATE INDEX IF NOT EXISTS idx_notes_updatedAt ON notes(updatedAt);
      CREATE INDEX IF NOT EXISTS idx_notebooks_updatedAt ON notebooks(updatedAt);
    `);
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

app.whenReady().then(() => {
  // Register custom protocol for loading static files
  protocol.handle("app", async (request) => {
    const filePath = request.url.slice("app://".length);
    const normalizedPath = path.normalize(filePath);
    const fullPath = path.join(process.resourcesPath, "out", normalizedPath);

    try {
      const data = await readFile(fullPath);
      // Determine content type based on file extension
      const ext = path.extname(fullPath).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new Response(data, {
        headers: { "content-type": contentType },
      });
    } catch (error) {
      console.error("Failed to load:", fullPath, error);
      return new Response("Not found", { status: 404 });
    }
  });

  initDatabase();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

app.on("before-quit", () => {
  if (db) {
    db.close();
  }
});

// IPC Handlers for database operations

// Notebook operations
ipcMain.handle("db:createNotebook", async (_, data: { name: string }) => {
  const notebook = {
    id: crypto.randomUUID(),
    name: data.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const stmt = db!.prepare(
    "INSERT INTO notebooks (id, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)"
  );
  stmt.run(notebook.id, notebook.name, notebook.createdAt, notebook.updatedAt);

  return {
    ...notebook,
    createdAt: new Date(notebook.createdAt),
    updatedAt: new Date(notebook.updatedAt),
  };
});

ipcMain.handle("db:getAllNotebooks", async () => {
  const stmt = db!.prepare("SELECT * FROM notebooks ORDER BY updatedAt DESC");
  const notebooks = stmt.all();

  return notebooks.map((nb: any) => ({
    ...nb,
    createdAt: new Date(nb.createdAt),
    updatedAt: new Date(nb.updatedAt),
  }));
});

ipcMain.handle("db:getNotebook", async (_, id: string) => {
  const stmt = db!.prepare("SELECT * FROM notebooks WHERE id = ?");
  const notebook = stmt.get(id);

  if (!notebook) return undefined;

  return {
    ...(notebook as any),
    createdAt: new Date((notebook as any).createdAt),
    updatedAt: new Date((notebook as any).updatedAt),
  };
});

ipcMain.handle(
  "db:updateNotebook",
  async (_, id: string, data: { name?: string }) => {
    const updatedAt = Date.now();
    const stmt = db!.prepare(
      "UPDATE notebooks SET name = COALESCE(?, name), updatedAt = ? WHERE id = ?"
    );
    stmt.run(data.name, updatedAt, id);
  }
);

ipcMain.handle("db:deleteNotebook", async (_, id: string) => {
  db!.exec("BEGIN TRANSACTION");
  try {
    const deleteNotes = db!.prepare("DELETE FROM notes WHERE notebookId = ?");
    deleteNotes.run(id);

    const deleteNotebook = db!.prepare("DELETE FROM notebooks WHERE id = ?");
    deleteNotebook.run(id);

    db!.exec("COMMIT");
  } catch (error) {
    db!.exec("ROLLBACK");
    throw error;
  }
});

// Note operations
ipcMain.handle(
  "db:createNote",
  async (
    _,
    data: { notebookId: string; title: string; content?: string }
  ) => {
    const note = {
      id: crypto.randomUUID(),
      notebookId: data.notebookId,
      title: data.title,
      content: data.content || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const stmt = db!.prepare(
      "INSERT INTO notes (id, notebookId, title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(
      note.id,
      note.notebookId,
      note.title,
      note.content,
      note.createdAt,
      note.updatedAt
    );

    return {
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    };
  }
);

ipcMain.handle("db:getNotesByNotebook", async (_, notebookId: string) => {
  const stmt = db!.prepare(
    "SELECT * FROM notes WHERE notebookId = ? ORDER BY updatedAt DESC"
  );
  const notes = stmt.all(notebookId);

  return notes.map((note: any) => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
  }));
});

ipcMain.handle("db:getNote", async (_, id: string) => {
  const stmt = db!.prepare("SELECT * FROM notes WHERE id = ?");
  const note = stmt.get(id);

  if (!note) return undefined;

  return {
    ...(note as any),
    createdAt: new Date((note as any).createdAt),
    updatedAt: new Date((note as any).updatedAt),
  };
});

ipcMain.handle(
  "db:updateNote",
  async (_, id: string, data: { title?: string; content?: string }) => {
    const updatedAt = Date.now();
    const stmt = db!.prepare(
      "UPDATE notes SET title = COALESCE(?, title), content = COALESCE(?, content), updatedAt = ? WHERE id = ?"
    );
    stmt.run(data.title, data.content, updatedAt, id);
  }
);

ipcMain.handle("db:deleteNote", async (_, id: string) => {
  const stmt = db!.prepare("DELETE FROM notes WHERE id = ?");
  stmt.run(id);
});

ipcMain.handle("db:searchNotes", async (_, query: string) => {
  const lowercaseQuery = `%${query.toLowerCase()}%`;
  const stmt = db!.prepare(
    "SELECT * FROM notes WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? ORDER BY updatedAt DESC"
  );
  const notes = stmt.all(lowercaseQuery, lowercaseQuery);

  return notes.map((note: any) => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
  }));
});

// Get database path (useful for debugging)
ipcMain.handle("db:getPath", async () => {
  return path.join(app.getPath("userData"), "notes.db");
});
