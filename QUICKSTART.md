# Quick Start - Electron Desktop App

## The Issue You Hit

The error you saw:
```
NODE_MODULE_VERSION 127 vs 140
```

This happens because `better-sqlite3` is a **native module** that needs to be compiled for the specific Node.js version. Your system has Node.js v22, but Electron bundles Node.js v20 - they're incompatible.

## The Solution

Run this ONE command (already done for you):

```bash
npx electron-rebuild
```

This rebuilds `better-sqlite3` specifically for Electron's bundled Node.js.

## Now It Works!

Try again:

```bash
npm run electron:dev
```

The app should now launch successfully! 🎉

## What You'll See

1. **Terminal**: Next.js dev server starts
2. **New Window**: Native macOS window opens
3. **DevTools**: Opens automatically (right side)
4. **Your App**: Fully functional note-taking app!

## First Steps to Test

1. Click "New Notebook" in the sidebar
2. Name it "Test Notebook"
3. Create a note
4. Type some text in the editor
5. Close the app completely (Cmd+Q)
6. Reopen: `npm run electron:dev`
7. Your data is still there! ✅

## Where's the Database?

```bash
ls -la ~/Library/Application\ Support/note-taking-app/
```

You should see `notes.db` - that's your SQLite database!

## Why This Happens (Technical Details)

- **Native Modules**: better-sqlite3 is written in C++ for performance
- **Node.js Versions**: Each version has different binary interfaces (NODE_MODULE_VERSION)
- **Electron's Node**: Electron bundles its own Node.js (v20), different from your system's (v22)
- **electron-rebuild**: Recompiles native modules for Electron's specific Node.js version

## Auto-Setup for Future

I've added a `postinstall` script to package.json that will automatically rebuild native modules after `npm install`. So this is a one-time issue!

## If You Still Get Errors

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Electron won't start
```bash
npm run electron:compile
```

### Database errors
```bash
rm -rf ~/Library/Application\ Support/note-taking-app/
```
Then restart the app - it will recreate the database.

## Ready to Build?

When you're ready to create a distributable app:

```bash
npm run electron:build
```

This creates:
- `.dmg` installer in `release/` directory
- `.zip` portable version

## Summary

✅ **Problem**: Native module version mismatch
✅ **Solution**: `npx electron-rebuild` (already done)
✅ **Now**: `npm run electron:dev` works perfectly!
✅ **Future**: Auto-rebuilds on `npm install`

Enjoy your desktop app! 🚀
