# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start Vite dev server with HMR (port 3000)
pnpm build        # Production build to /dist
pnpm preview      # Preview production build

# Code Quality
pnpm check        # TypeScript type checking (no emit)
pnpm format       # Format with Prettier
```

## Architecture

This is a React SPA portfolio website with a "Retro Terminal Glitch" cyberpunk aesthetic.

### Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** with custom OKLCH color system
- **Radix UI** components via shadcn/ui pattern
- **Wouter** for client-side routing (patched in `patches/wouter@3.7.1.patch`)
- **Framer Motion** for animations

### Directory Structure

```
client/
├── src/
│   ├── components/     # UI components
│   │   └── ui/         # shadcn/Radix primitives
│   ├── pages/          # Route pages (Home.tsx, NotFound.tsx)
│   ├── contexts/       # ThemeContext (locked to dark)
│   ├── hooks/          # Custom hooks
│   └── lib/            # Utilities (cn() helper)
server/                 # Express SPA fallback (not used in Vercel deploy)
```

### Path Aliases

- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Styling

Theme is locked to dark mode with neon green terminal aesthetic. Key custom CSS in `client/src/index.css`:

- Glitch text animation (dual-layer clipping with cyan/magenta)
- CRT scanline overlay effect
- Fonts: VT323 (headings), Space Mono (body)

### Custom Components

- `Terminal.tsx` - Animated terminal window with scrolling logs
- `GlitchCard.tsx` - Project cards with hover glitch effects

### Deployment

Deployed to Vercel. SPA routing configured in `vercel.json` (all routes → `/index.html`).
