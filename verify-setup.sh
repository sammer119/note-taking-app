#!/bin/bash

echo "🔍 Verifying Electron setup for macOS..."
echo ""

# Check Node.js
echo "✓ Node.js version:"
node --version

# Check npm
echo ""
echo "✓ npm version:"
npm --version

# Check if Electron is installed
echo ""
echo "✓ Electron version:"
npx electron --version 2>/dev/null || echo "❌ Electron not found"

# Check if better-sqlite3 is installed
echo ""
echo "✓ better-sqlite3:"
if [ -d "node_modules/better-sqlite3" ]; then
    echo "  Installed ✓"
else
    echo "  ❌ Not found - run 'npm install'"
fi

# Check if compiled Electron files exist
echo ""
echo "✓ Compiled Electron files:"
if [ -f "dist-electron/main.js" ] && [ -f "dist-electron/preload.js" ]; then
    echo "  main.js ✓"
    echo "  preload.js ✓"
else
    echo "  ❌ Not found - run 'npm run electron:compile'"
fi

# Check if required directories exist
echo ""
echo "✓ Project structure:"
[ -d "electron" ] && echo "  electron/ ✓" || echo "  ❌ electron/ missing"
[ -d "lib" ] && echo "  lib/ ✓" || echo "  ❌ lib/ missing"
[ -d "types" ] && echo "  types/ ✓" || echo "  ❌ types/ missing"

# Check storage files
echo ""
echo "✓ Storage implementation:"
[ -f "lib/storage-unified.ts" ] && echo "  storage-unified.ts ✓" || echo "  ❌ storage-unified.ts missing"
[ -f "types/electron.d.ts" ] && echo "  electron.d.ts ✓" || echo "  ❌ electron.d.ts missing"

echo ""
echo "✓ Native modules for Electron:"
if [ -f "node_modules/better-sqlite3/build/Release/better_sqlite3.node" ]; then
    # Check if it was built for Electron (NODE_MODULE_VERSION 140 for Electron 39)
    if otool -L node_modules/better-sqlite3/build/Release/better_sqlite3.node 2>/dev/null | grep -q "electron" || [ -f ".electron-rebuild-complete" ]; then
        echo "  better-sqlite3 rebuilt for Electron ✓"
    else
        echo "  ⚠️  better-sqlite3 may need rebuilding"
        echo "     Run: npx electron-rebuild"
    fi
else
    echo "  ⚠️  better-sqlite3 not compiled"
    echo "     Run: npx electron-rebuild"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup verification complete!"
echo ""
echo "IMPORTANT: Before first run, rebuild native modules:"
echo "  npx electron-rebuild"
echo ""
echo "Then start the Electron app:"
echo "  npm run electron:dev"
echo ""
echo "To build for macOS:"
echo "  npm run electron:build"
echo ""
echo "Database will be stored at:"
echo "  ~/Library/Application Support/note-taking-app/notes.db"
echo ""
