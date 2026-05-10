@echo off
REM link-ai-tooling.cmd
REM
REM Windows version of link-ai-tooling script using mklink /D (directory junctions).
REM Run with administrator privileges: "Run as administrator" or `runas /user:Admin cmd.exe`
REM
REM Note: Creates directory junctions (mklink /D) instead of symlinks.
REM On Windows 10+ with admin, these behave like symlinks.

setlocal enabledelayedexpansion

REM Get the repository root (assuming this script is in scripts/)
for %%i in (%~dp0..) do set "REPO_ROOT=%%~fi"

echo Linking AI tooling to IDE-specific directories...
echo.

REM Check if .claude/agents exists
if not exist "%REPO_ROOT%\.claude\agents" (
  echo Error: .claude\agents not found at %REPO_ROOT%\.claude\agents
  exit /b 1
)

REM Function to create junction (similar to symlink on Windows)
REM mklink /D creates directory junctions which are like symlinks
REM Usage: call :ensure_junction target source

REM .cursor\rules (relative target: ..\..\claude\agents)
if exist "%REPO_ROOT%\.cursor\rules" (
  rmdir "%REPO_ROOT%\.cursor\rules" 2>nul
)
mkdir "%REPO_ROOT%\.cursor" 2>nul
mklink /D "%REPO_ROOT%\.cursor\rules" "%REPO_ROOT%\.claude\agents"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .cursor\rules
) else (
  echo Warning: Could not create .cursor\rules (may need admin or already exists)
)

REM .cursor\commands
if exist "%REPO_ROOT%\.cursor\commands" (
  rmdir "%REPO_ROOT%\.cursor\commands" 2>nul
)
mkdir "%REPO_ROOT%\.cursor" 2>nul
mklink /D "%REPO_ROOT%\.cursor\commands" "%REPO_ROOT%\.claude\commands"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .cursor\commands
) else (
  echo Warning: Could not create .cursor\commands
)

REM .windsurf\agents
if exist "%REPO_ROOT%\.windsurf\agents" (
  rmdir "%REPO_ROOT%\.windsurf\agents" 2>nul
)
mkdir "%REPO_ROOT%\.windsurf" 2>nul
mklink /D "%REPO_ROOT%\.windsurf\agents" "%REPO_ROOT%\.claude\agents"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .windsurf\agents
) else (
  echo Warning: Could not create .windsurf\agents
)

REM .windsurf\commands
if exist "%REPO_ROOT%\.windsurf\commands" (
  rmdir "%REPO_ROOT%\.windsurf\commands" 2>nul
)
mkdir "%REPO_ROOT%\.windsurf" 2>nul
mklink /D "%REPO_ROOT%\.windsurf\commands" "%REPO_ROOT%\.claude\commands"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .windsurf\commands
) else (
  echo Warning: Could not create .windsurf\commands
)

REM .antigravity\agents
if exist "%REPO_ROOT%\.antigravity\agents" (
  rmdir "%REPO_ROOT%\.antigravity\agents" 2>nul
)
mkdir "%REPO_ROOT%\.antigravity" 2>nul
mklink /D "%REPO_ROOT%\.antigravity\agents" "%REPO_ROOT%\.claude\agents"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .antigravity\agents
) else (
  echo Warning: Could not create .antigravity\agents
)

REM .antigravity\commands
if exist "%REPO_ROOT%\.antigravity\commands" (
  rmdir "%REPO_ROOT%\.antigravity\commands" 2>nul
)
mkdir "%REPO_ROOT%\.antigravity" 2>nul
mklink /D "%REPO_ROOT%\.antigravity\commands" "%REPO_ROOT%\.claude\commands"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .antigravity\commands
) else (
  echo Warning: Could not create .antigravity\commands
)

REM .github\copilot\agents
if exist "%REPO_ROOT%\.github\copilot\agents" (
  rmdir "%REPO_ROOT%\.github\copilot\agents" 2>nul
)
mkdir "%REPO_ROOT%\.github\copilot" 2>nul
mklink /D "%REPO_ROOT%\.github\copilot\agents" "%REPO_ROOT%\.claude\agents"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .github\copilot\agents
) else (
  echo Warning: Could not create .github\copilot\agents
)

REM .github\copilot\commands
if exist "%REPO_ROOT%\.github\copilot\commands" (
  rmdir "%REPO_ROOT%\.github\copilot\commands" 2>nul
)
mkdir "%REPO_ROOT%\.github\copilot" 2>nul
mklink /D "%REPO_ROOT%\.github\copilot\commands" "%REPO_ROOT%\.claude\commands"
if %ERRORLEVEL% EQU 0 (
  echo ^+ Created: .github\copilot\commands
) else (
  echo Warning: Could not create .github\copilot\commands
)

echo.
echo Done! All symlinks/junctions created.
echo.
echo NOTE: This script uses mklink /D (directory junctions).
echo On Windows 10+, junctions behave like symlinks when using developer tools.
echo If you encounter permission errors, run Command Prompt as Administrator.
echo.
