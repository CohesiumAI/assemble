/** Assemble — KiloCoder Adapter — Generates .kilocoder/agents/ + skills/ + workflows/ */
const { makeGenericAdapter } = require('../_generic-adapter');
module.exports = makeGenericAdapter({ name: 'kilocoder', displayName: 'KiloCoder' });
