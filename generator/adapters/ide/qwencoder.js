/** Assemble — QwenCoder Adapter — Generates .qwencoder/agents/ + skills/ + workflows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'qwencoder', displayName: 'QwenCoder' });
