---
name: chrome-devtools-mcp-setup
description: Install Chrome DevTools MCP per https://github.com/ChromeDevTools/chrome-devtools-mcp/
allowed-tools: [Read, Write, Edit, Bash]
---

# chrome-devtools-mcp-setup Skill

## Checklist

Perform MCP-only installation (not HTTP bridge):

- [ ] Read https://github.com/ChromeDevTools/chrome-devtools-mcp/#mcp-client-configuration
- [ ] Install Chrome DevTools MCP via your IDE's MCP settings (Claude Code, Cursor, Windsurf, etc.)
- [ ] In Claude Code: add to `.claude/settings.json` or global `~/.claude/settings.json`:
  ```json
  {
    "mcpServers": {
      "chrome-devtools": {
        "command": "npx",
        "args": ["@anthropic-ai/chrome-devtools-mcp"]
      }
    }
  }
  ```
- [ ] Start Chrome with DevTools Protocol enabled (if not already):
  ```bash
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  ```
  (On Linux: `google-chrome --remote-debugging-port=9222`)
- [ ] Test: in Claude Code, run `/mcp` or check `claude mcp list` — should show `chrome-devtools`
- [ ] Use MCP: ask Claude to inspect / manipulate DOM, measure performance, etc. in a running browser

## Success Criteria

- `claude mcp list` shows `chrome-devtools` as available
- Can interact with a local browser instance via MCP
- No HTTP bridge errors
