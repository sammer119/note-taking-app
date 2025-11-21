"use client";

import { Note } from "@/types";
import { cn } from "@/lib/utils";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, isActive, onClick, onDelete }: NoteItemProps) {
  const getPreviewText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    return text.slice(0, 100);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - noteDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return noteDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return noteDate.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return noteDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className={cn(
        "group p-3 rounded-lg cursor-pointer transition-colors bg-card border hover:bg-accent",
        isActive && "bg-accent border-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium text-sm truncate">
              {note.title || "Untitled Note"}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {getPreviewText(note.content)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(note.updatedAt)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
