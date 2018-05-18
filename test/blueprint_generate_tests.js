const assert = require('assert');
const Blueprint = require('../src/index');
const Victor = require('victor');

/*
 *
 * Generation tests that are aimed at end-to-end tests.
 *
 * Format should be create a Blueprint object and add things to it; then test
 * via the 'toObject' method as that's the easiest way to get assertions.
 * Alternatives are: (a) use 'toJSON' and (b) use 'encode', however,
 * those two are standard transformations and can be tested elsewhere.
 *
 */

describe('Blueprint Generation', function () {
  describe('simple, small', function () {
    it('single wall piece', function () {
      const bp = new Blueprint();
      bp.createEntity('stone_wall', {x: 3, y: 4});
      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, "stone-wall");
    });
  });

  describe('directions', function () {
    it('supports belts going in all directions', function () {
      const bp = new Blueprint();
      bp.createEntity('express_transport_belt', {x: 1, y: 0}, Blueprint.DOWN);
      bp.createEntity('express_transport_belt', {x: 2, y: 1}, Blueprint.LEFT);
      bp.createEntity('express_transport_belt', {x: 1, y: 2}, Blueprint.UP);
      bp.createEntity('express_transport_belt', {x: 0, y: 1}, Blueprint.RIGHT);
      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 4);
      assert.equal(obj.blueprint.entities[0].name, "express-transport-belt");
      assert.equal(obj.blueprint.entities[1].direction, 6);
      assert.equal(obj.blueprint.entities[1].name, "express-transport-belt");
      assert.equal(obj.blueprint.entities[2].direction, 0);
      assert.equal(obj.blueprint.entities[2].name, "express-transport-belt");
      assert.equal(obj.blueprint.entities[3].direction, 2);
      assert.equal(obj.blueprint.entities[3].name, "express-transport-belt");
    });
  });

  describe('recipes', function () {
    it('supports recipes in assemblers', function () {
      const bp = new Blueprint();
      bp.name = "Stone Assembler3";
      e = bp.createEntity("assembling_machine_3", {x: 0, y: 0}, Blueprint.DOWN);
      e.setRecipe("stone_wall");

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 4);
      assert.equal(obj.blueprint.entities[0].recipe, "stone-wall");
      assert.equal(obj.blueprint.entities[0].name, "assembling-machine-3");
    });
  });

  describe('modules', function () {
    it('supports modules in assemblers', function () {
      const bp = new Blueprint();
      bp.name = "Stone Assembler3";
      e = bp.createEntity("assembling_machine_3", {x: 0, y: 0}, Blueprint.UP);
      e.setRecipe("stone_wall");
      e.modules['speed_module_3'] = 1;
      e.modules['productivity_module_3'] = 2;
      e.modules['effectivity_module_3'] = 1;

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 0);
      assert.equal(obj.blueprint.entities[0].recipe, "stone-wall");
      assert.equal(obj.blueprint.entities[0].name, "assembling-machine-3");
      assert.equal(obj.blueprint.entities[0].items["productivity-module-3"], 2);
      assert.equal(obj.blueprint.entities[0].items["effectivity-module-3"], 1);
      assert.equal(obj.blueprint.entities[0].items["speed-module-3"], 1);

    });
  });

  describe('filter inserters', function () {
//    it('stack filter inserters have only one filter', function () {
//    });
//    it('have multiple filters', function () {
//    });
  });

  describe('inventory filters', function () {
  });

  describe('logistic request filters', function () {
//    it('storage chest ?', function () {
//    });
//    it('request chest', function () {
//    });
//    it('buffer chest', function () {
//    });
  });

  describe('bars', function () {
//    it('has a box with no bar', function () {
//    });
//    it('has a box with some bar', function () {
//    });
//    it('fails when trying to add a bigger bar than the box has inventory', function () {
//    });
  });

  describe('circuit conditions', function () {
//    it('can enable/disable train stops', function () {
//    });
//    it('can handle signals', function () {
//    });
//    it('can handle coloured lamps', function () {
//    });
//    it('can handle programmable speakers', function () {
//    });
//    it('can read electric ore miners', function () {
//    });
  });

  describe('connections', function () {
  });
});

// vi: sts=2 ts=2 sw=2 et
