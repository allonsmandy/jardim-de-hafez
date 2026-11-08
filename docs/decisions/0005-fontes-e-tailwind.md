# ADR 0005 — Tailwind 4 (CSS-first) e fontes auto-hospedadas

**Status:** aceita · 2026-11-07

- Tailwind 4 via `@tailwindcss/vite`, tokens em `@theme` (um único arquivo de verdade para cores e fontes).
- Fontes via Fontsource (Cormorant Garamond, Literata, Noto Naskh Arabic): sem chamadas a Google Fonts
  (privacidade, LGPD, sem dependência de rede no build), subconjuntos por `unicode-range`.
- TypeScript fixado em 6.0.x: o TypeScript 7 (nativo) ainda não é suportado pelo `vue-tsc`.
