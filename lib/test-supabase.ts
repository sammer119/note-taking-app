import { supabase } from './supabase';

/**
 * Test Supabase connection and database setup
 * Run this in the browser console to diagnose issues
 */
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  try {
    // Test 1: Check notebooks table
    console.log('1️⃣ Testing notebooks table...');
    const { data: notebooks, error: notebooksError } = await supabase
      .from('notebooks')
      .select('*')
      .limit(5);

    if (notebooksError) {
      console.error('❌ Notebooks table error:', notebooksError);
    } else {
      console.log('✅ Notebooks table accessible');
      console.log('   Found', notebooks.length, 'notebooks');
    }

    // Test 2: Check notes table
    console.log('\n2️⃣ Testing notes table...');
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .limit(5);

    if (notesError) {
      console.error('❌ Notes table error:', notesError);
      console.error('   Details:', JSON.stringify(notesError, null, 2));
    } else {
      console.log('✅ Notes table accessible');
      console.log('   Found', notes.length, 'notes');
    }

    // Test 3: Check storage bucket
    console.log('\n3️⃣ Testing storage bucket...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('❌ Storage error:', bucketsError);
    } else {
      console.log('✅ Storage accessible');
      const noteImagesBucket = buckets.find(b => b.name === 'note-images');
      if (noteImagesBucket) {
        console.log('   ✅ note-images bucket found');
        console.log('   Public:', noteImagesBucket.public);
      } else {
        console.log('   ❌ note-images bucket NOT found');
        console.log('   Available buckets:', buckets.map(b => b.name).join(', '));
      }
    }

    console.log('\n✅ Connection test complete!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Make it available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabaseConnection;
}
