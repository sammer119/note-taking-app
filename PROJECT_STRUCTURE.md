# Project Structure Overview

This document provides an overview of the note-taking application's file structure and organization.

## Root Directory

```
note-taking-app/
├── src/                    # Source code with Next.js App Router
├── components/             # React components
├── lib/                    # Utility libraries and helpers
├── hooks/                  # Custom React hooks
├── store/                  # State management
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── node_modules/           # Dependencies (not in git)
└── Configuration files
```

## Detailed Structure

### `/src/app/` - Next.js App Router
- `layout.tsx` - Root layout component that wraps all pages
- `page.tsx` - Home page / main application view
- `globals.css` - Global styles with Tailwind CSS v4 and custom CSS variables

### `/components/` - React Components

#### `/components/notebook/`
Components for notebook management:
- `NotebookList.tsx` - Displays list of all notebooks
- `NotebookItem.tsx` - Individual notebook item component
- `NotebookForm.tsx` - Form for creating/editing notebooks

#### `/components/note/`
Components for note management:
- `NoteList.tsx` - Displays list of notes in a notebook
- `NoteItem.tsx` - Individual note item component
- `NotePreview.tsx` - Note preview/card component

#### `/components/editor/`
Rich text editor components:
- `Editor.tsx` - Main Tiptap editor component
- `EditorToolbar.tsx` - Formatting toolbar for the editor

#### `/components/layout/`
Application layout components:
- `Sidebar.tsx` - Sidebar for navigation (notebooks list)
- `MainLayout.tsx` - Main application layout structure

#### `/components/ui/`
Reusable UI components from shadcn/ui (to be added):
- Button, Input, Card, Dialog, etc.

### `/lib/` - Libraries and Utilities

- `db.ts` - Dexie.js database configuration
  - Defines the NotesDatabase class
  - Creates database schema for notebooks and notes tables
  - Exports singleton db instance

- `storage.ts` - Storage helper functions
  - CRUD operations for notebooks
  - CRUD operations for notes
  - Search functionality
  - All operations use the Dexie.js database

- `utils.ts` - General utility functions
  - `cn()` function for merging Tailwind classes

### `/hooks/` - Custom React Hooks

- `useNotebooks.ts` - Hook for notebook operations
  - Returns live-updating list of notebooks
  - Provides create, update, delete functions
  - Uses Dexie React Hooks for reactivity

- `useNotes.ts` - Hook for note operations
  - `useNotes(notebookId)` - Returns notes for a specific notebook
  - `useNote(noteId)` - Returns a single note
  - Provides create, update, delete functions
  - Uses Dexie React Hooks for reactivity

### `/store/` - State Management

- `store.ts` - Zustand store
  - Manages active notebook selection
  - Manages active note selection
  - Provides setters for updating UI state

### `/types/` - TypeScript Definitions

- `index.ts` - Core type definitions
  - `Notebook` - Notebook entity interface
  - `Note` - Note entity interface
  - `CreateNotebookDTO` - Data transfer object for creating notebooks
  - `UpdateNotebookDTO` - Data transfer object for updating notebooks
  - `CreateNoteDTO` - Data transfer object for creating notes
  - `UpdateNoteDTO` - Data transfer object for updating notes
  - `AppState` - Zustand store state interface

### `/public/` - Static Assets
- Favicon, images, and other static files

## Configuration Files

### TypeScript Configuration
- `tsconfig.json` - TypeScript compiler configuration
  - Strict mode enabled
  - Path aliases configured (`@/*`)

### Next.js Configuration
- `next.config.ts` - Next.js configuration
- `next-env.d.ts` - Next.js TypeScript declarations

### Styling Configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4
- `components.json` - shadcn/ui configuration

### Code Quality
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from Prettier

### Environment
- `.env.local.example` - Template for environment variables
- `.env.local` - Local environment variables (not in git)

### Git
- `.gitignore` - Files and folders to exclude from version control

### Package Management
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions

## Data Flow

### Reading Data
1. Component uses custom hook (`useNotebooks` or `useNotes`)
2. Hook uses `useLiveQuery` from Dexie React Hooks
3. Query reads from IndexedDB via Dexie
4. Data automatically updates when IndexedDB changes

### Writing Data
1. Component calls function from hook (e.g., `create()`, `update()`)
2. Hook calls function from `storage.ts`
3. Storage function writes to IndexedDB via Dexie
4. `useLiveQuery` automatically detects change and re-renders component

### UI State
1. Component uses Zustand store (`useAppStore`)
2. Component reads/writes active notebook/note IDs
3. State updates trigger re-renders

## Key Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Tiptap** - Headless rich text editor
- **Dexie.js** - IndexedDB wrapper with React hooks
- **Zustand** - Lightweight state management
- **shadcn/ui** - Reusable UI components

## Development Workflow

1. **Start Dev Server**: `npm run dev`
2. **Build for Production**: `npm run build`
3. **Run Production Build**: `npm start`
4. **Lint Code**: `npm run lint`
5. **Format Code**: `npx prettier --write .`

## Next Steps

The foundation is now complete. The next tasks will be:
1. Building the UI components
2. Creating the notebook management interface
3. Creating the note editor with Tiptap
4. Implementing the main application layout
5. Adding styling and polish
