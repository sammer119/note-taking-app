"use client";

import { useState } from "react";
import { Notebook } from "@/types";
import { Button } from "@/components/ui/button";
import { BookOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotebookItemProps {
  notebook: Notebook;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isCollapsed?: boolean;
}

export function NotebookItem({
  notebook,
  isActive,
  onClick,
  onEdit,
  onDelete,
  isCollapsed = false,
}: NotebookItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (isCollapsed) {
    return (
      <div
        className={cn(
          "group flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
          isActive && "bg-accent"
        )}
        onClick={onClick}
        title={notebook.name}
      >
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-accent",
        isActive && "bg-accent"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="truncate text-sm font-medium">{notebook.name}</span>
      </div>

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-popover border rounded-md shadow-md py-1 z-10 min-w-[120px]">
            <button
              className="w-full px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onEdit();
              }}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
            <button
              className="w-full px-3 py-2 text-sm hover:bg-accent text-destructive flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
