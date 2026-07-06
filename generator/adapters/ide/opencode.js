/** Assemble — OpenCode Adapter — Generates .opencode/agents/ + skills/ + workflows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'opencode', displayName: 'OpenCode' });
