---
name: audit:owasp
description: Walk diff against OWASP Top 10; produce findings and remediation plan.
argument-hint: ""
---

# /audit:owasp

Reviews code changes for OWASP Top 10 vulnerabilities.

## Usage

```
/audit:owasp
```

## What it does

Dispatches `owasp-security` agent + `owasp-checklist` skill:
1. Reviews staged or PR diff against OWASP Top 10:
   - Injection, broken auth, sensitive data exposure, XML attacks, broken access control, misconfiguration, XSS, insecure deserialization, vulnerable components, insufficient logging
2. Identifies issues: file path, line, severity, fix
3. Ensures DOMPurify on HTML rendering, Zod on form/API inputs, headers configured
4. Documents findings and remediation priority

Result: Security audit report; high/critical issues flagged for immediate fix.
