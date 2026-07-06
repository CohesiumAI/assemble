/** Assemble — Rovo Dev Adapter — Generates .rovo/agents/ + skills/ + workflows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'rovodev', displayName: 'Rovo Dev', dir: '.rovo' });
