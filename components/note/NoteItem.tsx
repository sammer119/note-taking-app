"use client";

import { Note } from "@/types";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, isActive, onClick, onDelete }: NoteItemProps) {
  const getContentPreview = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Parse content to maintain order
    let textPreview = "";
    let imageUrl: string | null = null;
    let imageFirst = false;

    // Check if first child is an image
    const firstChild = temp.firstChild;
    if (firstChild && firstChild.nodeName === 'IMG') {
      imageFirst = true;
      imageUrl = (firstChild as HTMLImageElement).src;
    } else if (firstChild && firstChild.nodeName === 'P') {
      const img = (firstChild as HTMLElement).querySelector('img');
      if (img) {
        imageFirst = true;
        imageUrl = img.src;
      }
    }

    // Get text preview (limited to 60 chars)
    const text = temp.textContent || temp.innerText || "";
    textPreview = text.slice(0, 60);

    // If we haven't found an image yet, look for any image
    if (!imageUrl) {
      const img = temp.querySelector("img");
      imageUrl = img?.src || null;
    }

    return { textPreview, imageUrl, imageFirst };
  };

  const getTitleDisplay = () => {
    let title = "";
    if (note.title && note.title !== "Untitled Note") {
      title = note.title;
    } else {
      // If no title or is "Untitled Note", use first few words of content
      const { textPreview } = getContentPreview(note.content);
      if (textPreview) {
        const firstLine = textPreview.split('\n')[0].slice(0, 40);
        title = firstLine || "New Note";
      } else {
        title = "New Note";
      }
    }

    // Truncate to 25 characters with ellipsis
    if (title.length > 25) {
      return title.slice(0, 25) + "...";
    }
    return title;
  };

  const formatDate = (date: Date) => {
    const noteDate = new Date(date);
    return noteDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isUntitled = !note.title || note.title === "Untitled Note";
  const { textPreview, imageUrl, imageFirst } = getContentPreview(note.content);

  return (
    <div
      className={cn(
        "group p-4 rounded-lg cursor-pointer transition-all duration-200 border",
        isActive
          ? "bg-card border-blue-500!"
          : "bg-card/50 border-border/30 hover:bg-card/70 hover:border-border/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <h3 className={cn(
              "font-semibold text-sm truncate",
              isActive ? "text-foreground" : "text-foreground/90",
              isUntitled && "italic"
            )}>
              {getTitleDisplay()}
            </h3>
          </div>

          {/* Show content in original order */}
          {imageFirst && imageUrl && (
            <div className="mb-1">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-20 object-cover rounded border border-border/50"
              />
            </div>
          )}

          <p className={cn(
            "text-xs line-clamp-2 break-all overflow-hidden",
            isActive ? "text-foreground/90" : "text-foreground/70"
          )}>
            {textPreview}
          </p>

          {!imageFirst && imageUrl && (
            <div className="mt-1 mb-1">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-20 object-cover rounded border border-border/50"
              />
            </div>
          )}

          <p className={cn(
            "text-[11px] mt-1",
            isActive ? "text-muted-foreground/70" : "text-muted-foreground/60"
          )}>
            {formatDate(note.updatedAt)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-transparent"
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
