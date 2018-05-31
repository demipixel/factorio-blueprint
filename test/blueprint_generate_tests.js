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
      const e = bp.createEntity("assembling_machine_3", {x: 0, y: 0}, Blueprint.DOWN);
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
      const e = bp.createEntity("assembling_machine_3", {x: 0, y: 0}, Blueprint.UP);
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
    it('stack filter inserters have only one filter', function () {
      const bp = new Blueprint();
      bp.name = "stack filter inserter";
      const e = bp.createEntity("stack_filter_inserter", {x: 0, y: 0}, Blueprint.UP);
      e.setFilter(0, 'stone_wall');
      
      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 0);
      assert.equal(obj.blueprint.entities[0].name, "stack-filter-inserter");
      assert.equal(obj.blueprint.entities[0].filters[0].index, 1); // TODO possible bug here; the parse test has it indexed from 0.
      assert.equal(obj.blueprint.entities[0].filters[0].name, 'stone-wall');
    });
    it('have multiple filters', function () {
      const bp = new Blueprint();
      bp.name = "filter inserter";
      const e = bp.createEntity("filter_inserter", {x: 0, y: 0}, Blueprint.UP);
      e.setFilter(0, 'stone_wall');
      e.setFilter(4, 'iron_plate');

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 0);
      assert.equal(obj.blueprint.entities[0].name, "filter-inserter");
      assert.equal(obj.blueprint.entities[0].filters[0].index, 1);
      assert.equal(obj.blueprint.entities[0].filters[0].name, 'stone-wall');
      assert.equal(obj.blueprint.entities[0].filters[1].index, 5);
      assert.equal(obj.blueprint.entities[0].filters[1].name, 'iron-plate');
    });
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
    it('has a box with no bar', function () {
      const bp = new Blueprint();
      bp.name = "box with bar";
      const e = bp.createEntity("wooden_chest", {x: 0, y: 0}, Blueprint.UP);

      // XXX BUG? Documentation suggests that -1 should disable the bar
      // e.setBar(-1); // disable the bar (all slots available)

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, "wooden-chest");
      assert.equal('undefined', typeof obj.blueprint.entities[0].bar);
    });
    it('has a box with some bar', function () {
      const bp = new Blueprint();
      bp.name = "box with bar";
      const e = bp.createEntity("wooden_chest", {x: 0, y: 0}, Blueprint.UP);

      e.setBar(4); // Allow 4 slots to be used by machines.

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, "wooden-chest");
      assert.equal(obj.blueprint.entities[0].bar, 4);
    });
    it('fails when trying to add a bar to something that does not have an inventory', function () {
      const bp = new Blueprint();
      bp.name = "box with bar";
      const e = bp.createEntity("stone_wall", {x: 0, y: 0}, Blueprint.UP);

      assert.throws(function() {
        e.setBar("not a number");
      }, Error);
    });
    it('fails when trying to add a bar with a negative number', function () {
      const bp = new Blueprint();
      bp.name = "box with bar";
      const e = bp.createEntity("wooden_chest", {x: 0, y: 0}, Blueprint.UP);

      assert.throws(function() {
        e.setBar(-9001);
      }, Error);
    });
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
    it('has two power poles connected with red wire', function () {
      const bp = new Blueprint();
      bp.name = "Connected Wires";
      const e1 = bp.createEntity("medium_electric_pole", {x: 0, y: 0}, Blueprint.UP);
      const e2 = bp.createEntity("medium_electric_pole", {x: 0, y: 5}, Blueprint.UP);
      e1.connect(e2, null, null, 'red');

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, "medium-electric-pole");
      assert.equal(obj.blueprint.entities[0].entity_number, 1);
      assert.equal(obj.blueprint.entities[0].connections['1'].red[0].entity_id, 2);

      assert.equal(obj.blueprint.entities[1].name, "medium-electric-pole");
      assert.equal(obj.blueprint.entities[1].entity_number, 2);
      assert.equal(obj.blueprint.entities[1].connections['1'].red[0].entity_id, 1);
    });
  });
});

// vi: sts=2 ts=2 sw=2 et
