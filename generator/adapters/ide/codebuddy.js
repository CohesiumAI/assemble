/** Assemble — CodeBuddy Adapter — Generates .codebuddy/agents/ + skills/ + workflows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'codebuddy', displayName: 'CodeBuddy' });
