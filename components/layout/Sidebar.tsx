"use client";

import { useState } from "react";
import { NotebookList } from "@/components/notebook/NotebookList";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Button } from "@/components/ui/button";
import { Search, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <aside
        className={`
          bg-sidebar-background flex flex-col h-screen border-r border-border/20
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-56'}
        `}
      >
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            {!isCollapsed && <h1 className="text-xl font-bold">Notes</h1>}

            {/* Burger Menu Toggle - Top Right */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 shrink-0 ${isCollapsed ? 'mx-auto' : 'ml-auto'}`}
              onClick={onToggle}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {!isCollapsed && (
            <p className="text-sm text-muted-foreground">Your digital workspace</p>
          )}

          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            size="sm"
            onClick={() => setSearchOpen(true)}
            title={isCollapsed ? "Search notes" : ""}
          >
            <Search className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Search notes...</span>}
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <NotebookList isCollapsed={isCollapsed} />
        </div>

        {/* Bottom Actions */}
        <div className="p-3 space-y-2">
          {/* Sign Out Button */}
          <Button
            variant="ghost"
            className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} text-muted-foreground hover:text-destructive`}
            size="sm"
            onClick={handleSignOut}
            title={isCollapsed ? "Sign out" : ""}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>

          {/* Theme Toggle */}
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
