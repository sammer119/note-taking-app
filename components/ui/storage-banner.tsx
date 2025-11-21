"use client";

import { useEffect, useState } from "react";
import { getStorageBackend } from "@/lib/storage-adapter";
import { Database, Cloud, X } from "lucide-react";

export function StorageBanner() {
  const [backend, setBackend] = useState<'supabase' | 'indexeddb' | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setBackend(getStorageBackend());
    // Check if banner was previously dismissed
    const wasDismissed = localStorage.getItem('storage-banner-dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('storage-banner-dismissed', 'true');
  };

  if (dismissed || !backend || backend === 'supabase') {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
          <Database className="h-4 w-4" />
          <span>
            <strong>Local Mode:</strong> Using IndexedDB storage. Data is saved locally in your browser.{" "}
            <a
              href="/SUPABASE_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900 dark:hover:text-amber-100"
            >
              Set up Supabase
            </a>{" "}
            for cloud sync and image uploads.
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
