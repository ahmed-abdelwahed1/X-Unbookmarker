# AGENTS.md

## Cursor Cloud specific instructions

### Overview

X-Unbookmarker is a Chrome Extension (Manifest V3) that bulk-removes bookmarks on X/Twitter. It is pure vanilla JavaScript with **no build step, no bundler, no dependencies, no test framework, and no linter configured**.

### Key files

- `manifest.json` — Chrome extension manifest (Manifest V3)
- `src/popup.html` / `src/popup.js` / `src/popup.css` — Extension popup UI
- `src/content.js` — Content script injected into x.com/twitter.com bookmarks page
- `update-version.js` — Syncs version from `package.json` into `manifest.json`

### Development

- **No `npm install` needed** — `package.json` has zero dependencies.
- **No build step** — source files are loaded directly by Chrome as-is.
- **No test framework** — `npm test` is a placeholder that exits with error.
- **No linter configured** — no ESLint, Prettier, or similar tooling.
- Run `node update-version.js` to sync version from `package.json` to `manifest.json`.

### Running / Testing the extension

1. Open Chrome → `chrome://extensions/` → enable Developer mode → Load unpacked → select `/workspace`.
2. The popup UI can also be previewed standalone by serving it: `npx http-server . -p 8080` then open `http://localhost:8080/src/popup.html`.
3. Full E2E testing requires navigating to `https://x.com/i/bookmarks` while logged in — the content script only activates on that page.

### Gotchas

- The `assets/` directory with icon PNGs (`icon16.png`, `icon48.png`, `icon128.png`) referenced in `manifest.json` may not exist in the repo. Placeholder icons can be generated if needed for local loading.
- The popup JS uses Chrome extension APIs (`chrome.tabs`, `chrome.scripting`, `chrome.storage.local`, `chrome.runtime`) which are only available when running as a loaded Chrome extension, not when opened as a standalone HTML file.
