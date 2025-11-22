"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { searchNotes } from "@/lib/storage-adapter";
import { Note } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const { setActiveNotebook, setActiveNote } = useAppStore();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchNotes(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectNote = (note: Note) => {
    setActiveNotebook(note.notebookId);
    setActiveNote(note.id);
    onOpenChange(false);
    setQuery("");
  };

  const getPreviewText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    return text.slice(0, 150);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Notes
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or content..."
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh] px-6 pb-6">
          {loading && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Searching...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No results found for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all",
                    "bg-card border border-border hover:border-primary/50 hover:bg-accent"
                  )}
                  onClick={() => handleSelectNote(note)}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">
                        {highlightMatch(note.title || "Untitled Note", query)}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {highlightMatch(getPreviewText(note.content), query)}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        Last edited: {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Start typing to search your notes...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
