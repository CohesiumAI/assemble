/**
 * Assemble — MCP Server Generator
 * Generates an MCP (Model Context Protocol) server that exposes all agents as tools.
 * The generated server uses @modelcontextprotocol/sdk (installed separately).
 *
 * Platform-agnostic: resolves agent file paths based on active platforms.
 */

const fs = require('fs');
const path = require('path');
const { agentId, marvelSlug, marvelDisplayName } = require('./template-engine');

/**
 * Build a platform-agnostic agent path resolver snippet for the MCP server.
 * At runtime, the server checks which platform directories exist and reads from the first match.
 * @param {Array} platforms - List of active platform names from config
 * @returns {string} - JS code snippet for the resolve function
 */
function buildAgentResolver(platforms) {
  // Map platform names to their agent path patterns
  const platformPaths = {
    'claude-code': '.claude/agents/{slug}/AGENT.md',
    'cursor':      '.cursor/agents/{slug}.md',
    'windsurf':    '.windsurf/rules/{slug}.md',
    'cline':       '.cline/agents/{slug}.md',
    'copilot':     '.github/instructions/{slug}.md',
    'kiro':        '.kiro/agents/{slug}.json',
    'trae':        '.trae/agents/{slug}.md',
    'antigravity': '.antigravity/agents/{slug}.md',
    'codebuddy':   '.codebuddy/agents/{slug}.md',
    'crush':       '.crush/agents/{slug}.md',
    'iflow':       '.iflow/agents/{slug}.md',
    'kilocoder':   '.kilocoder/agents/{slug}.md',
    'opencode':    '.opencode/agents/{slug}.md',
    'qwencoder':   '.qwencoder/agents/{slug}.md',
    'rovodev':     '.rovo/agents/{slug}.md',
    'gemini-cli':  '.gemini/agents/{slug}.md',
    'roocode':     '.roo/rules-{slug}.md',
    'auggie':      '.augment/commands/agent-{slug}.md',
    'codex':       'AGENTS.md',
    'pi':          'AGENTS.md',
  };

  // Build ordered list of paths to check based on active platforms
  const candidates = (platforms || [])
    .map(p => platformPaths[p])
    .filter(Boolean);

  // Fallback: if no platforms matched, use a generic list
  if (candidates.length === 0) {
    candidates.push('.claude/agents/{slug}/AGENT.md');
    candidates.push('.cursor/agents/{slug}.md');
  }

  const candidatesStr = candidates.map(c => `    "${c}"`).join(',\n');
  return `const AGENT_PATH_CANDIDATES = [\n${candidatesStr}\n  ];`;
}

/**
 * Generate MCP server files in the project directory.
 * @param {string} projectDir - Project root
 * @param {object} options - { agents, workflows, config }
 */
function generateMCPServer(projectDir, { agents = [], workflows = [], config = {} }) {
  const mcpDir = path.join(projectDir, '.assemble');
  fs.mkdirSync(mcpDir, { recursive: true });

  const platforms = config.platforms || [];
  const resolverCode = buildAgentResolver(platforms);

  // 1. Generate mcp-server.js
  const toolEntries = agents.map(agent => {
    const id = agentId(agent);
    const slug = marvelSlug(agent);
    const display = marvelDisplayName(agent).replace(/`/g, "'").replace(/\$\{/g, '$\\{');
    const desc = (agent.meta.description || '')
      .replace(/"/g, '\\"')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
      .substring(0, 200);
    return `  server.tool("invoke-${slug}", "${display} — ${desc}", { request: { type: "string", description: "What you need ${display} to do" } }, async ({ request }) => {
    const agentFile = resolveAgentPath("${slug}");
    const instructions = agentFile ? \`Read full instructions from \${agentFile}\` : "Agent definition not found on disk — use built-in knowledge for ${display}";
    return { content: [{ type: "text", text: \`[${display} (@${slug})] Executing: \${request}\\n\\nAgent ID: ${id}\\n\${instructions}\` }] };
  });`;
  }).join('\n\n');

  const workflowTriggers = workflows.map(wf => {
    const raw = wf.raw || '';
    const nameMatch = raw.match(/name:\s*"?([^"\n]+)"?/);
    const name = nameMatch ? nameMatch[1].trim() : wf.fileName;
    const triggerMatch = raw.match(/trigger:\s*\/?([\w-]+)/);
    const trigger = triggerMatch ? triggerMatch[1] : wf.fileName.replace(/\.(yaml|yml)$/, '');
    return `    "/${trigger}": "${name}"`;
  }).join(',\n');

  const serverContent = `#!/usr/bin/env node
/**
 * Assemble MCP Server — Auto-generated
 * Exposes ${agents.length} agents as MCP tools + jarvis-route for smart routing.
 * Transport: stdio
 *
 * Setup:   cd .assemble && npm install
 * Run:     cd .assemble && node mcp-server.js
 * Or from project root: node .assemble/mcp-server.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve paths relative to project root (parent of .assemble/)
const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = resolve(dirname(__filename), '..');

const server = new McpServer({
  name: "assemble",
  version: "${config.version || '1.0.0'}",
  description: "Assemble — ${agents.length}-agent AI team orchestrator by Cohesium AI",
});

// ─── Agent path resolver (platform-agnostic) ───────────────────────────────

${resolverCode}

function resolveAgentPath(slug) {
  for (const pattern of AGENT_PATH_CANDIDATES) {
    const candidate = resolve(PROJECT_ROOT, pattern.replace(/\\{slug\\}/g, slug));
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

// ─── Jarvis Route (smart routing) ──────────────────────────────────────────

const AGENT_REGISTRY = {
${agents.map(a => `  "${marvelSlug(a)}": { id: "${agentId(a)}", name: "${marvelDisplayName(a).replace(/"/g, '\\"')}" }`).join(',\n')}
};

// Domain→agent keyword mapping for routing
const DOMAIN_KEYWORDS = {
  "tony-stark": ["architecture", "stack", "scalability", "system design"],
  "bruce-banner": ["api", "backend", "server", "endpoint"],
  "spider-man": ["ui", "frontend", "react", "component"],
  "mr-fantastic": ["fullstack", "mvp", "debug", "integration"],
  "ant-man": ["mobile", "react native", "flutter", "ios", "android"],
  "thor": ["ci/cd", "docker", "kubernetes", "deploy", "devops"],
  "hawkeye": ["test", "qa", "regression", "coverage"],
  "punisher": ["security", "vulnerability", "audit", "compliance"],
  "microchip": ["red team", "hacking", "exploit", "injection", "pentest", "offensive"],
  "professor-x": ["product", "roadmap", "okr", "user story"],
  "captain-america": ["sprint", "agile", "scrum", "ceremony"],
  "star-lord": ["marketing", "gtm", "positioning", "campaign"],
  "black-widow": ["seo", "crawl", "indexation", "ranking"],
  "storm": ["content", "article", "blog", "editorial"],
  "loki": ["copywriting", "slogan", "messaging", "headline"],
  "beast": ["data", "analytics", "dashboard", "metrics"],
  "vision": ["ai", "ml", "llm", "fine-tuning", "model"],
  "invisible-woman": ["ux", "wireframe", "design", "prototype"],
  "iron-fist": ["pricing", "budget", "p&l", "finance"],
};

// Workflow keyword mapping — generated dynamically from actual workflow files
const WORKFLOW_KEYWORDS = {
${workflows.map(wf => {
    const raw = wf.raw || '';
    const triggerMatch = raw.match(/trigger:\s*\/?([\w-]+)/);
    const trigger = triggerMatch ? triggerMatch[1] : wf.fileName.replace(/\.(yaml|yml)$/, '');
    const nameMatch = raw.match(/name:\s*"?([^"\n]+)"?/);
    const name = nameMatch ? nameMatch[1].trim().toLowerCase() : trigger;
    const descMatch = raw.match(/description:\s*"?([^"\n]+)"?/);
    const desc = descMatch ? descMatch[1].trim().toLowerCase() : '';
    // Build keyword list from trigger, name words, and description words
    const keywords = new Set([trigger.replace(/-/g, ' ')]);
    name.split(/[\s—,]+/).filter(w => w.length > 3).forEach(w => keywords.add(w));
    desc.split(/[\s—,]+/).filter(w => w.length > 3).forEach(w => keywords.add(w));
    const kwArray = [...keywords].map(k => `"${k.replace(/"/g, '\\"')}"`).join(', ');
    return `    "${trigger}": [${kwArray}]`;
  }).join(',\n')}
};

function routeRequest(request) {
  const lower = request.toLowerCase();

  // 1. Match agents by keyword scoring (weighted: exact match > partial)
  const agentMatches = [];
  for (const [slug, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        // Longer keywords get higher weight (more specific = more relevant)
        score += kw.length;
      }
    }
    if (score > 0) agentMatches.push({ slug, score });
  }
  agentMatches.sort((a, b) => b.score - a.score);

  // 2. Match workflows by keyword
  let matchedWorkflow = null;
  let bestWfScore = 0;
  for (const [wf, keywords] of Object.entries(WORKFLOW_KEYWORDS)) {
    const wfScore = keywords.filter(kw => lower.includes(kw)).length;
    if (wfScore > bestWfScore) {
      bestWfScore = wfScore;
      matchedWorkflow = wf.startsWith("/") ? wf : "/" + wf;
    }
  }

  // 3. Determine complexity from agent diversity
  const uniqueDomains = agentMatches.length;
  const complexity = uniqueDomains === 0 ? "TRIVIAL"
    : uniqueDomains === 1 ? "TRIVIAL"
    : uniqueDomains <= 3 ? "MODERATE"
    : "COMPLEX";

  // 4. Select top agents (up to 5 for COMPLEX, 3 for MODERATE, 1 for TRIVIAL)
  const maxAgents = complexity === "COMPLEX" ? 5 : complexity === "MODERATE" ? 3 : 1;
  const agents = agentMatches.length > 0
    ? agentMatches.slice(0, maxAgents).map(m => m.slug)
    : Object.keys(AGENT_REGISTRY).slice(0, 1);

  return { agents, complexity, matchedWorkflow };
}

server.tool("jarvis-route", "Jarvis smart routing — analyzes request, assesses complexity, selects agents", { request: { type: "string", description: "User request to route" } }, async ({ request }) => {
  const workflows = {
${workflowTriggers}
  };
  const { agents: suggestedAgents, complexity, matchedWorkflow } = routeRequest(request);
  const routing = {
    request,
    complexity,
    suggested_agents: suggestedAgents,
    matched_workflow: matchedWorkflow,
    available_workflows: workflows,
    agent_count: Object.keys(AGENT_REGISTRY).length,
    methodology: complexity === "TRIVIAL" ? "Single agent, direct answer"
      : complexity === "MODERATE" ? "2-3 agents, sequential execution"
      : "Spec-driven: SPECIFY → PLAN → TASKS → IMPLEMENT → CLOSE",
  };
  return {
    content: [{
      type: "text",
      text: JSON.stringify(routing, null, 2)
    }]
  };
});

// ─── Agent Tools (${agents.length} agents) ─────────────────────────────────────────

${toolEntries}

// ─── Start Server ──────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
`;

  fs.writeFileSync(path.join(mcpDir, 'mcp-server.js'), serverContent, 'utf-8');

  // 2. Generate mcp.json (Claude Desktop / VS Code config)
  const mcpConfig = {
    mcpServers: {
      assemble: {
        command: 'node',
        args: ['.assemble/mcp-server.js'],
        description: `Assemble — ${agents.length}-agent AI team orchestrator`,
      },
    },
  };
  fs.writeFileSync(path.join(mcpDir, 'mcp.json'), JSON.stringify(mcpConfig, null, 2), 'utf-8');

  // 3. Generate mcp-package.json (for dependency installation)
  const mcpPackage = {
    name: 'assemble-mcp-server',
    version: config.version || '1.0.0',
    type: 'module',
    description: 'MCP server for Assemble AI agent team',
    main: 'mcp-server.js',
    dependencies: {
      '@modelcontextprotocol/sdk': '^1.0.0',
    },
  };
  fs.writeFileSync(path.join(mcpDir, 'package.json'), JSON.stringify(mcpPackage, null, 2), 'utf-8');

  return {
    files: [
      path.join(mcpDir, 'mcp-server.js'),
      path.join(mcpDir, 'mcp.json'),
      path.join(mcpDir, 'package.json'),
    ],
  };
}

module.exports = { generateMCPServer };
