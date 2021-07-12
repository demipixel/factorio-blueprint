const assert = require('assert');
const Blueprint = require('../dist/factorio-blueprint.min.js');

describe('Electric Connections', () => {
  const bp = new Blueprint();
  const positions = [
    [0, 0],
    [5, 0],
    [0, 5],
    [5, 5],
  ];
  for (const [x, y] of positions) {
    bp.createEntity('medium_electric_pole', { x, y });
  }
  const obj = bp.toObject();

  assert.deepStrictEqual(obj.blueprint.entities[0].neighbours, [2, 3]);
  assert.deepStrictEqual(obj.blueprint.entities[1].neighbours, [1, 4]);
  assert.deepStrictEqual(obj.blueprint.entities[2].neighbours, [1, 4]);
  assert.deepStrictEqual(obj.blueprint.entities[3].neighbours, [2, 3]);
});
