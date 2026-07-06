/** Assemble — iFlow Adapter — Generates .iflow/agents/ + .iflow/skills/ + .iflow/flows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'iflow', displayName: 'iFlow', workflowsSubdir: 'flows' });
