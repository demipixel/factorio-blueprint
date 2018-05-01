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
      const input = '0eJy1UUGKwzAM/MucXegWevGx31iW4DSiFThysJ22IfjvVZxmWdjLstCLQTPSzEie0fqRhsiSYWfwOUiC/ZyR+CLOL1ieBoIFZ+phIK5fqpSD0O7uvEcxYOnoAftRzP8GD+XLgCRzZlrtf3cbDCFpQ5BFW4f2BpO+qtJxpPPKKLjZyjBmndKNZGVVeS4VyDH4pqWru3GIK1rdp0bGvqX4WuUPIY41xPE9IepZ6vnsj28yuFFMm5F3Lem1cfrmS3kCsmSfyg==';
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
