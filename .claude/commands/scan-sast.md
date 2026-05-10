---
name: scan:sast
description: Run semgrep, npm audit; triage and remediate findings.
argument-hint: ""
---

# /scan:sast

Automated security scanning and vulnerability remediation.

## Usage

```
/scan:sast
```

## What it does

Dispatches `sast-pentester` agent + `sast-scan` skill:
1. Runs `semgrep ci` (OWASP rulesets)
2. Runs `npm audit` (dependency vulnerabilities)
3. Triages findings: high/critical for immediate fix, medium/low for evaluation
4. Produces remediation list with file/line/fix/effort
5. Implements fixes; re-runs to verify
6. Documents any deferred findings with justification

Result: SAST report clean (or risks documented); no high/critical vulns unaddressed.
