import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import {
  createNotebook,
  updateNotebook,
  deleteNotebook,
} from "@/lib/storage";
import { CreateNotebookDTO, UpdateNotebookDTO, Notebook } from "@/types";

/**
 * Custom hook for managing notebooks
 * Provides real-time updates from IndexedDB
 */
export function useNotebooks() {
  // Live query that automatically updates when the database changes
  const notebooks = useLiveQuery(
    async () => await db.notebooks.orderBy("updatedAt").reverse().toArray(),
    []
  );

  const create = async (data: CreateNotebookDTO): Promise<Notebook> => {
    return await createNotebook(data);
  };

  const update = async (
    id: string,
    data: UpdateNotebookDTO
  ): Promise<void> => {
    await updateNotebook(id, data);
  };

  const remove = async (id: string): Promise<void> => {
    await deleteNotebook(id);
  };

  return {
    notebooks: notebooks ?? [],
    loading: notebooks === undefined,
    create,
    update,
    remove,
  };
}
