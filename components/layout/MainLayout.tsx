"use client";

import { Sidebar } from "./Sidebar";
import { NoteList } from "@/components/note/NoteList";
import { NoteEditor } from "./NoteEditor";
import { StorageBanner } from "@/components/ui/storage-banner";

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StorageBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="w-80 border-r bg-note-list-background flex flex-col h-full">
          <NoteList />
        </div>
        <div className="flex-1 overflow-hidden bg-editor-background">
          <NoteEditor />
        </div>
      </div>
    </div>
  );
}
