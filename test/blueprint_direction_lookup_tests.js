const assert = require('assert');
const Blueprint = require('..');

describe('Position lookups after setDirection', () => {
  it('updates the occupied cells when a placed splitter rotates', () => {
    const bp = new Blueprint();
    const splitter = bp.createEntity('splitter', { x: 0, y: 0 }, Blueprint.UP);
    splitter.setDirection(Blueprint.RIGHT);
    assert.strictEqual(bp.findEntity({ x: 0, y: 1 }), splitter);
    assert.strictEqual(bp.findEntity({ x: 1, y: 0 }), null);
    splitter.setDirection(Blueprint.UP);
    assert.strictEqual(bp.findEntity({ x: 1, y: 0 }), splitter);
    assert.strictEqual(bp.findEntity({ x: 0, y: 1 }), null);
    splitter.setDirection(Blueprint.DOWN);
    assert.strictEqual(bp.findEntity({ x: 1, y: 0 }), splitter);
    splitter.remove();
    assert.strictEqual(bp.findEntity({ x: 1, y: 0 }), null);
    assert.strictEqual(bp.findEntity({ x: 0, y: 1 }), null);
  });

  it('does not place an entity during construction or after removal', () => {
    const bp = new Blueprint();
    const placed = bp.createEntity('splitter', { x: 0, y: 0 });
    const unplaced = bp.createEntity('splitter', { x: 0, y: 0 }, Blueprint.RIGHT, true, true);
    unplaced.setDirection(Blueprint.UP);
    assert.strictEqual(bp.findEntity({ x: 0, y: 0 }), placed);
    assert.strictEqual(bp.findEntity({ x: 0, y: 1 }), null);
    placed.remove();
    placed.setDirection(Blueprint.RIGHT);
    assert.strictEqual(bp.findEntity({ x: 0, y: 0 }), null);
    assert.strictEqual(bp.findEntity({ x: 0, y: 1 }), null);
  });

  it('updates a loaded entity using its blueprint direction units', () => {
    const bp = new Blueprint();
    bp.createEntity('splitter', { x: 0, y: 0 });
    const loaded = new Blueprint(bp.encode());
    loaded.entities[0].setDirection(Blueprint.RIGHT);
    assert.strictEqual(loaded.findEntity({ x: 0, y: 1 }), loaded.entities[0]);
    assert.strictEqual(loaded.findEntity({ x: 1, y: 0 }), null);
  });
});
