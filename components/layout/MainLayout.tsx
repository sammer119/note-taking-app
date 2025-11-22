"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { NoteList } from "@/components/note/NoteList";
import { NoteEditor } from "./NoteEditor";
import { StorageBanner } from "@/components/ui/storage-banner";
import { Toaster } from "@/components/ui/toaster";

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  const handleToggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <StorageBanner />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />
          <div className="w-72 min-w-72 max-w-72 bg-note-list-background flex flex-col h-full shrink-0">
            <NoteList />
          </div>
          <div className="flex-1 overflow-hidden bg-editor-background min-w-0">
            <NoteEditor />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
