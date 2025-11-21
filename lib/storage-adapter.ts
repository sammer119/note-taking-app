import { isSupabaseConfigured } from './supabase';
import * as IndexedDBStorage from './storage';
import * as SupabaseStorage from './supabase-storage';
import {
  Notebook,
  Note,
  CreateNotebookDTO,
  UpdateNotebookDTO,
  CreateNoteDTO,
  UpdateNoteDTO,
} from '@/types';

/**
 * Storage adapter that automatically switches between IndexedDB and Supabase
 * based on configuration. Falls back to IndexedDB if Supabase is not configured.
 */

// ==================== Notebook Operations ====================

export async function createNotebook(
  data: CreateNotebookDTO
): Promise<Notebook> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.createNotebook(data);
  }
  return IndexedDBStorage.createNotebook(data);
}

export async function getAllNotebooks(): Promise<Notebook[]> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.getAllNotebooks();
  }
  return IndexedDBStorage.getAllNotebooks();
}

export async function getNotebook(id: string): Promise<Notebook | null | undefined> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.getNotebook(id);
  }
  return IndexedDBStorage.getNotebook(id);
}

export async function updateNotebook(
  id: string,
  data: UpdateNotebookDTO
): Promise<void> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.updateNotebook(id, data);
  }
  return IndexedDBStorage.updateNotebook(id, data);
}

export async function deleteNotebook(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.deleteNotebook(id);
  }
  return IndexedDBStorage.deleteNotebook(id);
}

// ==================== Note Operations ====================

export async function createNote(data: CreateNoteDTO): Promise<Note> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.createNote(data);
  }
  return IndexedDBStorage.createNote(data);
}

export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.getNotesByNotebook(notebookId);
  }
  return IndexedDBStorage.getNotesByNotebook(notebookId);
}

export async function getNote(id: string): Promise<Note | null | undefined> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.getNote(id);
  }
  return IndexedDBStorage.getNote(id);
}

export async function updateNote(id: string, data: UpdateNoteDTO): Promise<void> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.updateNote(id, data);
  }
  return IndexedDBStorage.updateNote(id, data);
}

export async function deleteNote(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.deleteNote(id);
  }
  return IndexedDBStorage.deleteNote(id);
}

export async function searchNotes(query: string): Promise<Note[]> {
  if (isSupabaseConfigured) {
    return SupabaseStorage.searchNotes(query);
  }
  return IndexedDBStorage.searchNotes(query);
}

// ==================== Image Upload Operations ====================

export async function uploadImage(file: File): Promise<string> {
  console.log('uploadImage called:', {
    fileName: file.name,
    fileSize: file.size,
    isSupabaseConfigured
  });

  if (isSupabaseConfigured) {
    console.log('Attempting Supabase upload...');
    try {
      const url = await SupabaseStorage.uploadImage(file);
      console.log('Supabase upload successful:', url);
      return url;
    } catch (error) {
      console.error('Supabase image upload failed:', error);
      // Re-throw the error so the UI can handle it
      throw new Error('Failed to upload image to storage. Please check your storage bucket configuration.');
    }
  }
  // Fallback to base64 if Supabase is not configured
  console.warn('Supabase not configured, using base64 encoding for images');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (isSupabaseConfigured && !imageUrl.startsWith('data:')) {
    return SupabaseStorage.deleteImage(imageUrl);
  }
  // Nothing to do for base64 images
  return Promise.resolve();
}

// Export helper to check which backend is being used
export function getStorageBackend(): 'supabase' | 'indexeddb' {
  return isSupabaseConfigured ? 'supabase' : 'indexeddb';
}
