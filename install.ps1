# ═══════════════════════════════════════════════════════════════════════
# Cohesium AI — Interactive Installer (PowerShell)
# Compatible with Windows PowerShell 5.1+ and PowerShell 7+
# ═══════════════════════════════════════════════════════════════════════

param(
    [switch]$Update,
    [Alias("u")]
    [switch]$U,
    [string]$Project = "."
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$GeneratorJS = Join-Path $ScriptDir "generator\generate.js"

# ─── Utilities ───────────────────────────────────────────────────────

function Write-Color($Text, $Color = "White") {
    Write-Host $Text -ForegroundColor $Color
}

function Write-Step($Label) {
    Write-Host ""
    Write-Host "▸ $Label" -ForegroundColor Blue -NoNewline
    Write-Host ""
    Write-Host ""
}

function Read-Prompt($Question, $Default = "") {
    $suffix = if ($Default) { " [$Default]" } else { "" }
    $answer = Read-Host "$Question$suffix"
    if ([string]::IsNullOrWhiteSpace($answer)) { return $Default }
    return $answer.Trim()
}

# ─── Banner ──────────────────────────────────────────────────────────

Write-Host ""
Write-Color "═══════════════════════════════════════════════════════" Cyan
Write-Color "   Cohesium AI — Agent Workflow System" Blue
Write-Color "   Installation & Configuration (PowerShell)" Cyan
Write-Color "═══════════════════════════════════════════════════════" Cyan
Write-Host ""

# ─── Check Node.js ───────────────────────────────────────────────────

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Color "  ✗ Node.js is required but not found." Red
    Write-Color "    Install it from: https://nodejs.org/" Yellow
    exit 1
}

# ─── Detect existing installation / update mode ─────────────────────

$UpdateMode = $Update -or $U
$ConfigPath = Join-Path (Resolve-Path $Project) ".cohesium.yaml"

if (-not $UpdateMode -and (Test-Path $ConfigPath)) {
    Write-Host "📄 Existing installation detected: $ConfigPath"
    Write-Host ""
    Write-Host "  1) Update existing installation (keeps your preferences)"
    Write-Host "  2) New installation (overwrites configuration)"
    Write-Host ""
    $choice = Read-Prompt "Your choice" "1"
    if ($choice -eq "1") { $UpdateMode = $true }
}

if ($UpdateMode) {
    if (-not (Test-Path $ConfigPath)) {
        Write-Color "  ✗ No installation found (.cohesium.yaml missing)" Red
        exit 1
    }

    Write-Host ""
    Write-Color "🔄 Updating..." White
    Write-Host ""
    Write-Host "Preserved preferences from .cohesium.yaml:"

    Get-Content $ConfigPath | ForEach-Object {
        foreach ($key in @("langue_equipe", "langue_output", "platforms", "output_dir", "installed_at")) {
            if ($_ -match "^${key}:") {
                Write-Color "  $_" Green
            }
        }
    }

    Write-Host ""
    $confirm = Read-Prompt "Confirm update?" "Y"
    if ($confirm -notmatch "^[YyOo]$") {
        Write-Host "Update cancelled."
        exit 0
    }

    Write-Step "Regenerating..."
    $projectResolved = (Resolve-Path $Project).Path
    & node $GeneratorJS --update --project $projectResolved
    if ($LASTEXITCODE -ne 0) {
        Write-Color "  ✗ Error during update" Red
        exit 1
    }

    Write-Host ""
    Write-Color "═══════════════════════════════════════════════════════" Cyan
    Write-Color "   ✅ Update complete!" Green
    Write-Color "═══════════════════════════════════════════════════════" Cyan
    Write-Host ""
    Write-Host "Your preferences have been preserved."
    Write-Host "Configuration files have been regenerated with the latest version."
    Write-Host ""
    exit 0
}

# ─── New Installation ────────────────────────────────────────────────

Write-Host "Welcome to the Cohesium AI installer."
Write-Host "This script will configure the agent system for your project."
Read-Host "`nPress Enter to continue"

# 1. Team language
Write-Step "1/8 — Team language"
Write-Host "In which language should the agent team communicate?"
Write-Host "(e.g.: français, english, deutsch, español, italiano, português...)"
$langTeam = Read-Prompt "Team language" "français"
Write-Color "  ✓ Team language: $langTeam" Green

# 2. Output language
Write-Step "2/8 — Deliverable language"
Write-Host "In which language should deliverables be written?"
$langOutput = Read-Prompt "Deliverable language" $langTeam
Write-Color "  ✓ Deliverable language: $langOutput" Green

# 3. Platform selection
Write-Step "3/8 — IDE/CLI selection"
Write-Host "Select the IDE/CLI tools you use (space-separated numbers):"
Write-Host ""
Write-Host "  IDE:"
Write-Host "    1) Cursor              2) Windsurf            3) Cline"
Write-Host "    4) Roo Code            5) GitHub Copilot      6) Kiro"
Write-Host "    7) Trae                8) Google Antigravity   9) CodeBuddy"
Write-Host "   10) Crush              11) iFlow              12) KiloCoder"
Write-Host "   13) OpenCode           14) QwenCoder          15) Rovo Dev"
Write-Host ""
Write-Host "  CLI:"
Write-Host "   16) Claude Code        17) Codex              18) Gemini CLI"
Write-Host "   19) Auggie             20) Pi"
Write-Host ""
Write-Host "   0) Select all"
Write-Host ""

$platformNames = @(
    "cursor", "windsurf", "cline", "roocode", "copilot",
    "kiro", "trae", "antigravity", "codebuddy", "crush",
    "iflow", "kilocoder", "opencode", "qwencoder", "rovodev",
    "claude-code", "codex", "gemini-cli", "auggie", "pi"
)

$platformChoice = Read-Prompt "Your choice" "0"
if ($platformChoice -eq "0") {
    $selectedPlatforms = $platformNames
    Write-Color "  ✓ All platforms selected ($($selectedPlatforms.Count))" Green
} else {
    $selectedPlatforms = @()
    foreach ($num in ($platformChoice -split "\s+")) {
        $idx = [int]$num - 1
        if ($idx -ge 0 -and $idx -lt $platformNames.Count) {
            $selectedPlatforms += $platformNames[$idx]
        }
    }
    Write-Color "  ✓ Selected platforms: $($selectedPlatforms -join ', ')" Green
}

# 4. Project directory
Write-Step "4/8 — Target project directory"
Write-Host "Where is your project located?"
$projectDir = Read-Prompt "Project directory" "."
$projectDir = (Resolve-Path $projectDir -ErrorAction SilentlyContinue)?.Path
if (-not $projectDir) {
    $projectDir = [System.IO.Path]::GetFullPath((Read-Prompt "Project directory" "."))
    New-Item -ItemType Directory -Force -Path $projectDir | Out-Null
}
Write-Color "  ✓ Project: $projectDir" Green

# 5. Output directory
Write-Step "5/8 — Deliverable output directory"
Write-Host "Where should agents write their deliverables?"
$outputDir = Read-Prompt "Output directory" "./cohesium-output"
Write-Color "  ✓ Output: $projectDir/$outputDir" Green

# 6. Agents
Write-Step "6/8 — Agents to install"
$agentChoice = Read-Prompt "Install all 28 agents? [Y/n]" "Y"
$selectedAgents = if ($agentChoice -match "^[YyOo]$") { "all" } else { "custom" }
Write-Color "  ✓ Agents: $selectedAgents" Green

# 7. Workflows
Write-Step "7/8 — Workflows to enable"
$wfChoice = Read-Prompt "Enable all 11 workflows? [Y/n]" "Y"
$selectedWorkflows = if ($wfChoice -match "^[YyOo]$") { "all" } else { "custom" }
Write-Color "  ✓ Workflows: $selectedWorkflows" Green

# 8. Confirmation
Write-Step "8/8 — Confirmation"
Write-Host "Summary:"
Write-Host ""
Write-Host "  Team language  : $langTeam"
Write-Host "  Output language: $langOutput"
Write-Host "  Platforms      : $($selectedPlatforms -join ', ')"
Write-Host "  Project        : $projectDir"
Write-Host "  Output         : $outputDir"
Write-Host "  Agents         : $selectedAgents"
Write-Host "  Workflows      : $selectedWorkflows"
Write-Host ""

$confirm = Read-Prompt "Start installation?" "Y"
if ($confirm -notmatch "^[YyOo]$") {
    Write-Host "Installation cancelled."
    exit 0
}

# ─── Generation ──────────────────────────────────────────────────────

Write-Step "Generating..."

$platformsStr = $selectedPlatforms -join ","

& node $GeneratorJS `
    --project $projectDir `
    --platforms $platformsStr `
    --lang-team $langTeam `
    --lang-output $langOutput `
    --output-dir $outputDir

if ($LASTEXITCODE -ne 0) {
    Write-Color "  ✗ Error during generation" Red
    exit 1
}

# ─── Done ────────────────────────────────────────────────────────────

Write-Host ""
Write-Color "═══════════════════════════════════════════════════════" Cyan
Write-Color "   ✅ Installation complete!" Green
Write-Color "═══════════════════════════════════════════════════════" Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Open your project in your IDE"
Write-Host "  2. Agents are ready to use"
Write-Host "  3. Type /help to see available commands"
Write-Host ""
Write-Host "To reconfigure: .\install.ps1"
Write-Host "To update:      .\install.ps1 -Update"
Write-Host ""
