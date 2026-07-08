# Semi Doped Website

The public website for the Semi Doped podcast. Astro static site.

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

Key guardrail: this is a **professional podcast site**, not a semiconductor
theme park. Brand personality comes only through the wafer mark, the
orange accent, and generated episode art. No in-joke features.

## Data sources
- Episodes: Buzzsprout RSS `https://feeds.buzzsprout.com/2570635.rss` (fetched at build time)
- YouTube: https://youtube.com/@SemiDoped
- Semi Doped Daily (Substack): https://www.semidoped.com/

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build to dist/
- `npm run preview` — serve the production build locally

## Future direction
Properties will unify under semidoped.com subdomains (e.g. podcast.semidoped.com,
daily.semidoped.com). This repo is the podcast property.
