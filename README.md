# Notes App - Modern Note-Taking Application

A feature-rich, Evernote-alternative note-taking application built with Next.js, TypeScript, and modern web technologies. Works offline with local storage or online with Supabase cloud sync.

## Features

- **Notebooks**: Organize notes into separate notebooks
- **Rich Text Editor**: Powered by Tiptap with support for formatting (bold, italic, headings, lists, etc.)
- **Image Support**: Upload and embed images directly in your notes (Supabase mode)
- **Dual Storage Modes**:
  - **Local Mode**: Client-side storage using IndexedDB (no backend required, works offline)
  - **Cloud Mode**: Supabase backend for cloud sync and image uploads
- **Real-time Updates**: Automatic UI updates when data changes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in light/dark theme support
- **Modern UI**: Clean, distraction-free interface built with Tailwind CSS

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Code Quality**: ESLint + Prettier

## Project Structure

```
note-taking-app/
├── src/
│   └── app/                 # Next.js App Router
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Home page
│       └── globals.css      # Global styles
├── components/
│   ├── notebook/            # Notebook components
│   ├── note/                # Note components
│   ├── editor/              # Rich text editor
│   ├── layout/              # Layout components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── db.ts                # Dexie database config
│   ├── storage.ts           # Storage helper functions
│   └── utils.ts             # Utility functions
├── hooks/
│   ├── useNotebooks.ts      # Notebook operations hook
│   └── useNotes.ts          # Note operations hook
├── store/
│   └── store.ts             # Zustand state management
├── types/
│   └── index.ts             # TypeScript type definitions
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm
- (Optional) Supabase account for cloud sync

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**That's it!** The app will run in **Local Mode** using IndexedDB for storage.

### Optional: Enable Cloud Sync with Supabase

To enable cloud storage and image uploads:

1. Follow the detailed setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

2. Create a `.env.local` file with your Supabase credentials:
```bash
cp .env.local.example .env.local
```

3. Add your Supabase URL and API key to `.env.local`

4. Restart the development server

The app will automatically detect Supabase configuration and switch to **Cloud Mode**.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Formatting

This project uses Prettier for code formatting. Format your code with:

```bash
npx prettier --write .
```

## Data Model

### Notebook
```typescript
interface Notebook {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Note
```typescript
interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string;  // HTML from Tiptap
  createdAt: Date;
  updatedAt: Date;
}
```

## Architecture

### State Management

The application uses a hybrid state management approach:
- **Zustand**: For UI state (active notebook/note selection)
- **Dexie React Hooks**: For database state with automatic reactivity

### Data Storage

All data is stored locally in the browser using IndexedDB:
- **Advantages**: No backend required, works offline, fast performance
- **Limitations**: Data is device-specific, no cross-device sync (yet)

### Future Enhancements

Planned features for future versions:
- [ ] Cloud sync and backup
- [ ] User authentication
- [ ] Image upload support
- [ ] Tags and advanced search
- [ ] Export to PDF/Markdown
- [ ] Dark mode toggle
- [ ] Markdown support
- [ ] Note templates
- [ ] Collaborative editing

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

IndexedDB is required and supported in all modern browsers.

## Acknowledgments

- [Tiptap](https://tiptap.dev/) for the excellent rich text editor
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Dexie.js](https://dexie.org/) for simplifying IndexedDB
