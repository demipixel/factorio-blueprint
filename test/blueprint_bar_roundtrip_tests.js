const assert = require('assert');
const Blueprint = require('..');

describe('Inventory bar roundtrip', () => {
  for (const bar of [0, 4, undefined]) {
    it(`preserves bar ${bar} through encode and load`, () => {
      const bp = new Blueprint();
      const chest = bp.createEntity('iron_chest', { x: 0, y: 0 });
      if (bar !== undefined) chest.setBar(bar);
      const loaded = new Blueprint(bp.encode());
      assert.equal(loaded.entities[0].bar, bar === undefined ? -1 : bar);
      assert.strictEqual(loaded.toObject().blueprint.entities[0].bar, bar);
    });
  }
});
