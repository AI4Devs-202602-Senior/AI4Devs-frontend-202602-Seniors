---
name: setup:chrome-devtools-mcp
description: Install Chrome DevTools MCP for in-IDE browser automation.
argument-hint: ""
---

# /setup:chrome-devtools-mcp

Configures Chrome DevTools MCP for debugging and inspecting live browser instances from Claude Code.

## Usage

```
/setup:chrome-devtools-mcp
```

## What it does

Dispatches `devops` agent + `chrome-devtools-mcp-setup` skill:
1. Reads https://github.com/ChromeDevTools/chrome-devtools-mcp/
2. Adds MCP server config to `.claude/settings.json` or global `~/.claude/settings.json`
3. Starts Chrome with `--remote-debugging-port=9222` (if needed)
4. Tests MCP connection: `claude mcp list` should show `chrome-devtools`

Result: Chrome DevTools MCP available for DOM inspection, performance measurement, etc.
