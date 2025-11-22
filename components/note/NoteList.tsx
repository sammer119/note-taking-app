"use client";

import { useNotes } from "@/hooks/useNotes";
import { useAppStore } from "@/store/store";
import { NoteItem } from "./NoteItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useEffect } from "react";

export function NoteList() {
  const { activeNotebookId, activeNoteId, setActiveNote, notebooks } = useAppStore();
  const { notes, create, remove } = useNotes(activeNotebookId);

  // Auto-select the first note (most recently edited) when notes are loaded
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNote(notes[0].id);
    }
  }, [notes, activeNoteId, setActiveNote]);

  const handleCreateNote = async () => {
    if (!activeNotebookId) return;

    const note = await create({
      notebookId: activeNotebookId,
      title: "Untitled Note",
      content: "",
    });
    setActiveNote(note.id);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await remove(id);
      if (activeNoteId === id) {
        setActiveNote(null);
      }
    }
  };

  if (!activeNotebookId) {
    return (
      <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground p-8">
        Select a notebook to view notes
      </div>
    );
  }

  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 pb-3 space-y-3">
        <div className="flex items-center justify-between px-2 gap-2">
          <h2 className="font-semibold text-lg truncate min-w-0 flex-1">
            {activeNotebook?.name || "Notes"}
          </h2>
          <p className="text-xs text-muted-foreground shrink-0">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <Button onClick={handleCreateNote} className="w-full bg-green-500 hover:bg-green-600 text-white border-0" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="pl-2 pr-3 py-2 space-y-3">
          {notes.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No notes yet.
              <br />
              Create one to get started!
            </div>
          ) : (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNoteId === note.id}
                onClick={() => setActiveNote(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
