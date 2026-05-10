#!/bin/bash
# link-ai-tooling.sh
#
# Idempotent script to create relative symlinks from IDE-specific directories
# to the canonical .claude/ directory. Removes stale symlinks only; never deletes real files.
#
# Tested on macOS and Linux. Windows users should use link-ai-tooling.cmd (mklink /D).

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE_AGENTS="${REPO_ROOT}/.claude/agents"
CLAUDE_COMMANDS="${REPO_ROOT}/.claude/commands"
CLAUDE_SKILLS="${REPO_ROOT}/.claude/skills"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

# Function to safely create/update a symlink
# Args: $1=symlink_path, $2=target_path (relative to symlink's directory)
ensure_symlink() {
  local symlink="$1"
  local target="$2"
  local symlink_dir="$(dirname "$symlink")"

  # Create parent directory if it doesn't exist
  if [ ! -d "$symlink_dir" ]; then
    mkdir -p "$symlink_dir"
    log_success "Created directory: $symlink_dir"
  fi

  # If symlink exists, check if it points to the right target
  if [ -L "$symlink" ]; then
    local current_target
    current_target=$(readlink "$symlink")
    if [ "$current_target" = "$target" ]; then
      log_success "Symlink already correct: $symlink → $target"
      return 0
    else
      # Remove stale symlink
      rm "$symlink"
      log_warn "Removed stale symlink: $symlink"
    fi
  elif [ -e "$symlink" ]; then
    # Real file/directory exists — don't touch it
    log_error "Cannot create symlink: $symlink exists as a real file/directory (not a symlink)"
    return 1
  fi

  # Create the symlink
  ln -s "$target" "$symlink"
  log_success "Created symlink: $symlink → $target"
}

# Ensure canonical directories exist
if [ ! -d "$CLAUDE_AGENTS" ]; then
  log_error ".claude/agents/ not found at $CLAUDE_AGENTS"
  exit 1
fi

if [ ! -d "$CLAUDE_COMMANDS" ]; then
  log_error ".claude/commands/ not found at $CLAUDE_COMMANDS"
  exit 1
fi

echo "Linking AI tooling to IDE-specific directories..."
echo ""

# .cursor/rules → .claude/agents
ensure_symlink "${REPO_ROOT}/.cursor/rules" "../../.claude/agents"

# .cursor/commands → .claude/commands
ensure_symlink "${REPO_ROOT}/.cursor/commands" "../../.claude/commands"

# .windsurf/agents → .claude/agents
ensure_symlink "${REPO_ROOT}/.windsurf/agents" "../.claude/agents"

# .windsurf/commands → .claude/commands
ensure_symlink "${REPO_ROOT}/.windsurf/commands" "../.claude/commands"

# .antigravity/agents → .claude/agents
ensure_symlink "${REPO_ROOT}/.antigravity/agents" "../.claude/agents"

# .antigravity/commands → .claude/commands
ensure_symlink "${REPO_ROOT}/.antigravity/commands" "../.claude/commands"

# .github/copilot/agents → .claude/agents
ensure_symlink "${REPO_ROOT}/.github/copilot/agents" "../../.claude/agents"

# .github/copilot/commands → .claude/commands
ensure_symlink "${REPO_ROOT}/.github/copilot/commands" "../../.claude/commands"

echo ""
log_success "All symlinks configured!"
echo ""
echo "Verification:"
echo "  readlink -f .cursor/rules          # Should resolve to ${CLAUDE_AGENTS}"
echo "  readlink -f .windsurf/agents       # Should resolve to ${CLAUDE_AGENTS}"
echo "  readlink -f .antigravity/commands  # Should resolve to ${CLAUDE_COMMANDS}"
echo ""
echo "For Windows (with admin privileges):"
echo "  scripts/link-ai-tooling.cmd"
echo ""
