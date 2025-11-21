"use client";

import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/store";
import { useNote } from "@/hooks/useNotes";
import { updateNote } from "@/lib/storage-adapter";
import { Editor } from "@/components/editor/Editor";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";

export function NoteEditor() {
  const { activeNoteId, activeNotebookId, updateNoteInCache } = useAppStore();
  const { note, refresh } = useNote(activeNoteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [titleSaveTimeout, setTitleSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [contentSaveTimeout, setContentSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);

      // Focus and select title if it's a new "Untitled Note"
      if (note.title === "Untitled Note" && note.content === "") {
        setTimeout(() => {
          titleInputRef.current?.focus();
          titleInputRef.current?.select();
        }, 100);
      }
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (activeNoteId) {
      // Clear existing timeout
      if (titleSaveTimeout) clearTimeout(titleSaveTimeout);

      // Set new timeout to save after 1 second of inactivity
      const timeout = setTimeout(async () => {
        setIsSaving(true);
        try {
          await updateNote(activeNoteId, { title: newTitle });
          await refresh();
          // Update the cache immediately to reflect changes in the notes list
          if (activeNotebookId) {
            updateNoteInCache(activeNotebookId, activeNoteId, { title: newTitle });
          }
          // Keep "Saving..." visible for 500ms after save completes
          setTimeout(() => setIsSaving(false), 500);
        } catch (error) {
          console.error("Error updating title:", error);
          setIsSaving(false);
        }
      }, 1000);

      setTitleSaveTimeout(timeout);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (activeNoteId) {
      // Clear existing timeout
      if (contentSaveTimeout) clearTimeout(contentSaveTimeout);

      // Set new timeout to save after 1 second of inactivity
      const timeout = setTimeout(async () => {
        setIsSaving(true);
        try {
          await updateNote(activeNoteId, { content: newContent });
          await refresh();
          // Update the cache immediately to reflect changes in the notes list
          if (activeNotebookId) {
            updateNoteInCache(activeNotebookId, activeNoteId, { content: newContent });
          }
          // Keep "Saving..." visible for 500ms after save completes
          setTimeout(() => setIsSaving(false), 500);
        } catch (error) {
          console.error("Error updating content:", error);
          setIsSaving(false);
        }
      }, 1000);

      setContentSaveTimeout(timeout);
    }
  };

  if (!activeNoteId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Note Selected</h2>
        <p className="text-muted-foreground max-w-md">
          Select a note from the list or create a new one to start writing.
        </p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title"
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
          />
          {isSaving && (
            <span className="text-xs text-muted-foreground">Saving...</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Last edited: {new Date(note.updatedAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Editor
          content={content}
          onChange={handleContentChange}
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
}
