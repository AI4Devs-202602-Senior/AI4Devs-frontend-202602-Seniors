---
name: web-vitals-audit
description: Measure LCP/INP/CLS; remediate via lazy loading, preload, image priorities.
allowed-tools: [Read, Write, Edit, Bash]
---

# web-vitals-audit Skill

## Checklist

- [ ] Run `npm run dev` to start dev server (port 3000)
- [ ] Open Lighthouse (Chrome DevTools → Lighthouse) on `/positions` route
- [ ] Measure Core Web Vitals:
  - [ ] **LCP (Largest Contentful Paint)** — target < 2.5s. Common fixes: preload images, defer non-critical JS
  - [ ] **INP (Interaction to Next Paint)** — target < 200ms. Fix: avoid long tasks, defer handlers
  - [ ] **CLS (Cumulative Layout Shift)** — target < 0.1. Fix: reserve space for images/ads
- [ ] Identify LCP element (usually first hero image or text block)
- [ ] If LCP is an image: add `<link rel="preload" as="image" href="..." />` in `index.html` and `fetchpriority="high"` on `<img>`
- [ ] For non-LCP images: add `loading="lazy"`
- [ ] Defer non-critical code splits: `React.lazy`, `Suspense` boundaries
- [ ] Re-run Lighthouse after changes; document metrics
- [ ] Commit with Lighthouse scores in commit message

## Success Criteria

- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Lighthouse Performance score ≥ 90
- Image optimization strategy is visible in code (preload/lazy attributes)
