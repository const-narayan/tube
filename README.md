# Dino Ventures – Mobile-First Video Player

Touch-native video experience inspired by the YouTube mobile app: smooth playback, gesture-driven controls, a draggable mini-player, and an in-player queue filtered by category.

## Stack
- React 18 + Vite 4 + TypeScript
- Tailwind CSS 3 (utility-first styling)
- Framer Motion (gestures & transitions)
- ReactPlayer (YouTube/MP4 playback)

## Run locally
```bash
npm install
npm run dev     # starts Vite dev server at http://localhost:5173
npm run build   # type-check + production build
npm run preview # preview the production build
```

## Project Structure
```
src/
├── App.tsx                    # Root layout, state management
├── data.ts                    # Video dataset & category exports
├── index.css                  # Global styles, seek bar, scrollbar
├── main.tsx                   # React entry point
├── components/
│   ├── VideoCard.tsx           # Video card with thumbnail, badges, play overlay
│   └── PlayerOverlay.tsx       # Full-page player + mini-player
└── types/
    └── react-player.d.ts      # ReactPlayer type shim
```

## Features

### Home Page – Video Feed
- Scrollable list of videos grouped by 3 categories (Social Media AI, AI Income, AI Essentials)
- Video cards with: thumbnail, title, duration badge, category badge, play icon on hover
- Tap/click a card → opens full-page player with slide-up animation
- Responsive grid: 1 col (mobile) → 2 cols → 3 cols → 4 cols (desktop)

### Full-Page Video Player
- 16:9 aspect-ratio video area at the top
- Auto-play on open
- Custom controls below the video:
  - Play / Pause toggle (orange accent button)
  - Skip forward (+10s) and backward (−10s) with flash animation
  - Seekable progress bar with custom-styled orange thumb
  - Current time / total duration display
- Loading spinner while video buffers
- Auto-hiding controls (show on tap, hide after 3.5s)
- Drag video area down to minimize into mini-player

### In-Player Video List
- "More (N)" toggle button reveals related videos (same category)
- "Show N related videos" dashed button as secondary CTA
- Clicking a related video switches playback immediately with auto-play
- Smooth expand/collapse animations

### Drag-to-Minimize Mini-Player
- Drag the video area downward → shrinks to bottom mini-player
- Mini-player features:
  - Small video preview (continues playing)
  - Video title
  - Play / Pause control
  - Close (×) button
  - Progress bar indicator
- Persists while browsing the home feed
- Tap the mini-player to restore to full-screen
- Responsive: full-width on mobile, 400px on desktop

### Bonus Features
- **Auto-play Next**: 3-second countdown when current video ends, with "Cancel" and "Play now" buttons
- **HLS-ready**: Automatically forces HLS for `.m3u8` sources
- **PiP Support**: Picture-in-Picture button for direct MP4 sources
- **Visual Feedback**: Skip ±10s flash animations, loading spinner, hover effects

## Data
Dataset from the assignment is embedded in `src/data.ts`. Categories and thumbnails come directly from the provided JSON. Durations are derived deterministically from video slugs.

## Deployment
Any static host works (Vercel/Netlify/Cloudflare Pages). Build with `npm run build` and deploy `dist/`.
