#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# Cohesium AI — Installateur interactif (Bash)
# Configure et déploie le système d'agents dans votre projet
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Couleurs ─────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Variables ────────────────────────────────────────────────────────
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

# ─── Fonctions utilitaires ────────────────────────────────────────────

banner() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}   🦸 Cohesium AI — Agent Workflow System${NC}"
    echo -e "${CYAN}   Installation et configuration${NC}"
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

# ─── Étape 1 : Bienvenue ──────────────────────────────────────────────

banner

echo "Bienvenue dans l'installateur Cohesium AI."
echo "Ce script va configurer le système d'agents pour votre projet."
echo ""
echo "Appuyez sur Entrée pour continuer..."
read -r

# ─── Étape 2 : Langue de l'équipe ────────────────────────────────────

step "1/8 — Langue de l'équipe"
echo "Dans quelle langue l'équipe d'agents doit-elle communiquer ?"
echo "(ex: français, english, deutsch, español, italiano, português...)"
echo ""
read -rp "Langue de l'équipe [français] : " LANGUE_EQUIPE
LANGUE_EQUIPE=${LANGUE_EQUIPE:-français}
success "Langue de l'équipe : $LANGUE_EQUIPE"

# ─── Étape 3 : Langue des livrables ──────────────────────────────────

step "2/8 — Langue des fichiers produits"
echo "Dans quelle langue les livrables (docs, specs, rapports) doivent-ils être rédigés ?"
echo ""
read -rp "Langue des livrables [$LANGUE_EQUIPE] : " LANGUE_OUTPUT
LANGUE_OUTPUT=${LANGUE_OUTPUT:-$LANGUE_EQUIPE}
success "Langue des livrables : $LANGUE_OUTPUT"

# ─── Étape 4 : Sélection des IDE/CLI ─────────────────────────────────

step "3/8 — Sélection des IDE/CLI"
echo "Sélectionnez les IDE/CLI que vous utilisez (numéros séparés par des espaces) :"
echo ""
echo "  IDE :"
echo "    1) Cursor              2) Windsurf            3) Cline"
echo "    4) Roo Code            5) GitHub Copilot      6) Kiro"
echo "    7) Trae                8) Google Antigravity   9) CodeBuddy"
echo "   10) Crush              11) iFlow              12) KiloCoder"
echo "   13) OpenCode           14) QwenCoder          15) Rovo Dev"
echo ""
echo "  CLI :"
echo "   16) Claude Code        17) Codex              18) Gemini CLI"
echo "   19) Auggie             20) Pi"
echo ""
echo "   0) Tout sélectionner"
echo ""

PLATFORM_NAMES=(
    "cursor" "windsurf" "cline" "roocode" "copilot"
    "kiro" "trae" "antigravity" "codebuddy" "crush"
    "iflow" "kilocoder" "opencode" "qwencoder" "rovodev"
    "claude-code" "codex" "gemini-cli" "auggie" "pi"
)

read -rp "Votre choix [0] : " PLATFORM_CHOICE
PLATFORM_CHOICE=${PLATFORM_CHOICE:-0}

if [ "$PLATFORM_CHOICE" = "0" ]; then
    PLATFORMS=("${PLATFORM_NAMES[@]}")
    success "Toutes les plateformes sélectionnées (${#PLATFORMS[@]})"
else
    for num in $PLATFORM_CHOICE; do
        if [ "$num" -ge 1 ] && [ "$num" -le 20 ]; then
            PLATFORMS+=("${PLATFORM_NAMES[$((num-1))]}")
        fi
    done
    success "Plateformes sélectionnées : ${PLATFORMS[*]}"
fi

# ─── Étape 5 : Répertoire du projet ──────────────────────────────────

step "4/8 — Répertoire du projet cible"
echo "Où se trouve votre projet ? (chemin absolu ou relatif)"
echo ""
read -rp "Répertoire du projet [.] : " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-.}
PROJECT_DIR="$(cd "$PROJECT_DIR" 2>/dev/null && pwd || echo "$PROJECT_DIR")"

if [ ! -d "$PROJECT_DIR" ]; then
    warn "Le répertoire n'existe pas. Création..."
    mkdir -p "$PROJECT_DIR"
fi
success "Projet : $PROJECT_DIR"

# ─── Étape 6 : Répertoire de sortie ──────────────────────────────────

step "5/8 — Répertoire de sortie des livrables"
echo "Où les agents doivent-ils écrire leurs livrables ?"
echo "(relatif au répertoire du projet)"
echo ""
read -rp "Répertoire de sortie [./cohesium-output] : " OUTPUT_DIR
OUTPUT_DIR=${OUTPUT_DIR:-./cohesium-output}
success "Output : $PROJECT_DIR/$OUTPUT_DIR"

# ─── Étape 7 : Sélection des agents ──────────────────────────────────

step "6/8 — Agents à installer"
echo "Voulez-vous installer tous les 28 agents ?"
echo ""
echo "  1) Tous les agents (recommandé)"
echo "  2) Sélection personnalisée"
echo ""
read -rp "Votre choix [1] : " AGENT_CHOICE
AGENT_CHOICE=${AGENT_CHOICE:-1}

if [ "$AGENT_CHOICE" = "1" ]; then
    SELECTED_AGENTS="all"
    success "Tous les 28 agents seront installés"
else
    echo ""
    echo "Sélectionnez les agents (numéros séparés par des espaces) :"
    echo "  1) PM          2) Architect    3) Analyst      4) Backend"
    echo "  5) Frontend    6) Fullstack    7) Mobile       8) DB"
    echo "  9) DevOps     10) Security    11) Legal       12) QA"
    echo " 13) Scrum      14) Automation  15) AI Engineer 16) UX"
    echo " 17) Ads        18) Marketing   19) Growth      20) SEO"
    echo " 21) Content SEO 22) GEO/AIO   23) Copywriter  24) Brand"
    echo " 25) Storytelling 26) Social   27) Data        28) Contrarian"
    echo ""
    read -rp "Votre choix : " AGENT_CHOICE_LIST
    SELECTED_AGENTS="$AGENT_CHOICE_LIST"
    success "Agents sélectionnés : $SELECTED_AGENTS"
fi

# ─── Étape 8 : Sélection des workflows ───────────────────────────────

step "7/8 — Workflows à activer"
echo "Voulez-vous activer tous les workflows prédéfinis ?"
echo ""
echo "  1) Tous les workflows (recommandé)"
echo "  2) Sélection personnalisée"
echo ""
read -rp "Votre choix [1] : " WF_CHOICE
WF_CHOICE=${WF_CHOICE:-1}

if [ "$WF_CHOICE" = "1" ]; then
    SELECTED_WORKFLOWS="all"
    success "Tous les 11 workflows seront activés"
else
    echo ""
    echo "Sélectionnez les workflows :"
    echo "  1) MVP Launch       2) Feature Dev     3) Bug Fix"
    echo "  4) Code Review      5) Security Audit  6) SEO Content"
    echo "  7) Marketing Camp.  8) Sprint Cycle    9) Tech Debt"
    echo " 10) Onboarding      11) Release"
    echo ""
    read -rp "Votre choix : " WF_CHOICE_LIST
    SELECTED_WORKFLOWS="$WF_CHOICE_LIST"
    success "Workflows sélectionnés : $SELECTED_WORKFLOWS"
fi

# ─── Étape 9 : Confirmation ──────────────────────────────────────────

step "8/8 — Confirmation"
echo "Récapitulatif :"
echo ""
echo -e "  Langue équipe  : ${BOLD}$LANGUE_EQUIPE${NC}"
echo -e "  Langue output  : ${BOLD}$LANGUE_OUTPUT${NC}"
echo -e "  Plateformes    : ${BOLD}${PLATFORMS[*]}${NC}"
echo -e "  Projet         : ${BOLD}$PROJECT_DIR${NC}"
echo -e "  Output         : ${BOLD}$OUTPUT_DIR${NC}"
echo -e "  Agents         : ${BOLD}$SELECTED_AGENTS${NC}"
echo -e "  Workflows      : ${BOLD}$SELECTED_WORKFLOWS${NC}"
echo ""
read -rp "Lancer l'installation ? [O/n] : " CONFIRM
CONFIRM=${CONFIRM:-O}

if [[ ! "$CONFIRM" =~ ^[OoYy]$ ]]; then
    echo "Installation annulée."
    exit 0
fi

# ─── Génération ───────────────────────────────────────────────────────

step "Génération en cours..."

PLATFORMS_STR=$(IFS=,; echo "${PLATFORMS[*]}")

# Tenter Node.js d'abord, Python en fallback
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
    error "Ni Node.js ni Python 3 ne sont installés. Impossible de générer."
    exit 1
fi

# ─── Fin ──────────────────────────────────────────────────────────────

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}   ✅ Installation terminée !${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Prochaines étapes :"
echo "  1. Ouvrez votre projet dans votre IDE"
echo "  2. Les agents sont prêts à être utilisés"
echo "  3. Tapez /help pour voir les commandes disponibles"
echo ""
echo "Pour reconfigurer : bash install.sh"
echo "Pour mettre à jour : node generator/generate.js --config .cohesium.yaml"
echo ""
