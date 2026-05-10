---
name: pr-md-writer
description: Render PR.md from §17 template using observed run data.
allowed-tools: [Read, Write, Edit]
---

# pr-md-writer Skill

## Checklist

At repo root:

- [ ] Collect run data:
  - [ ] Vite migration completed? Which packages added?
  - [ ] Backend endpoints added? List changes.
  - [ ] Frontend features (kanban, lazy loading)? URLs?
  - [ ] Test results: Jest coverage %, Cypress pass/fail, Lighthouse scores
  - [ ] npm audit clean? List any remaining findings (if deferred)
  - [ ] OWASP findings found and fixed? List summary
- [ ] Create `PR.md` at repo root using template from §17:
  ```markdown
  # LTI Talent Tracking — Agentic Setup & Position Kanban
  
  ## Overview
  - [Narrative of changes]
  
  ## Stack & Prerequisites
  - [Tech versions from package.json + schema]
  
  ## Folder & File Reference
  - [Key files modified and created]
  
  ## Functionality
  - [List features shipped]
  
  ## Changes Summary
  - [Table of changes by area]
  
  ## How to Run
  - [Docker compose, npm install, npm run dev, E2E]
  
  ## Testing Strategy & Results
  - Jest coverage: X%
  - Cypress: pass/fail
  - Lighthouse a11y: X
  - npm audit: X high+ findings
  
  ## Security & Accessibility Audit
  - [OWASP review summary]
  - [Headers configured]
  - [a11y scores]
  
  ## Conclusions
  - [What shipped, what deferred, follow-ups]
  ```
- [ ] Fill in actual numbers, file lists, test results
- [ ] Ensure all sections match the run output
- [ ] Commit: `git add PR.md && git commit -m "docs: PR.md for agentic setup + Position kanban"`

## Success Criteria

- PR.md exists at repo root
- All sections filled with actual run data
- No placeholders or TODOs remain
- File is human-readable and summarizes the scope
