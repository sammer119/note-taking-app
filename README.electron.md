# Notes App - Electron Desktop Version

This is a cross-platform desktop note-taking application built with Next.js and Electron, featuring SQLite database storage.

## Features

- Full-featured rich text editor with TipTap
- Notebook and note organization
- SQLite database for reliable local storage
- Cross-platform support (macOS, Windows)
- Dark/light theme support
- Offline-first architecture

## Development

### Prerequisites

- Node.js 18+
- npm

### Running in Development Mode

1. Install dependencies:
```bash
npm install
```

2. Rebuild native modules for Electron (required for better-sqlite3):
```bash
npx electron-rebuild
```

3. Start the Electron app in development mode:
```bash
npm run electron:dev
```

This will:
- Start the Next.js dev server on http://localhost:3000
- Launch the Electron app window
- Enable hot reload for both frontend and Electron changes

### Building for Production

#### macOS

Build a DMG and ZIP for macOS:
```bash
npm run electron:build
```

The built apps will be in the `release` directory.

#### Windows

On a Windows machine or using a VM, run:
```bash
npm run electron:build
```

This will create:
- NSIS installer (.exe)
- Portable executable

## Project Structure

```
note-taking-app/
├── electron/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Electron preload script (IPC bridge)
├── src/
│   └── app/             # Next.js app directory
├── components/          # React components
├── lib/
│   ├── storage-unified.ts  # Storage abstraction layer
│   └── db.ts            # IndexedDB (Dexie) for web version
└── types/
    └── electron.d.ts    # TypeScript definitions for Electron API
```

## Storage System

The app uses a unified storage abstraction that automatically detects the environment:

- **Desktop (Electron)**: SQLite via better-sqlite3
  - Database location: `~/Library/Application Support/note-taking-app/notes.db` (macOS)
  - Supports full SQL queries and transactions

- **Web**: IndexedDB via Dexie
  - Browser-based storage
  - Same API as desktop version

## Architecture

### Electron Main Process ([electron/main.ts](electron/main.ts))

Handles:
- Window management
- SQLite database initialization and operations
- IPC (Inter-Process Communication) handlers
- File system access

### Preload Script ([electron/preload.ts](electron/preload.ts))

Provides a secure bridge between:
- Renderer process (Next.js/React)
- Main process (Electron)

Uses `contextBridge` to expose database operations safely.

### Storage Abstraction ([lib/storage-unified.ts](lib/storage-unified.ts))

Automatically switches between:
- SQLite (when running in Electron)
- IndexedDB (when running in browser)

All database operations use the same API regardless of the underlying storage.

## Scripts

- `npm run dev` - Start Next.js dev server only
- `npm run electron:dev` - Start Electron app in development mode
- `npm run electron:compile` - Compile TypeScript Electron files
- `npm run electron:build` - Build production app for current platform
- `npm run build` - Build Next.js for production

## Database Schema

### Notebooks Table
```sql
CREATE TABLE notebooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
```

### Notes Table
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  notebookId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (notebookId) REFERENCES notebooks(id) ON DELETE CASCADE
);
```

## Troubleshooting

### Port 3000 already in use

Kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### SQLite database location

To find where your database is stored:
- macOS: `~/Library/Application Support/note-taking-app/notes.db`
- Windows: `%APPDATA%\note-taking-app\notes.db`

### Rebuilding native modules

If you encounter NODE_MODULE_VERSION errors with better-sqlite3:
```bash
npx electron-rebuild
```

This rebuilds native modules specifically for Electron's bundled Node.js version.

## Next Steps

- [ ] Add menu bar with File/Edit/View options
- [ ] Implement export/import functionality
- [ ] Add keyboard shortcuts
- [ ] Implement auto-save
- [ ] Add app icons for all platforms
- [ ] Set up code signing for macOS
- [ ] Create Windows installer with proper signing
