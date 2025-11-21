import { useState, useEffect } from "react";
import {
  createNotebook,
  updateNotebook,
  deleteNotebook,
  getAllNotebooks,
} from "@/lib/storage-adapter";
import { CreateNotebookDTO, UpdateNotebookDTO, Notebook } from "@/types";

/**
 * Custom hook for managing notebooks
 * Provides real-time updates from Supabase
 */
export function useNotebooks() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch notebooks on mount
  useEffect(() => {
    loadNotebooks();
  }, []);

  const loadNotebooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNotebooks();
      setNotebooks(data);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to load notebooks:", err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateNotebookDTO): Promise<Notebook> => {
    const notebook = await createNotebook(data);
    await loadNotebooks(); // Refresh list
    return notebook;
  };

  const update = async (
    id: string,
    data: UpdateNotebookDTO
  ): Promise<void> => {
    await updateNotebook(id, data);
    await loadNotebooks(); // Refresh list
  };

  const remove = async (id: string): Promise<void> => {
    await deleteNotebook(id);
    await loadNotebooks(); // Refresh list
  };

  return {
    notebooks,
    loading,
    error,
    create,
    update,
    remove,
    refresh: loadNotebooks,
  };
}
