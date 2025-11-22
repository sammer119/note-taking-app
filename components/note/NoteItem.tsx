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

  const getTitleDisplay = () => {
    if (note.title && note.title !== "Untitled Note") {
      return note.title;
    }
    // If no title or is "Untitled Note", use first few words of content
    const preview = getPreviewText(note.content);
    if (preview) {
      const firstLine = preview.split('\n')[0].slice(0, 40);
      return firstLine || "New Note";
    }
    return "New Note";
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

  const isUntitled = !note.title || note.title === "Untitled Note";

  return (
    <div
      className={cn(
        "group p-3 rounded-lg cursor-pointer transition-all duration-200 border",
        isActive
          ? "bg-card border-border border-l-4 border-l-primary"
          : "bg-card/50 border-border/30 hover:bg-card/70 hover:border-border/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-3 w-3 text-muted-foreground/70 flex-shrink-0" />
            <h3 className={cn(
              "font-medium text-sm truncate",
              isActive ? "text-foreground" : "text-muted-foreground",
              isUntitled && "italic"
            )}>
              {getTitleDisplay()}
            </h3>
          </div>
          <p className={cn(
            "text-xs line-clamp-2 wrap-break-word",
            isActive ? "text-muted-foreground/80" : "text-muted-foreground/60"
          )}>
            {getPreviewText(note.content)}
          </p>
          <p className={cn(
            "text-[10px] mt-1",
            isActive ? "text-muted-foreground/60" : "text-muted-foreground/50"
          )}>
            {formatDate(note.updatedAt)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4 text-red-400 font-bold stroke-[2.5] hover:text-red-500 transition-colors" />
        </Button>
      </div>
    </div>
  );
}
