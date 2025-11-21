"use client";

import { useNotes } from "@/hooks/useNotes";
import { useAppStore } from "@/store/store";
import { NoteItem } from "./NoteItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

export function NoteList() {
  const { activeNotebookId, activeNoteId, setActiveNote } = useAppStore();
  const { notes, create, remove } = useNotes(activeNotebookId);

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

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <Button onClick={handleCreateNote} className="w-full" size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
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
