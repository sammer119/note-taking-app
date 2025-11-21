# Supabase Setup Guide

This guide will walk you through setting up Supabase as the backend for your note-taking app, including database tables and image storage.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your note-taking app repository cloned locally

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `note-taking-app` (or your preferred name)
   - **Database Password**: Create a strong password and save it securely
   - **Region**: Choose the region closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, navigate to **Settings** → **API**
2. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
3. Keep this tab open - you'll need these values in Step 5

## Step 3: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Notebooks table
create table notebooks (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  color text not null default '#3b82f6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notes table
create table notes (
  id uuid default uuid_generate_v4() primary key,
  notebook_id uuid references notebooks(id) on delete cascade not null,
  title text not null,
  content text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index notes_notebook_id_idx on notes(notebook_id);
create index notes_updated_at_idx on notes(updated_at desc);
create index notebooks_updated_at_idx on notebooks(updated_at desc);

-- Enable Row Level Security
alter table notebooks enable row level security;
alter table notes enable row level security;

-- Create policies (allow all for now - you can add authentication later)
create policy "Allow all access to notebooks" on notebooks for all using (true);
create policy "Allow all access to notes" on notes for all using (true);
```

4. Click **"Run"** or press `Ctrl/Cmd + Enter`
5. You should see a success message: "Success. No rows returned"

## Step 4: Set Up Storage Bucket for Images

1. In your Supabase dashboard, navigate to **Storage**
2. Click **"Create a new bucket"**
3. Configure the bucket:
   - **Name**: `note-images`
   - **Public bucket**: Toggle **ON** (this allows images to be publicly accessible)
4. Click **"Create bucket"**

### Configure Storage Policies

1. Click on the `note-images` bucket you just created
2. Go to the **Policies** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Create a policy for uploads:
   - **Policy name**: `Allow public uploads`
   - **Policy definition**:
   ```sql
   true
   ```
   - **Allowed operations**: SELECT `INSERT`
6. Click **"Review"** and then **"Save policy"**
7. Create another policy for reading:
   - **Policy name**: `Allow public reads`
   - **Policy definition**:
   ```sql
   true
   ```
   - **Allowed operations**: SELECT `SELECT`
8. Click **"Review"** and then **"Save policy"**

Alternatively, you can use the SQL editor to create these policies:

```sql
-- Allow anyone to upload images
create policy "Allow public uploads"
on storage.objects for insert
to public
with check (bucket_id = 'note-images');

-- Allow anyone to view images
create policy "Allow public reads"
on storage.objects for select
to public
using (bucket_id = 'note-images');

-- Optional: Allow deleting images
create policy "Allow public deletes"
on storage.objects for delete
to public
using (bucket_id = 'note-images');
```

## Step 5: Configure Your Local Environment

1. In your project root, create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   # Application Configuration
   NEXT_PUBLIC_APP_NAME="Notes App"

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace the values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Paste your Project URL from Step 2
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Paste your anon public key from Step 2

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Test the following:
   - ✅ Create a new notebook
   - ✅ Create a new note
   - ✅ Edit note content
   - ✅ Upload an image using the image button in the editor toolbar
   - ✅ Refresh the page - your data should persist

4. Verify in Supabase:
   - Go to **Table Editor** in your Supabase dashboard
   - Check the `notebooks` and `notes` tables - you should see your data
   - Go to **Storage** → `note-images` - you should see uploaded images

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Make sure your `.env.local` file exists in the project root
- Verify the environment variable names match exactly (including `NEXT_PUBLIC_` prefix)
- Restart your development server after creating/modifying `.env.local`

### Error: "Failed to upload image"

- Verify the `note-images` bucket exists and is public
- Check that storage policies are correctly configured
- Ensure your image is under 5MB

### Data not persisting

- Check the browser console for errors
- Verify your Supabase credentials are correct
- Make sure the database tables were created successfully
- Check that RLS policies allow public access

### Network errors

- Verify your Project URL is correct (should start with `https://`)
- Check your internet connection
- Make sure Supabase isn't experiencing downtime (check https://status.supabase.com)

## Next Steps

Now that Supabase is configured, you can:

1. **Add Authentication**: Implement user accounts with Supabase Auth
2. **Add Search**: Use Supabase's full-text search capabilities
3. **Real-time Updates**: Enable real-time subscriptions for collaborative editing
4. **Deploy**: Deploy your app to Vercel, Netlify, or your preferred platform

## Security Notes

**Important**: The current setup allows public access to all data. This is fine for development and personal use, but for production, you should:

1. Enable Supabase Authentication
2. Update RLS policies to restrict access based on user authentication
3. Add user ownership to notebooks and notes tables
4. Implement proper authorization checks

Example production policy:
```sql
-- Only allow users to access their own notebooks
create policy "Users can only access their own notebooks"
on notebooks for all
using (auth.uid() = user_id);
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
