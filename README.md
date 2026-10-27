# lordx997 — Roblox scripting portfolio

Live site: https://lordx997.github.io/

Static GitHub Pages website with Portfolio, Reviews, and Games tabs. No build step.

## Updating content

Edit `content.js`:
- `systems`: name, description, tags, video path, poster path, videoNote, direct GitHub code link, Roblox game link.
- `games`: name, description, thumbnail path, status (`Active` or `Coming soon`), visits (number, or null if unavailable), Roblox URL, role.
- `reviews`: screenshot path in `image`, accessible transcription in `alt`, project/client credit in `caption`. Only publish genuine screenshots with permission and remove private details.

Place media files next to index.html and upload the changed files to main. Do not use placeholder projects or reviews as real credits.

Search matches names, descriptions, and tags, including #Physics syntax. Tag chips filter the results. Tabs support arrow keys, Home/End, and hash URLs (#portfolio, #reviews, #games).

The archery preview is a silent 13-second excerpt from the supplied October 2026 prototype recording. The current demo includes later improvements. Games uses Roblox's current published thumbnail. Visit counts are dated snapshots; update both the count in content.js and the checked date in index.html when refreshing them.

Preview locally with any static HTTP server. GitHub Pages publishes from main / root.
