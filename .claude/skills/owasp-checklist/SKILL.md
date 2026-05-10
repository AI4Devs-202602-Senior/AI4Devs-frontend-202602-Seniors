---
name: owasp-checklist
description: Walk OWASP Top 10 against diff; produce findings and fixes.
allowed-tools: [Read, Bash, Edit]
---

# owasp-checklist Skill

## Checklist

For each of OWASP Top 10:

### 1. Injection (SQL, NoSQL, OS)
- [ ] Review any raw database queries — ensure Prisma/ORM is used, not string concat
- [ ] Check backend service code for SQL string assembly — use parameterized queries

### 2. Broken Authentication
- [ ] Verify JWT handling: tokens in Authorization header, not URL or localStorage without HTTPS
- [ ] Check password handling (if applicable): no plaintext storage, hashed + salted
- [ ] Session timeouts configured

### 3. Sensitive Data Exposure
- [ ] `.env` files in `.gitignore` — no credentials in repo
- [ ] `npm audit` for vulnerable dependencies
- [ ] HTTPS/TLS headers wired: HSTS, CSP, X-Frame-Options

### 4. XML External Entities (XXE)
- [ ] If parsing XML: use safe parsers, disable DTD/entity expansion
- [ ] (Likely N/A for this project — JSON only)

### 5. Broken Access Control
- [ ] Verify JWT token is checked on protected routes (Express middleware)
- [ ] API endpoints return 401 if token missing, 403 if unauthorized
- [ ] Frontend respects role-based visibility

### 6. Security Misconfiguration
- [ ] No default credentials in Docker, database
- [ ] Server error messages don't leak stack traces to client
- [ ] Security headers present (CSP, X-Frame-Options, Referrer-Policy)

### 7. Cross-Site Scripting (XSS)
- [ ] Review all `dangerouslySetInnerHTML` — require DOMPurify sanitization
- [ ] User inputs in JSX are safe (React escapes by default)
- [ ] Confirm Zod schemas validate all form inputs

### 8. Insecure Deserialization
- [ ] JSON.parse only on trusted sources
- [ ] No eval() or Function() constructor with user input
- [ ] Avoid lodash `_.template()` with user data

### 9. Using Vulnerable Components
- [ ] `npm audit` to identify vulnerable deps
- [ ] Update to patched versions
- [ ] Review advisories at npmjs.com

### 10. Insufficient Logging & Monitoring
- [ ] Backend logs significant events (auth, errors, data mutations)
- [ ] Logs are not stored in client-side console (move to backend)
- [ ] Error tracking (Sentry, DataDog) configured if applicable

## Report

- [ ] Produce OWASP findings list: file, line, issue, severity, remediation
- [ ] Prioritize high/critical fixes
- [ ] Defer low/info with justification
- [ ] Track in GitHub issues or PR comments

## Success Criteria

- No high/critical OWASP findings left unfixed
- DOMPurify present where needed
- Zod validation in place at form/API boundaries
- Security headers configured at Express layer
