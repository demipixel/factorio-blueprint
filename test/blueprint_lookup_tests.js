const assert = require('assert');
const Blueprint = require('..');

/*
 *
 * Tests for finding and removing things by position.
 *
 */

describe('Blueprint Lookups', () => {
  describe('entities', () => {
    it('finds an entity from any point on its tiles', () => {
      const bp = new Blueprint();
      const pumpjack = bp.createEntity('pumpjack', { x: 0, y: 0 });

      assert.equal(bp.findEntity({ x: 0, y: 0 }), pumpjack);
      assert.equal(bp.findEntity({ x: 1.5, y: 1.5 }), pumpjack);
      assert.equal(bp.findEntity({ x: 2.9, y: 0.2 }), pumpjack);
      assert.equal(bp.findEntity({ x: 0.2, y: 2.9 }), pumpjack);
    });

    it('finds nothing next to an entity', () => {
      const bp = new Blueprint();
      bp.createEntity('pumpjack', { x: 0, y: 0 });

      assert.equal(bp.findEntity({ x: 3, y: 1 }), null);
      assert.equal(bp.findEntity({ x: 1, y: 3.5 }), null);
      assert.equal(bp.findEntity({ x: -0.5, y: 1 }), null);
    });

    it('removes an entity from any point on its tiles', () => {
      const bp = new Blueprint();
      bp.createEntity('pumpjack', { x: 0, y: 0 });
      bp.removeEntityAtPosition({ x: 2.5, y: 1.5 });

      assert.equal(bp.entities.length, 0);
      assert.equal(bp.findEntity({ x: 1, y: 1 }), null);
    });
  });

  describe('tiles', () => {
    it('finds a tile from any point on it', () => {
      const bp = new Blueprint();
      const tile = bp.createTile('concrete', { x: 2, y: 3 });

      assert.equal(bp.findTile({ x: 2, y: 3 }), tile);
      assert.equal(bp.findTile({ x: 2.5, y: 3.5 }), tile);
      assert.equal(bp.findTile({ x: 3, y: 3 }), null);
    });

    it('forgets a removed tile', () => {
      const bp = new Blueprint();
      const tile = bp.createTile('concrete', { x: 2, y: 3 });
      bp.removeTile(tile);

      assert.equal(bp.tiles.length, 0);
      assert.equal(bp.findTile({ x: 2, y: 3 }), null);
    });

    it('keeps the new tile when one is replaced', () => {
      const bp = new Blueprint();
      bp.createTile('concrete', { x: 2, y: 3 });
      const replacement = bp.createTile('stone_path', { x: 2, y: 3 });

      assert.equal(bp.tiles.length, 1);
      assert.equal(bp.findTile({ x: 2, y: 3 }), replacement);
    });

    it('removes a tile by position', () => {
      const bp = new Blueprint();
      bp.createTile('concrete', { x: 2, y: 3 });
      bp.removeTileAtPosition({ x: 2.5, y: 3.5 });

      assert.equal(bp.tiles.length, 0);
      assert.equal(bp.findTile({ x: 2, y: 3 }), null);
    });
  });
});
