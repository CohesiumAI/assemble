/**
 * Assemble — MCP Server Generator
 * Generates an MCP (Model Context Protocol) server that exposes all agents as tools.
 * The generated server uses @modelcontextprotocol/sdk (installed separately).
 */

const fs = require('fs');
const path = require('path');
const { agentId, marvelSlug, marvelDisplayName } = require('./template-engine');

/**
 * Generate MCP server files in the project directory.
 * @param {string} projectDir - Project root
 * @param {object} options - { agents, workflows, config }
 */
function generateMCPServer(projectDir, { agents = [], workflows = [], config = {} }) {
  const mcpDir = path.join(projectDir, '.assemble');
  fs.mkdirSync(mcpDir, { recursive: true });

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
    return { content: [{ type: "text", text: \`[${display} (@${slug})] Executing: \${request}\\n\\nAgent ID: ${id}\\nRead agent definition from .claude/agents/${slug}/AGENT.md for full instructions.\` }] };
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
 * Install: npm install @modelcontextprotocol/sdk
 * Run:     node mcp-server.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "assemble",
  version: "${config.version || '1.0.0'}",
  description: "Assemble — ${agents.length}-agent AI team orchestrator by Cohesium AI",
});

// ─── Jarvis Route (smart routing) ──────────────────────────────────────────

server.tool("jarvis-route", "Jarvis smart routing — analyzes request, assesses complexity, selects agents", { request: { type: "string", description: "User request to route" } }, async ({ request }) => {
  const workflows = {
${workflowTriggers}
  };
  return {
    content: [{
      type: "text",
      text: \`[Jarvis] Routing: \${request}\\n\\nAvailable workflows: \${Object.entries(workflows).map(([k,v]) => \`\${k} → \${v}\`).join(", ")}\\n\\nRead .claude/rules/routing.md for full routing intelligence.\`
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
  fs.writeFileSync(path.join(mcpDir, 'mcp-package.json'), JSON.stringify(mcpPackage, null, 2), 'utf-8');

  return {
    files: [
      path.join(mcpDir, 'mcp-server.js'),
      path.join(mcpDir, 'mcp.json'),
      path.join(mcpDir, 'mcp-package.json'),
    ],
  };
}

module.exports = { generateMCPServer };
