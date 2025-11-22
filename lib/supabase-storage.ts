import { supabase } from './supabase';
import {
  Notebook,
  Note,
  CreateNotebookDTO,
  UpdateNotebookDTO,
  CreateNoteDTO,
  UpdateNoteDTO,
} from '@/types';

/**
 * Supabase storage helper functions for managing notebooks and notes
 */

// ==================== Notebook Operations ====================

/**
 * Create a new notebook
 */
export async function createNotebook(
  data: CreateNotebookDTO
): Promise<Notebook> {
  const { data: notebook, error } = await supabase
    .from('notebooks')
    .insert({
      name: data.name,
      color: '#3b82f6',
    } as any)
    .select()
    .single() as any;

  if (error) throw error;
  if (!notebook) throw new Error('Failed to create notebook');

  return {
    id: notebook.id,
    name: notebook.name,
    createdAt: new Date(notebook.created_at),
    updatedAt: new Date(notebook.updated_at),
  };
}

/**
 * Get all notebooks
 */
export async function getAllNotebooks(): Promise<Notebook[]> {
  const { data: notebooks, error } = await supabase
    .from('notebooks')
    .select('*')
    .order('updated_at', { ascending: false }) as any;

  if (error) throw error;
  if (!notebooks) return [];

  return notebooks.map((nb: any) => ({
    id: nb.id,
    name: nb.name,
    createdAt: new Date(nb.created_at),
    updatedAt: new Date(nb.updated_at),
  }));
}

/**
 * Get a notebook by ID
 */
export async function getNotebook(id: string): Promise<Notebook | null> {
  const { data: notebook, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('id', id)
    .single() as any;

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  if (!notebook) return null;

  return {
    id: notebook.id,
    name: notebook.name,
    createdAt: new Date(notebook.created_at),
    updatedAt: new Date(notebook.updated_at),
  };
}

/**
 * Update a notebook
 */
export async function updateNotebook(
  id: string,
  data: UpdateNotebookDTO
): Promise<void> {
  const { error } = (await (supabase
    .from('notebooks') as any)
    .update({
      name: data.name,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)) as any;

  if (error) throw error;
}

/**
 * Delete a notebook and all its notes
 */
export async function deleteNotebook(id: string): Promise<void> {
  // Cascade delete is handled by the database foreign key constraint
  const { error } = await supabase.from('notebooks').delete().eq('id', id);

  if (error) throw error;
}

// ==================== Note Operations ====================

/**
 * Create a new note
 */
export async function createNote(data: CreateNoteDTO): Promise<Note> {
  const { data: note, error } = await supabase
    .from('notes')
    .insert({
      notebook_id: data.notebookId,
      title: data.title,
      content: data.content || '',
    } as any)
    .select()
    .single() as any;

  if (error) throw error;
  if (!note) throw new Error('Failed to create note');

  return {
    id: note.id,
    notebookId: note.notebook_id,
    title: note.title,
    content: note.content,
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
  };
}

/**
 * Get all notes in a notebook
 */
export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('notebook_id', notebookId)
    .order('updated_at', { ascending: false }) as any;

  if (error) throw error;
  if (!notes) return [];

  return notes.map((note: any) => ({
    id: note.id,
    notebookId: note.notebook_id,
    title: note.title,
    content: note.content,
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
  }));
}

/**
 * Get a note by ID
 */
export async function getNote(id: string): Promise<Note | null> {
  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single() as any;

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  if (!note) return null;

  return {
    id: note.id,
    notebookId: note.notebook_id,
    title: note.title,
    content: note.content,
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
  };
}

/**
 * Update a note
 */
export async function updateNote(id: string, data: UpdateNoteDTO): Promise<void> {
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  // Only include fields that are explicitly provided
  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.content !== undefined) {
    updateData.content = data.content;
  }

  const { error } = (await (supabase
    .from('notes') as any)
    .update(updateData)
    .eq('id', id)) as any;

  if (error) throw error;
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Search notes by title or content
 */
export async function searchNotes(query: string): Promise<Note[]> {
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('updated_at', { ascending: false }) as any;

  if (error) throw error;
  if (!notes) return [];

  return notes.map((note: any) => ({
    id: note.id,
    notebookId: note.notebook_id,
    title: note.title,
    content: note.content,
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
  }));
}

// ==================== Image Upload Operations ====================

/**
 * Upload an image to Supabase storage
 */
export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('note-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage.from('note-images').getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete an image from Supabase storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract file path from URL
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts[pathParts.length - 1];

  const { error } = await supabase.storage
    .from('note-images')
    .remove([filePath]);

  if (error) throw error;
}
