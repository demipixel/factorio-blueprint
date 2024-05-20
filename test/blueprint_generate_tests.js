const assert = require('assert');
const Blueprint = require('../dist/factorio-blueprint.min.js');
const Victor = require('victor');
const util = require('./util');

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

describe('Blueprint Generation', () => {
  describe('simple, small', () => {
    it('single wall piece', () => {
      const bp = new Blueprint();
      bp.createEntity('stone_wall', { x: 3, y: 4 });
      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, 'stone-wall');
    });
  });

  describe('directions', () => {
    it('supports belts going in all directions', () => {
      const bp = new Blueprint();
      bp.createEntity('express_transport_belt', { x: 1, y: 0 }, Blueprint.DOWN);
      bp.createEntity('express_transport_belt', { x: 2, y: 1 }, Blueprint.LEFT);
      bp.createEntity('express_transport_belt', { x: 1, y: 2 }, Blueprint.UP);
      bp.createEntity(
        'express_transport_belt',
        { x: 0, y: 1 },
        Blueprint.RIGHT,
      );
      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 4);
      assert.equal(obj.blueprint.entities[0].name, 'express-transport-belt');
      assert.equal(obj.blueprint.entities[1].direction, 6);
      assert.equal(obj.blueprint.entities[1].name, 'express-transport-belt');
      assert.equal(obj.blueprint.entities[2].direction, 0);
      assert.equal(obj.blueprint.entities[2].name, 'express-transport-belt');
      assert.equal(obj.blueprint.entities[3].direction, 2);
      assert.equal(obj.blueprint.entities[3].name, 'express-transport-belt');
    });
  });

  describe('recipes', () => {
    it('supports recipes in assemblers', () => {
      const bp = new Blueprint();
      bp.name = 'Stone Assembler3';
      const e = bp.createEntity(
        'assembling_machine_3',
        { x: 0, y: 0 },
        Blueprint.DOWN,
      );
      e.setRecipe('stone_wall');

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 4);
      assert.equal(obj.blueprint.entities[0].recipe, 'stone-wall');
      assert.equal(obj.blueprint.entities[0].name, 'assembling-machine-3');
    });
  });

  describe('modules', () => {
    it('supports modules in assemblers', () => {
      const bp = new Blueprint();
      bp.name = 'Stone Assembler3';
      const e = bp.createEntity(
        'assembling_machine_3',
        { x: 0, y: 0 },
        Blueprint.UP,
      );
      e.setRecipe('stone_wall');
      e.modules['speed_module_3'] = 1;
      e.modules['productivity_module_3'] = 2;
      e.modules['effectivity_module_3'] = 1;

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 0);
      assert.equal(obj.blueprint.entities[0].recipe, 'stone-wall');
      assert.equal(obj.blueprint.entities[0].name, 'assembling-machine-3');
      assert.equal(obj.blueprint.entities[0].items['productivity-module-3'], 2);
      assert.equal(obj.blueprint.entities[0].items['effectivity-module-3'], 1);
      assert.equal(obj.blueprint.entities[0].items['speed-module-3'], 1);
    });
  });

  describe('filter inserters', () => {
    it('stack filter inserters have only one filter', () => {
      const bp = new Blueprint();
      bp.name = 'stack filter inserter';
      const e = bp.createEntity(
        'stack_filter_inserter',
        { x: 0, y: 0 },
        Blueprint.UP,
      );
      e.setFilter(0, 'stone_wall');

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 0);
      assert.equal(obj.blueprint.entities[0].name, 'stack-filter-inserter');
      assert.equal(obj.blueprint.entities[0].filters[0].index, 1); // TODO possible bug here; the parse test has it indexed from 0.
      assert.equal(obj.blueprint.entities[0].filters[0].name, 'stone-wall');
    });
    it('have multiple filters', () => {
      const bp = new Blueprint();
      bp.name = 'filter inserter';
      const e = bp.createEntity(
        'filter_inserter',
        { x: 0, y: 0 },
        Blueprint.UP,
      );
      e.setFilter(0, 'stone_wall');
      e.setFilter(4, 'iron_plate');

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].direction, 0);
      assert.equal(obj.blueprint.entities[0].name, 'filter-inserter');
      assert.equal(obj.blueprint.entities[0].filters[0].index, 1);
      assert.equal(obj.blueprint.entities[0].filters[0].name, 'stone-wall');
      assert.equal(obj.blueprint.entities[0].filters[1].index, 5);
      assert.equal(obj.blueprint.entities[0].filters[1].name, 'iron-plate');
    });
  });

  describe('inventory filters', () => { });

  describe('logistic request filters', () => {
    //    it('storage chest ?', () => {
    //    });
    //    it('request chest', () => {
    //    });
    //    it('buffer chest', () => {
    //    });
  });

  describe('bars', () => {
    it('has a box with no bar', () => {
      const bp = new Blueprint();
      bp.name = 'box with bar';
      const e = bp.createEntity('wooden_chest', { x: 0, y: 0 }, Blueprint.UP);

      // XXX BUG? Documentation suggests that -1 should disable the bar
      // e.setBar(-1); // disable the bar (all slots available)

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, 'wooden-chest');
      assert.equal('undefined', typeof obj.blueprint.entities[0].bar);
    });
    it('has a box with some bar', () => {
      const bp = new Blueprint();
      bp.name = 'box with bar';
      const e = bp.createEntity('wooden_chest', { x: 0, y: 0 }, Blueprint.UP);

      e.setBar(4); // Allow 4 slots to be used by machines.

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, 'wooden-chest');
      assert.equal(obj.blueprint.entities[0].bar, 4);
    });
    it('fails when trying to add a bar to something that does not have an inventory', () => {
      const bp = new Blueprint();
      bp.name = 'box with bar';
      const e = bp.createEntity('stone_wall', { x: 0, y: 0 }, Blueprint.UP);

      assert.throws(() => {
        e.setBar('not a number');
      }, Error);
    });
    it('fails when trying to add a bar with a negative number', () => {
      const bp = new Blueprint();
      bp.name = 'box with bar';
      const e = bp.createEntity('wooden_chest', { x: 0, y: 0 }, Blueprint.UP);

      assert.throws(() => {
        e.setBar(-9001);
      }, Error);
    });
  });

  describe('circuit conditions', () => {
    //    it('can enable/disable train stops', () => {
    //    });
    //    it('can handle signals', () => {
    //    });
    //    it('can handle coloured lamps', () => {
    //    });
    //    it('can handle programmable speakers', () => {
    //    });
    //    it('can read electric ore miners', () => {
    //    });
  });

  describe('connections', () => {
    it('has two power poles connected with red wire', () => {
      const bp = new Blueprint();
      bp.name = 'Connected Wires';
      const e1 = bp.createEntity(
        'medium_electric_pole',
        { x: 0, y: 0 },
        Blueprint.UP,
      );
      const e2 = bp.createEntity(
        'medium_electric_pole',
        { x: 0, y: 5 },
        Blueprint.UP,
      );
      e1.connect(e2, { color: 'red' });

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].name, 'medium-electric-pole');
      assert.equal(obj.blueprint.entities[0].entity_number, 1);
      assert.equal(
        obj.blueprint.entities[0].connections['1'].red[0].entity_id,
        2,
      );

      assert.equal(obj.blueprint.entities[1].name, 'medium-electric-pole');
      assert.equal(obj.blueprint.entities[1].entity_number, 2);
      assert.equal(
        obj.blueprint.entities[1].connections['1'].red[0].entity_id,
        1,
      );
    });
  });

  describe('splitters', () => {
    it('correctly sets filter and priorities', () => {
      const bp = new Blueprint();
      const ent = bp.createEntity(
        'express_splitter',
        { x: 0, y: 0 },
        Blueprint.UP,
      );
      ent.setSplitterFilter('electronic_circuit');
      ent.setInputPriority('left');
      ent.setOutputPriority('right');

      const obj = bp.toObject();

      assert.equal(obj.blueprint.entities[0].filter, 'electronic-circuit');
      assert.equal(obj.blueprint.entities[0].input_priority, 'left');
      assert.equal(obj.blueprint.entities[0].output_priority, 'right');
    });
  });

  describe('snapping', () => {
    const bp = new Blueprint();
    let grid = new Victor(10, 12);
    bp.setSnapping(grid);
    it('should default to relative snapping', () => {
      assert.strictEqual(bp.snapping.absolute, undefined);
    });
    it('should save snapping information', () => {
      assert.equal(bp.snapping.grid, grid);
    });
    it('should support absolute snapping', () => {
      bp.setSnapping(grid, true);
      assert.strictEqual(bp.snapping.absolute, true);
    });

  });

  describe('icons', () => {
    it('should save icons', () => {
      const bp = new Blueprint();
      bp.icons = ['electronic_circuit'];
      const obj = bp.toObject();
      assert.equal(obj.blueprint.icons[0].signal.name, 'electronic-circuit');
      assert.equal(obj.blueprint.icons[0].index, 1);
    });

    it('should save icons correctly when first is not set', () => {
      const bp = new Blueprint();
      bp.icons[2] = 'electronic_circuit';

      const obj = bp.toObject();
      assert.equal(obj.blueprint.icons[0].signal.name, 'electronic-circuit');
      assert.equal(obj.blueprint.icons[0].index, 3);
    });
  });

  describe('train stations', () => {
    it('should save station name', () => {
      const bp = new Blueprint();
      const station = bp.createEntity('train_stop', { x: 0, y: 0 });
      station.setStationName('Test Station');

      const obj = bp.toObject();
      assert.equal(obj.blueprint.entities[0].name, 'train-stop');
      assert.equal(obj.blueprint.entities[0].station, 'Test Station');
    });

    it('should set manual trains limit', () => {
      const bp = new Blueprint();
      const station = bp.createEntity('train_stop', { x: 0, y: 0 });
      station.setManualTrainsLimit(5);

      const obj = bp.toObject();
      assert.equal(obj.blueprint.entities[0].name, 'train-stop');
      assert.equal(obj.blueprint.entities[0].manual_trains_limit, 5);
    });

    it('should set control behavior', () => {
      const bp = new Blueprint();
      const station = bp.createEntity('train_stop', { x: 0, y: 0 });
      station.setCondition({
        left: 'signal-red',
        operator: '>',
        right: 0,
      });
      station.trainControlBehavior = {
        circuit_enable_disable: true,
        read_from_train: true,
        read_stopped_train: true,
        train_stopped_signal: {
          type: 'virtual',
          name: 'signal-T',
        },
      };

      const obj = JSON.parse(JSON.stringify(bp.toObject()));
      assert.deepEqual(obj.blueprint.entities[0].control_behavior, {
        circuit_condition: {
          first_signal: {
            type: 'virtual',
            name: 'signal-red',
          },
          comparator: '>',
          constant: 0,
        },
        read_from_train: true,
        read_stopped_train: true,
        train_stopped_signal: {
          type: 'virtual',
          name: 'signal-T',
        },
      });
    });
  });

});

describe('Blueprint output', () => {
  let bp = new Blueprint();
  bp.name = "custom label";
  bp.description = "custom description";
  bp.setSnapping(new Victor(10, 20), true);
  let bpObj = bp.toObject().blueprint;

  it('correctly handles blueprint labels', () => {
    assert.equal(bpObj.label, "custom label");
  });

  it('correctly handles blueprint descriptions', () => {
    assert.equal(bpObj.description, "custom description");
  })

  it('correnctly handles snapping size', () => {
    assert.equal(bpObj["snap-to-grid"].x, 10);
    assert.equal(bpObj["snap-to-grid"].y, 20);
  });
  it('correctly handles absolute snapping', () => {
    assert.strictEqual(bpObj['absolute-snapping'], true);
  });

});

describe('Blueprint Books', () => {
  const bp1 = new Blueprint();
  bp1.name = 'First';
  const bp2 = new Blueprint();
  bp2.name = 'Second';

  const bookString = Blueprint.toBook([bp1, bp2]);

  it('is a string', () => {
    assert.equal(typeof bookString, 'string');
  });

  it('checks bp string type', () => {
    assert.equal(Blueprint.isBook(bookString), true);
    assert.equal(Blueprint.isBook(bp1.encode()), false);
  });

  it('parses book', () => {
    assert.equal(Blueprint.getBook(bookString).length, 2);
  });

  it('has index on each blueprint', () => {
    const decoded = util.decode[0](bookString);
    assert.equal(decoded.blueprint_book.blueprints[0].index, 0);
    assert.equal(decoded.blueprint_book.blueprints[1].index, 1);
  });

  it('sorts based on index', () => {
    const decoded = util.decode[0](bookString);
    const [decodedBp1, decodedBp2] = decoded.blueprint_book.blueprints;
    decoded.blueprint_book.blueprints = [decodedBp2, decodedBp1];

    const encoded = util.encode[0](decoded);
    const book = Blueprint.getBook(encoded);
    // Should have looked at blueprint.index
    // and reordered the blueprints accordingly
    assert.equal(book[0].name, 'First');
    assert.equal(book[1].name, 'Second');
  });

  it('encodes with undefined and null values', () => {
    const bookString2 = Blueprint.toBook([undefined, null, bp1]);

    const decoded = Blueprint.getBook(bookString2);
    assert.equal(decoded[0], undefined);
    assert.equal(decoded[1], undefined);
    assert.equal(decoded[2].name, 'First');
  });
});

// vi: sts=2 ts=2 sw=2 et
