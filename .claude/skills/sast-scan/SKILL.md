---
name: sast-scan
description: Run semgrep, npm audit; triage findings; produce remediation list.
allowed-tools: [Bash, Read, Edit]
---

# sast-scan Skill

## Checklist

- [ ] Install semgrep: `brew install semgrep` (macOS) or per https://semgrep.dev/install
- [ ] Run semgrep baseline: `semgrep ci --config=p/owasp-top-ten --json > semgrep-report.json`
- [ ] Run npm audit: `npm audit --omit=dev --json > npm-audit-report.json`
- [ ] Review findings:
  - [ ] High/critical: fix immediately
  - [ ] Medium: evaluate, fix or justify
  - [ ] Low/info: log, defer if rationalized
- [ ] For each high/critical finding:
  - [ ] File path, line number
  - [ ] Issue description (CWE code if applicable)
  - [ ] Proposed fix
  - [ ] Estimated effort
- [ ] Implement fixes in code
- [ ] Re-run semgrep and npm audit to verify fixes
- [ ] Commit: `git add . && git commit -m "security: remediate SAST findings (semgrep, npm audit)"`

## Success Criteria

- `semgrep ci` returns no high/critical issues (or all are justified in PR comments)
- `npm audit --omit=dev` has 0 high/critical vulnerabilities
- All SAST fixes are tested (Jest/Cypress green)
