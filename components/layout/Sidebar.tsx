"use client";

import { NotebookList } from "@/components/notebook/NotebookList";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-sidebar-background flex flex-col h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold">Notes</h1>
          <ThemeToggle />
        </div>
        <p className="text-sm text-muted-foreground">Your digital workspace</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <NotebookList />
      </div>
    </aside>
  );
}
