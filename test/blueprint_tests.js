const assert = require('assert');
const Blueprint = require('../src/index');
const Victor = require('victor');

/*
 *
 * Tests that are aimed at end-to-end tests.
 *
 * Format should be a simple blueprint from in-game that demonstrates
 * features. Then various assertions based on that.
 *
 */

describe('Blueprints', function () {
  describe('simple, small', function () {
    it('2x walls centered on one of them', function () {
      const input = '0eJy1UUGKwzAM/MucXegWevGx31iW4DSiFThysJ22IfjvVZxmWdjLstCLQTPSzEie0fqRhsiSYWfwOUiC/ZyR+CLOL1ieBoIFZ+phIK5fqpSD0O7uvEcxYOnoAftRzP8GD+XLgCRzZlrtf3cbDCFpQ5BFW4f2BpO+qtJxpPPKKLjZyjBmndKNZGVVeS4VyDH4pqWru3GIK1rdp0bGvqX4WuUPIY41xPE9IepZ6vnsj28yuFFMm5F3Lem1cfrmS3kCsmSfyg=='; // TODO replace with version from in-game
      var bp = new Blueprint().load(input);
      console.log(bp.toJSON());
      var wall1 = bp.findEntity(new Victor(0,0));

      assert.equal(wall1.name, "stone-wall");
      assert.equal(wall1.position.x, 0);
      assert.equal(wall1.position.y, 0);

      var wall2 = bp.findEntity(new Victor(5,5));
      assert.equal(wall2.name, "stone-wall");
      assert.equal(wall2.position.x, 5);
      assert.equal(wall2.position.y, 5);
    });
  });

  describe('directions', function () {
    it('supports belts going in all directions', function () {
      const input = '0eJytksFqwzAMht9FZxdSr+zg415jjOK02iZwZGMrpSH43WsnW0lZt+6Qo//fkj6Jf4TW9RgisYAZgQ6eE5jXERJ9sHVVkyEgGCDBDhSw7epLouUUfJRNi04gKyA+4hnMNquHxe82yebXDjq/KUAWEsKZ5f5MBcGn8slzHVRHKxjANKXTkSIeZqdRVwYOfa0qK/Lslu5jngSJ3u1b/LQn8nFWJ4Jhz33XYvza6w/+HzR6otne0uiVaPSC5n9n0bcgu5VAnhYgeA4RU3p4mebeZZ5XAtrV9ExxM4toKzhhTN+BcLaAFf/l6ud8ATHTDFU='; // TODO replace with version from in-game
      var bp = new Blueprint().load(input);
      console.log(bp.toJSON());
      var n = bp.findEntity(new Victor(1,0));
      var e = bp.findEntity(new Victor(2,1));
      var s = bp.findEntity(new Victor(1,2));
      var w = bp.findEntity(new Victor(0,1));

      assert.equal(n.name, "transport-belt");
      assert.equal(n.direction, Blueprint.UP);
      assert.equal(n.position.x, 1);
      assert.equal(n.position.y, 0);
      assert.equal(e.name, "fast-transport-belt");
      assert.equal(e.direction, Blueprint.RIGHT);
      assert.equal(e.position.x, 2);
      assert.equal(e.position.y, 1);
      assert.equal(s.name, "transport-belt");
      assert.equal(s.direction, Blueprint.DOWN);
      assert.equal(s.position.x, 1);
      assert.equal(s.position.y, 2);
      assert.equal(w.name, "express-transport-belt");
      assert.equal(w.direction, Blueprint.LEFT);
      assert.equal(w.position.x, 0);
      assert.equal(w.position.y, 1);
    });
  });

  describe('recipes', function () {
  });

  describe('modules', function () {
  });
  
  describe('filter inserters', function () {
  });

  describe('inventory filters', function () {
  });

  describe('logistic request filters', function () {
  });

  describe('bars', function () {
  });

  describe('circuit conditions', function () {
  });

  describe('connections', function () {
  });
});

// vi: sts=2 ts=2 sw=2 et
