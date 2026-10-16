const assert = require('assert');
const Blueprint = require('..');

describe('Tile cloning', () => {
  it('places a blueprint repeatedly without moving the original tiles', () => {
    const source = new Blueprint();
    const tile = source.createTile('concrete', { x: 2, y: 3 });
    const destination = new Blueprint();
    destination.placeBlueprint(source, { x: 10, y: 20 }, Blueprint.ROTATION_NONE);
    destination.placeBlueprint(source, { x: 30, y: 40 }, Blueprint.ROTATION_NONE);
    assert.deepEqual({ ...tile.position }, { x: 2, y: 3 });
    assert.strictEqual(source.findTile({ x: 2, y: 3 }), tile);
    assert.deepEqual({ ...destination.tiles[0].position }, { x: 12, y: 23 });
    assert.deepEqual({ ...destination.tiles[1].position }, { x: 32, y: 43 });
    source.removeTileAtPosition({ x: 2, y: 3 });
    assert.equal(source.findTile({ x: 2, y: 3 }), null);
    assert.equal(destination.tiles.length, 2);
  });

  it('returns independent position data, like Entity.getData()', () => {
    const bp = new Blueprint();
    const tile = bp.createTile('concrete', { x: 2, y: 3 });
    tile.getData().position.x = 10;
    assert.equal(tile.position.x, 2);
    assert.strictEqual(bp.findTile({ x: 2, y: 3 }), tile);
  });
});
