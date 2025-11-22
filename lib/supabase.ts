import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Debug logging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase Configuration:', {
    isConfigured: isSupabaseConfigured,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl?.substring(0, 30) + '...',
  });
}

// Create a dummy client if not configured (to avoid runtime errors)
// This allows the app to run with IndexedDB fallback
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder-key';

export const supabase = createClient<Database>(
  supabaseUrl || dummyUrl,
  supabaseAnonKey || dummyKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);
