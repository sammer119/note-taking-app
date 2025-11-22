"use client";

import { useState, useEffect } from "react";
import { useNotebooks } from "@/hooks/useNotebooks";
import { useAppStore } from "@/store/store";
import { NotebookItem } from "./NotebookItem";
import { NotebookForm } from "./NotebookForm";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

interface NotebookListProps {
  isCollapsed?: boolean;
}

export function NotebookList({ isCollapsed = false }: NotebookListProps) {
  const { notebooks, create, update, remove } = useNotebooks();
  const { activeNotebookId, setActiveNotebook } = useAppStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Auto-select the first notebook (most recently updated) when notebooks are loaded
  useEffect(() => {
    if (notebooks.length > 0 && !activeNotebookId) {
      setActiveNotebook(notebooks[0].id);
    }
  }, [notebooks, activeNotebookId, setActiveNotebook]);

  const handleCreate = async (name: string) => {
    const notebook = await create({ name });
    setActiveNotebook(notebook.id);
  };

  const handleEdit = async (name: string) => {
    if (!editingNotebook) return;
    await update(editingNotebook.id, { name });
    setEditingNotebook(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this notebook? All notes in this notebook will be deleted.")) {
      await remove(id);
      if (activeNotebookId === id) {
        setActiveNotebook(null);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full justify-start bg-green-500 hover:bg-green-600 text-white border-0"
          size="sm"
          title={isCollapsed ? "New Notebook" : ""}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New Notebook</span>}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-2 space-y-2">
          {notebooks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {!isCollapsed && (
                <>
                  No notebooks yet.
                  <br />
                  Create one to get started!
                </>
              )}
            </div>
          ) : (
            notebooks.map((notebook) => (
              <NotebookItem
                key={notebook.id}
                notebook={notebook}
                isActive={activeNotebookId === notebook.id}
                onClick={() => setActiveNotebook(notebook.id)}
                onEdit={() =>
                  setEditingNotebook({ id: notebook.id, name: notebook.name })
                }
                onDelete={() => handleDelete(notebook.id)}
                isCollapsed={isCollapsed}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <NotebookForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        mode="create"
      />

      <NotebookForm
        open={editingNotebook !== null}
        onOpenChange={(open) => !open && setEditingNotebook(null)}
        onSubmit={handleEdit}
        initialName={editingNotebook?.name || ""}
        mode="edit"
      />
    </div>
  );
}
