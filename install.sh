#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# Cohesium AI — Interactive Installer (Bash)
# Configures and deploys the agent system in your project
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Variables ───────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENERATOR_JS="$SCRIPT_DIR/generator/generate.js"
GENERATOR_PY="$SCRIPT_DIR/generator/generate.py"

LANGUE_EQUIPE=""
LANGUE_OUTPUT=""
PLATFORMS=()
PROJECT_DIR=""
OUTPUT_DIR=""
SELECTED_AGENTS="all"
SELECTED_WORKFLOWS="all"

# ─── Utilities ───────────────────────────────────────────────────────

banner() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}   🦸 Cohesium AI — Agent Workflow System${NC}"
    echo -e "${CYAN}   Installation & Configuration${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

step() {
    echo -e "\n${BOLD}${BLUE}▸ $1${NC}\n"
}

success() {
    echo -e "${GREEN}  ✓ $1${NC}"
}

warn() {
    echo -e "${YELLOW}  ⚠ $1${NC}"
}

error() {
    echo -e "${RED}  ✗ $1${NC}"
}

# ─── Detect existing installation ────────────────────────────────────

banner

UPDATE_MODE=false
TARGET_DIR="."

for arg in "$@"; do
    case "$arg" in
        --update|-u) UPDATE_MODE=true ;;
        --project|-p) ;;
        *) if [ -d "$arg" ]; then TARGET_DIR="$arg"; fi ;;
    esac
done

EXISTING_CONFIG="$TARGET_DIR/.cohesium.yaml"

if [ "$UPDATE_MODE" = false ] && [ -f "$EXISTING_CONFIG" ]; then
    echo "📄 Existing installation detected: $EXISTING_CONFIG"
    echo ""
    echo "  1) Update existing installation (keeps your preferences)"
    echo "  2) New installation (overwrites configuration)"
    echo ""
    read -rp "Your choice [1] : " UPDATE_CHOICE
    UPDATE_CHOICE=${UPDATE_CHOICE:-1}
    if [ "$UPDATE_CHOICE" = "1" ]; then
        UPDATE_MODE=true
    fi
fi

if [ "$UPDATE_MODE" = true ]; then
    if [ ! -f "$EXISTING_CONFIG" ]; then
        error "No installation found (.cohesium.yaml missing in $TARGET_DIR)"
        exit 1
    fi

    echo ""
    echo -e "${BOLD}🔄 Updating...${NC}"
    echo ""
    echo "Preserved preferences from .cohesium.yaml:"

    while IFS= read -r line; do
        case "$line" in
            langue_equipe:*) echo -e "  Team language  : ${GREEN}${line#*: }${NC}" ;;
            langue_output:*) echo -e "  Output language : ${GREEN}${line#*: }${NC}" ;;
            platforms:*)     echo -e "  Platforms      : ${GREEN}${line#*: }${NC}" ;;
            output_dir:*)    echo -e "  Output dir     : ${GREEN}${line#*: }${NC}" ;;
            installed_at:*)  echo -e "  Installed on   : ${GREEN}${line#*: }${NC}" ;;
        esac
    done < "$EXISTING_CONFIG"
    echo ""

    read -rp "Confirm update? [Y/n] : " CONFIRM
    CONFIRM=${CONFIRM:-Y}
    if [[ ! "$CONFIRM" =~ ^[YyOo]$ ]]; then
        echo "Update cancelled."
        exit 0
    fi

    step "Regenerating..."

    if command -v node &>/dev/null && [ -f "$GENERATOR_JS" ]; then
        node "$GENERATOR_JS" --update --project "$(cd "$TARGET_DIR" && pwd)"
    elif command -v python3 &>/dev/null && [ -f "$GENERATOR_PY" ]; then
        python3 "$GENERATOR_PY" --update --project "$(cd "$TARGET_DIR" && pwd)"
    else
        error "Neither Node.js nor Python 3 is installed."
        exit 1
    fi

    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}   ✅ Update complete!${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Your preferences have been preserved."
    echo "Configuration files have been regenerated with the latest version."
    echo ""
    exit 0
fi

# ─── Step 1: Welcome ────────────────────────────────────────────────

echo "Welcome to the Cohesium AI installer."
echo "This script will configure the agent system for your project."
echo ""
echo "Press Enter to continue..."
read -r

# ─── Step 2: Team language ──────────────────────────────────────────

step "1/8 — Team language"
echo "In which language should the agent team communicate?"
echo "(e.g.: français, english, deutsch, español, italiano, português...)"
echo ""
read -rp "Team language [français] : " LANGUE_EQUIPE
LANGUE_EQUIPE=${LANGUE_EQUIPE:-français}
success "Team language: $LANGUE_EQUIPE"

# ─── Step 3: Output language ────────────────────────────────────────

step "2/8 — Deliverable language"
echo "In which language should deliverables (docs, specs, reports) be written?"
echo ""
read -rp "Deliverable language [$LANGUE_EQUIPE] : " LANGUE_OUTPUT
LANGUE_OUTPUT=${LANGUE_OUTPUT:-$LANGUE_EQUIPE}
success "Deliverable language: $LANGUE_OUTPUT"

# ─── Step 4: Platform selection ─────────────────────────────────────

step "3/8 — IDE/CLI selection"
echo "Select the IDE/CLI tools you use (space-separated numbers):"
echo ""
echo "  IDE:"
echo "    1) Cursor              2) Windsurf            3) Cline"
echo "    4) Roo Code            5) GitHub Copilot      6) Kiro"
echo "    7) Trae                8) Google Antigravity   9) CodeBuddy"
echo "   10) Crush              11) iFlow              12) KiloCoder"
echo "   13) OpenCode           14) QwenCoder          15) Rovo Dev"
echo ""
echo "  CLI:"
echo "   16) Claude Code        17) Codex              18) Gemini CLI"
echo "   19) Auggie             20) Pi"
echo ""
echo "   0) Select all"
echo ""

PLATFORM_NAMES=(
    "cursor" "windsurf" "cline" "roocode" "copilot"
    "kiro" "trae" "antigravity" "codebuddy" "crush"
    "iflow" "kilocoder" "opencode" "qwencoder" "rovodev"
    "claude-code" "codex" "gemini-cli" "auggie" "pi"
)

read -rp "Your choice [0] : " PLATFORM_CHOICE
PLATFORM_CHOICE=${PLATFORM_CHOICE:-0}

if [ "$PLATFORM_CHOICE" = "0" ]; then
    PLATFORMS=("${PLATFORM_NAMES[@]}")
    success "All platforms selected (${#PLATFORMS[@]})"
else
    for num in $PLATFORM_CHOICE; do
        if [ "$num" -ge 1 ] && [ "$num" -le 20 ]; then
            PLATFORMS+=("${PLATFORM_NAMES[$((num-1))]}")
        fi
    done
    success "Selected platforms: ${PLATFORMS[*]}"
fi

# ─── Step 5: Project directory ──────────────────────────────────────

step "4/8 — Target project directory"
echo "Where is your project located? (absolute or relative path)"
echo ""
read -rp "Project directory [.] : " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-.}
PROJECT_DIR="$(cd "$PROJECT_DIR" 2>/dev/null && pwd || echo "$PROJECT_DIR")"

if [ ! -d "$PROJECT_DIR" ]; then
    warn "Directory does not exist. Creating..."
    mkdir -p "$PROJECT_DIR"
fi
success "Project: $PROJECT_DIR"

# ─── Step 6: Output directory ───────────────────────────────────────

step "5/8 — Deliverable output directory"
echo "Where should agents write their deliverables?"
echo "(relative to the project directory)"
echo ""
read -rp "Output directory [./cohesium-output] : " OUTPUT_DIR
OUTPUT_DIR=${OUTPUT_DIR:-./cohesium-output}
success "Output: $PROJECT_DIR/$OUTPUT_DIR"

# ─── Step 7: Agent selection ────────────────────────────────────────

step "6/8 — Agents to install"
echo "Do you want to install all 28 agents?"
echo ""
echo "  1) All agents (recommended)"
echo "  2) Custom selection"
echo ""
read -rp "Your choice [1] : " AGENT_CHOICE
AGENT_CHOICE=${AGENT_CHOICE:-1}

if [ "$AGENT_CHOICE" = "1" ]; then
    SELECTED_AGENTS="all"
    success "All 28 agents will be installed"
else
    echo ""
    echo "Select agents (space-separated numbers):"
    echo "  1) PM          2) Architect    3) Analyst      4) Backend"
    echo "  5) Frontend    6) Fullstack    7) Mobile       8) DB"
    echo "  9) DevOps     10) Security    11) Legal       12) QA"
    echo " 13) Scrum      14) Automation  15) AI Engineer 16) UX"
    echo " 17) Ads        18) Marketing   19) Growth      20) SEO"
    echo " 21) Content SEO 22) GEO/AIO   23) Copywriter  24) Brand"
    echo " 25) Storytelling 26) Social   27) Data        28) Contrarian"
    echo ""
    read -rp "Your choice: " AGENT_CHOICE_LIST
    SELECTED_AGENTS="$AGENT_CHOICE_LIST"
    success "Selected agents: $SELECTED_AGENTS"
fi

# ─── Step 8: Workflow selection ─────────────────────────────────────

step "7/8 — Workflows to enable"
echo "Do you want to enable all predefined workflows?"
echo ""
echo "  1) All workflows (recommended)"
echo "  2) Custom selection"
echo ""
read -rp "Your choice [1] : " WF_CHOICE
WF_CHOICE=${WF_CHOICE:-1}

if [ "$WF_CHOICE" = "1" ]; then
    SELECTED_WORKFLOWS="all"
    success "All 11 workflows will be enabled"
else
    echo ""
    echo "Select workflows:"
    echo "  1) MVP Launch       2) Feature Dev     3) Bug Fix"
    echo "  4) Code Review      5) Security Audit  6) SEO Content"
    echo "  7) Marketing Camp.  8) Sprint Cycle    9) Tech Debt"
    echo " 10) Onboarding      11) Release"
    echo ""
    read -rp "Your choice: " WF_CHOICE_LIST
    SELECTED_WORKFLOWS="$WF_CHOICE_LIST"
    success "Selected workflows: $SELECTED_WORKFLOWS"
fi

# ─── Step 9: Confirmation ──────────────────────────────────────────

step "8/8 — Confirmation"
echo "Summary:"
echo ""
echo -e "  Team language  : ${BOLD}$LANGUE_EQUIPE${NC}"
echo -e "  Output language: ${BOLD}$LANGUE_OUTPUT${NC}"
echo -e "  Platforms      : ${BOLD}${PLATFORMS[*]}${NC}"
echo -e "  Project        : ${BOLD}$PROJECT_DIR${NC}"
echo -e "  Output         : ${BOLD}$OUTPUT_DIR${NC}"
echo -e "  Agents         : ${BOLD}$SELECTED_AGENTS${NC}"
echo -e "  Workflows      : ${BOLD}$SELECTED_WORKFLOWS${NC}"
echo ""
read -rp "Start installation? [Y/n] : " CONFIRM
CONFIRM=${CONFIRM:-Y}

if [[ ! "$CONFIRM" =~ ^[YyOo]$ ]]; then
    echo "Installation cancelled."
    exit 0
fi

# ─── Generation ──────────────────────────────────────────────────────

step "Generating..."

PLATFORMS_STR=$(IFS=,; echo "${PLATFORMS[*]}")

if command -v node &>/dev/null && [ -f "$GENERATOR_JS" ]; then
    node "$GENERATOR_JS" \
        --project "$PROJECT_DIR" \
        --platforms "$PLATFORMS_STR" \
        --lang-team "$LANGUE_EQUIPE" \
        --lang-output "$LANGUE_OUTPUT" \
        --output-dir "$OUTPUT_DIR"
elif command -v python3 &>/dev/null && [ -f "$GENERATOR_PY" ]; then
    python3 "$GENERATOR_PY" \
        --project "$PROJECT_DIR" \
        --platforms "$PLATFORMS_STR" \
        --lang-team "$LANGUE_EQUIPE" \
        --lang-output "$LANGUE_OUTPUT" \
        --output-dir "$OUTPUT_DIR"
else
    error "Neither Node.js nor Python 3 is installed. Cannot generate."
    exit 1
fi

# ─── Done ────────────────────────────────────────────────────────────

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}   ✅ Installation complete!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Open your project in your IDE"
echo "  2. Agents are ready to use"
echo "  3. Type /help to see available commands"
echo ""
echo "To reconfigure: bash install.sh"
echo "To update:      bash install.sh --update"
echo ""
