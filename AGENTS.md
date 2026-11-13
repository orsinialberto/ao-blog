# AGENTS.md

Guidance for coding agents working in this repository.

**Read [`CLAUDE.md`](./CLAUDE.md) first.** It is the single source of truth for this project: commands, architecture, content conventions, the gallery and map components, and the development principles. Everything in it applies to every agent, not only Claude. Do not duplicate it here: update `CLAUDE.md` when something changes.

## In short

- Personal travel blog: Next.js 16 static export (`output: 'export'`, `trailingSlash: true`), TypeScript, Tailwind CSS 4, React 19.
- Locales are `it` (default) and `en`; every UI string goes in both `src/i18n/messages/it.json` and `en.json`.
- Before handing work back, run:

  ```bash
  npm run lint
  npm test
  npm run build   # needs CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local
  ```

- Keep it simple, remove unused code, fail fast and loudly.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
