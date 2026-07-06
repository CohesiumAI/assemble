/** Assemble — Crush Adapter — Generates .crush/agents/ + skills/ + workflows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'crush', displayName: 'Crush' });
