---
name: vite-migrate
description: Replace CRA with Vite; preserve TS, set build.minify: oxc.
allowed-tools: [Read, Write, Edit, Bash]
---

# vite-migrate Skill

## Checklist

Frontend directory: `frontend/`

- [ ] Uninstall CRA: `npm uninstall react-scripts react-scripts-ts`
- [ ] Install Vite: `npm install --save-dev vite @vitejs/plugin-react`
- [ ] Update `package.json` scripts:
  - [ ] `"start"` → `"dev": "vite"`
  - [ ] `"build"` → `"build": "vite build"`
  - [ ] `"test"` remains `jest`
- [ ] Create `frontend/vite.config.ts`:
  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  export default defineConfig({
    plugins: [react()],
    server: { port: 3000 },
    build: { minify: 'esbuild' }  // Note: 'oxc' requires @vitejs/plugin-oxc
  })
  ```
- [ ] Create `frontend/index.html` at project root (move from `public/index.html`), update `<script type="module" src="/src/index.tsx"></script>`
- [ ] Delete `frontend/App.tsx` (CRA stub)
- [ ] Create `frontend/src/vite-env.d.ts`: `/// <reference types="vite/client" />`
- [ ] Update `frontend/tsconfig.json` for Vite (e.g., remove CRA-specific compilerOptions)
- [ ] Test: `npm run build` completes without error
- [ ] Test: `npm run dev` runs on port 3000
- [ ] Add `axios` if missing: `npm install axios`

## Success Criteria

- `npm run build` succeeds with no `react-scripts` references
- Dev server runs on port 3000
- TypeScript compiles cleanly
- No CRA config files remain (`public/index.html` deleted, `App.tsx` deleted)
