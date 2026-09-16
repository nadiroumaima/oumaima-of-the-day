# Oumaima’s little notes — animated cat edition

## Run
Extract the ZIP and open oumaima-blog/index.html in a browser. No npm install or build is needed.

You can also use VS Code Live Server, or run `python -m http.server 8000` from the extracted folder (Windows: `py -m http.server 8000`) and visit http://localhost:8000.

## Files
- index.html: updated page layout; cat beside the article on desktop and above it on mobile.
- style.css: responsive styling, sprite animation, transparent edges, and lantern glow.
- app.js: sample articles, article selection, and animation pause control.
- cat-scene.png: transparent 2-by-2 animation sprite sheet based on your supplied cat reference.

Replace the posts array in app.js with your own writing. The current entries are sample posts. The cat cycles through writing, blinking, and steam frames; the lantern glow is animated with CSS. Reduced-motion preferences are respected.

This is a static website with no CMS or database. The original reference artwork was supplied by the user; this export does not grant rights to the underlying third-party artwork.
