const assert = require('assert');
const Blueprint = require('../src/index');
const util = require('../src/util');
const Victor = require('victor');

/*
 *
 * Parsing tests that are aimed at end-to-end tests.
 *
 * Format should be a simple blueprint from in-game that demonstrates
 * features. Then various assertions based on that.
 *
 */

describe('Blueprint Parsing', function () {
  describe('simple, small', function () {
    it('2x walls centered on one of them', function () {
      const input = '0eNqNj8EKgzAQRP9lzhGqFiv5lVKKtktZiBsx0TZI/r2JXgrtoadllpm3syt6M9M4sXjoFXyz4qDPKxw/pDN558NI0GBPAxSkG7Jy3goVz84YRAWWO72gy3hRIPHsmXbKJsJV5qGnKRl+5RVG61LESr6WMEWyhTxiVF+I6i/ETkiAVGgrrj/+VFhocpu5aU9V2dbNoT7G+AaeUViT';
      var bp = new Blueprint().load(input);
      var wall1 = bp.findEntity(new Victor(-1,-1));

      assert.equal(wall1.name, "stone_wall");
      assert.equal(wall1.position.x, -1);
      assert.equal(wall1.position.y, -1);

      var wall2 = bp.findEntity(new Victor(1,1));
      assert.equal(wall2.name, "stone_wall");
      assert.equal(wall2.position.x, 1);
      assert.equal(wall2.position.y, 1);
    });
  });

  describe('directions', function () {
    it('supports belts going in all directions', function () {
      const input = '0eNqV0dFqwzAMBdB/uc82xEnoin9ljJG02jAkirHV0hD874sTGO2atuzRNjq6sia03Yl8cCywE9xh4Aj7PiG6b266fCejJ1g4oR4K3PT5JKHh6IcguqVOkBQcH+kCa5J6WfzVRNEPhTJ9KBCLE0drluUwfvKpbynMLR6lUPBDnMsGzq1nqlAYYbVJOdQfpfxV6OIDxahfadosXDFHPbpAh/Vpt2FXT0e9gzfdcsOt/zm5uSXr/LPLKuzV2hXOFOI6y/6tNPtqV1R1Sj8D1bWS';
      var bp = new Blueprint().load(input);
      var n = bp.findEntity(new Victor(0,-1));
      var e = bp.findEntity(new Victor(1,0));
      var s = bp.findEntity(new Victor(0,1));
      var w = bp.findEntity(new Victor(-1,0));

      assert.equal(n.name, "transport_belt");
      assert.equal(n.direction, Blueprint.UP);
      assert.equal(n.position.x, 0);
      assert.equal(n.position.y, -1);
      assert.equal(e.name, "fast_transport_belt");
      assert.equal(e.direction, Blueprint.RIGHT);
      assert.equal(e.position.x, 1);
      assert.equal(e.position.y, 0);
      assert.equal(s.name, "transport_belt");
      assert.equal(s.direction, Blueprint.DOWN);
      assert.equal(s.position.x, 0);
      assert.equal(s.position.y, 1);
      assert.equal(w.name, "express_transport_belt");
      assert.equal(w.direction, Blueprint.LEFT);
      assert.equal(w.position.x, -1);
      assert.equal(w.position.y, 0);
    });
  });

  describe('recipes', function () {
    it('supports recipes in assemblers', function () {
      const input = '0eNp9j8EKwjAQRP9lzim0KrXkV0QkrUtdSDalSdVS+u8m8eLJy8Iss29mN/R2oWlmidAbePASoC8bAo9ibN7FdSJocCQHBTEuKxMCud6yjJUzw4OFqga7Asud3tDNflUgiRyZvrwi1pssrqc5Gf6TFCYf0rGX3CABa4U1zZQw08ClUIg+eV/GWuS00k//vKPwpDkURNudD013bOvjad8/hm1RIQ==';
      var bp = new Blueprint().load(input);
      var assembler = bp.findEntity(new Victor(0,0));

      assert.equal(assembler.name, "assembling_machine_1");
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, -1);
      assert.equal(assembler.position.y, -1);
      assert.equal(assembler.recipe, 'stone_wall');
    });
  });

  describe('modules', function () {
    it('supports modules in assemblers', function () {
      const input = '0eNp9kNFqwzAMRf9Fzw60zeiKf2WMkTg3rZgtG9spC8H/Pjt96Rj0xXCtq6sjbTTaBSGyZNIbsfGSSH9slPgqg21/eQ0gTZzhSJEMrqkhJbjRslw7N5gbC7qeiiKWCT+kj+VTESRzZjzydrF+yeJGxGp4naQo+FSbvTSCGnhQtNa3TogwvANFb76Ru3mBrf6Gl5o5BWDqnJ8W25LaJMwzTOZ7BfhbCLGq/5VTafj7wvrpPoruiGlnOl/eT8dLfz70b6X8AvmFbMw=';
      var bp = new Blueprint().load(input);
      var assembler = bp.findEntity(new Victor(0,0));

      assert.equal(assembler.name, "assembling_machine_3");
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, -1);
      assert.equal(assembler.position.y, -1);
      assert.equal(assembler.recipe, 'rocket_fuel'); // XXX should be stone-wall?
      assert.equal(assembler.modules['speed_module_3'], 1);
      assert.equal(assembler.modules['effectivity_module_3'], 1);
      assert.equal(assembler.modules['productivity_module_3'], 2);
      //assert.equal(assembler.modules, {'speed_module_3': 1, 'productivity_module_3': 2, 'effectivity_module_3': 1}); // Should work out why this assertion does not pass.
    });
  });
  
  describe('filter inserters', function () {
    it('stack filter inserters have only one filter', function () {
      const input = '0eNqFj9EKgzAMRf/lPlfQOZz0V4YMddkI01TaOibSf1+rbOxtLyE35J7crOiGmSbL4qFXcG/EQZ9XOL5LO6SZXyaCBnsaoSDtmJTzbf/Ibjx4shmLIxsbBAWWK72gi9AokHj2TDtwE8tF5rGLm7r4g1KYjItuIylDJOYKS6zxxL66Uz/nvjS2RjJjCaFJEbbU+udJhWf0btiqPh2Kuqzy8hjCG3KaWUM=';
      var bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(0,0));

      assert.equal(entity.name, "stack_filter_inserter");
      assert.equal(entity.direction, Blueprint.UP);
      assert.equal(entity.position.x, 0);
      assert.equal(entity.position.y, 0);
      assert.equal(entity.filters['0'], 'iron_ore');
    });
    it('have multiple filters', function () {
      const input = '0eNp1j90KgzAMhd8l1x34M5z0VYYMddkIaFraOibSd19amexmNyHJSb6TbDBMC1pHHEBvQKNhD/q6gacn91PqhdUiaKCAMyjgfk7Vg6aA7kTs0UkCUQHxHd+gy9gpQA4UCHdULtYbL/Mgk7r8C1FgjZc9w8lXWIWCVaLA99Gd9zU6OOQMn4xDueJQq0MdjbXikvUuHZc/0T+PK3gJO9s27aUq27op6nOMH0+tXzQ=';
      var bp = new Blueprint().load(input);

      const entity = bp.findEntity(new Victor(0,0));

      assert.equal(entity.name, "filter_inserter");
      assert.equal(entity.direction, Blueprint.UP);
      assert.equal(entity.position.x, 0);
      assert.equal(entity.position.y, 0);
      assert.equal(entity.filters['0'], 'iron_ore');
      assert.equal(entity.filters['1'], 'copper_ore');
    });
  });

  describe('constant combiners', function () {
//    it('understands the control-behaviour section', function () {
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
    it('can enable/disable train stops', function () {
      const input = '0eNqdlsFu2zAMht+FZ7uIZCf1fOihxwK9DdihKAzFZhMCtmxIctAg8LtPtIcsWxKA7SUGJfHjT1KEcoJtO+LgyAYoT0B1bz2UbyfwtLOm5bVwHBBKoIAdJGBNx5Yz1MKUANkGP6FU03sCaAMFwsV/No6VHbstunjg7Bmiq0196IdIG3ofXXrLcSImVTqBY/zqiG7IYb1sbhKIwoLr22qLe3Og3rFHTa4eKVRxrzljPsj5UF3JP5ALY1w561hOpMYew57sjpPh5IPhSqzY6AbjTOBQ8DRv/wmH1mxbrBry/IUyuBET8GibKvTVnB+UH6b1cXW2Ks52wEau6idMix67lMCzj+Ifh81lfSlaenrn01H6UgN4/fXy8hwVX3VBn+N02NDYpdhGvqM6HfqYyXU/1g/rpSHqYS0XpC5Cs52xwBtysi/KUd9So/9Tk99Rk39RTfEtNfdqsf57BfjO7PYhnWfsxozkc9jVvyOibzA3cqaWMh/lzJWUWYiZhRT5Q4zcSJGcj5Ap7pBSYqa4Q0pLmeIGqUyKlKvMpUh5McUzJO+5eITEN1OJJ0g+QEo8QfcGPT7f8wNfXvwfSOCAzi8PcPGoVZFtVlk+Tb8BQcK+7A==';
      const bp = new Blueprint().load(input);
      const train_stop = bp.findEntity(new Victor(-12, -2));
      const decoded = util.decode[0](input);
      console.log("Entity: ", decoded.blueprint.entities[0]);
      console.log("Circuit Condition: ", decoded.blueprint.entities[0].control_behavior.circuit_condition);
      console.log("Circuit Enable/Disable: ", decoded.blueprint.entities[0].control_behavior.circuit_enable_disable);
      console.log("Train Stopped Signal: ", decoded.blueprint.entities[0].control_behavior.train_stopped_signal);
      console.log("Parsed Blueprint Condition: ", train_stop.condition);

      assert.equal(train_stop.name, "train_stop");
      assert.equal(train_stop.position.x, -12.5);
      assert.equal(train_stop.position.y, -2.5);
      assert.equal(train_stop.condition.controlEnable, true);
      assert.equal(train_stop.condition.left, 'signal_anything');
      assert.equal(train_stop.condition.operator, '>');
      // XXX assert.equal(train_stop.condition.constant, 0);
      // XXX assert.equal(train_stop.condition.modes['send_to_train'], 'false');
    });
//    it('can handle signals', function () {
//    });
//    it('can handle coloured lamps', function () {
//    });
//    it('can handle programmable speakers', function () {
//    });
    it('can read electric ore miners', function () {
      const input = '0eNrVVW1rwjAQ/ivjPqejSTt1/StDpC83PUhTSdIxkfz3JSkTdROjg7F9SXu95nm5Nnd7aOSIW03KQrUHagdloHrZg6G1qmV4ZndbhArIYg8MVN2HCCW2VlOb9aRIrbNOk5TgGJDq8B0q7thVDF3T8RbhlgxQWbKEk4YY7FZq7BvUHvMKO4PtYPzuQQVKj5iJxycGu+nGE3Wk/b6YLxl4q1YPctXgpn6jQYdNLel2JLtCVTcSVx2ZcIXqtZYG2SGtse78YoZRt0Gr1eNJdkpMr/VD5wFyFwnVxG8CFw+Lxu7YKvmocEvnQvnO7Itb7ef/0X15wX1xcN9jR2OfHYqwHbzGr9++/HTPo/tEen5EPck5jTm/oK+8UZ+4S544k1OcyxMX5D0d5Bnrz916Y7N4/L7WbRZl5ac/jPgGcpYMWaZCzpMhRSrkIhUyT0V8TkVM1sjzVMjkSvL7m6X4/CF/rz/wn3dHfnd7/Nt+p37oJ2OcndXRuGYg6wZlGKQe2Rt9iEaNT7yhNtHobDEXfFHM8qJ07gOJG7mk';
      const bp = new Blueprint().load(input);
      miner_1 = bp.findEntity(new Victor(-2, -2));

      assert.equal(miner_1.name, "electric_mining_drill");
      // TODO circuit_read_resources & circuit_resource_read_mode
    });
  });

  describe('connections', function () {
  });
});

// vi: sts=2 ts=2 sw=2 et
