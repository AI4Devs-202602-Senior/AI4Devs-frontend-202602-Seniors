---
name: a11y-audit
description: Run axe-core, eslint-plugin-jsx-a11y, Lighthouse a11y; fix to ≥95.
allowed-tools: [Read, Write, Edit, Bash]
---

# a11y-audit Skill

## Checklist

Frontend directory: `frontend/`

- [ ] Install: `npm install --save-dev axe-core eslint-plugin-jsx-a11y`
- [ ] Add ESLint plugin to `.eslintrc`:
  ```json
  { "plugins": ["jsx-a11y"], "extends": ["plugin:jsx-a11y/recommended"] }
  ```
- [ ] Run eslint-plugin-jsx-a11y: `npx eslint src/ --plugin jsx-a11y`; fix any violations
- [ ] Run Lighthouse (Chrome DevTools) on `/positions` and `/positions/:id` routes
  - [ ] Target: Accessibility score ≥ 95
- [ ] Manual checks:
  - [ ] Color contrast: all text ≥ 4.5:1 ratio (use Color Contrast Analyzer tool)
  - [ ] Focus rings: tabbing through page shows visible focus indicators
  - [ ] Keyboard navigation: all interactive elements reachable via Tab/Enter/Space
  - [ ] ARIA labels: form inputs have associated `<label>` or `aria-label`
  - [ ] Images: all `<img>` have descriptive `alt` text
  - [ ] Skip link: at top of page for jumping to main content
  - [ ] `prefers-reduced-motion`: animations respect `@media (prefers-reduced-motion: reduce)`
- [ ] Run axe-core in browser: open DevTools → Axe DevTools → Scan; fix violations
- [ ] Commit: include Lighthouse a11y scores

## Success Criteria

- Lighthouse Accessibility ≥ 95 on both `/positions` and `/positions/:id`
- axe-core scan has no violations (only "passes" and "inapplicable")
- Manual keyboard nav and screen-reader testing passes
