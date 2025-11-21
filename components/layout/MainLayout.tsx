"use client";

import { Sidebar } from "./Sidebar";
import { NoteList } from "@/components/note/NoteList";
import { NoteEditor } from "./NoteEditor";

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-80 border-r bg-note-list-background flex flex-col h-screen">
        <NoteList />
      </div>
      <div className="flex-1 overflow-hidden bg-editor-background">
        <NoteEditor />
      </div>
    </div>
  );
}
