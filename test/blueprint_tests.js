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

      assert.equal(wall1.name, "stone_wall");
      assert.equal(wall1.position.x, 0);
      assert.equal(wall1.position.y, 0);

      var wall2 = bp.findEntity(new Victor(5,5));
      assert.equal(wall2.name, "stone_wall");
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

      assert.equal(n.name, "transport_belt");
      assert.equal(n.direction, Blueprint.UP);
      assert.equal(n.position.x, 1);
      assert.equal(n.position.y, 0);
      assert.equal(e.name, "fast_transport_belt");
      assert.equal(e.direction, Blueprint.RIGHT);
      assert.equal(e.position.x, 2);
      assert.equal(e.position.y, 1);
      assert.equal(s.name, "transport_belt");
      assert.equal(s.direction, Blueprint.DOWN);
      assert.equal(s.position.x, 1);
      assert.equal(s.position.y, 2);
      assert.equal(w.name, "express_transport_belt");
      assert.equal(w.direction, Blueprint.LEFT);
      assert.equal(w.position.x, 0);
      assert.equal(w.position.y, 1);
    });
  });

  describe('recipes', function () {
    it('supports recipes in assemblers', function () {
      const input = '0eJx9UMuOwyAM/Jc5U2l75dbvWFUVpFZrCUwEpG0U8e9rQne1px499ry8wYeF5sxSYTfwlKTAfm8ofBMXOlbXmWDBlSIMxMU+uVIo+sByO0Q33VnocEQzYLnSC/bYzgYklSvT0PvEM5hT0dMk3a/TDdYuYnDlTNPYfJm/KDIvVVm64h0oNanQ04WgqFaQwVHnre1AzSlcPN3dg1Me6J5uvcgSPeV34r2j/fcSgwfl8msfnCd9CU6jhNJa+wG0Pm2x';
      var bp = new Blueprint().load(input);
      console.log(bp.toJSON());
      var assembler = bp.findEntity(new Victor(1,1));

      assert.equal(assembler.name, "assembling_machine_1");
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, 0);
      assert.equal(assembler.position.y, 0);
      assert.equal(assembler.recipe, 'stone_wall'); // XXX should be stone-wall?
    });
  });

  describe('modules', function () {
    it('supports modules in assemblers', function () {
      const input = '0eJx9kMFqxDAMRP9FZwe27c23/Y5SFjvR7gps2dhOtiHk3yvFbVko9KgZ63k0G/gwYy7EDewGNCauYN83qHRjF1Rra0awQA0jGGAXdXK1YvSB+DZEN96JcXiD3QDxhJ9gX/YPA8iNGmHn/bdnIKcqTxPrf7puYFWIgYkKjt05md8onOcmW2LRIdSWBPRwIYiqQauCakachpimOegvSs1FJuEt1NYn51XCXq/419AIUgn3DErtQispXDze3UKpdPW4dr3wHD2W7waOzuxTxQYWLPXnnOA8SsVw7qVgkQr3L2ZAiTQ=';
      var bp = new Blueprint().load(input);
      console.log(bp.toJSON());
      var assembler = bp.findEntity(new Victor(1,1));

      assert.equal(assembler.name, "assembling_machine_3");
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, 0);
      assert.equal(assembler.position.y, 0);
      assert.equal(assembler.recipe, 'stone_wall'); // XXX should be stone-wall?
      assert.equal(assembler.modules['speed_module_3'], 1);
      assert.equal(assembler.modules['effectivity_module_3'], 1);
      assert.equal(assembler.modules['productivity_module_3'], 2);
      //assert.equal(assembler.modules, {'speed_module_3': 1, 'productivity_module_3': 2, 'effectivity_module_3': 1}); // Should work out why this assertion does not pass.
    });
  });
  
  describe('filter inserters', function () {
    it('buffer chest', function () {

    });
    it('buffer chest', function () {

    });
  });

  describe('inventory filters', function () {
  });

  describe('logistic request filters', function () {
    it('storage chest ?', function () {

    });
    it('request chest', function () {

    });
    it('buffer chest', function () {

    });
  });

  describe('bars', function () {
    it('has a box with no bar', function () {

    });
    it('has a box with some bar', function () {

    });
    it('fails when trying to add a bigger bar than the box has inventory', function () {

    });
  });

  describe('circuit conditions', function () {
    it('can enable/disable train stops', function () {
      const input = '0eNqdlsFu2zAMht+FZ7uIZCf1fOihxwK9DdihKAzFZhMCtmxIctAg8LtPtIcsWxKA7SUGJfHjT1KEcoJtO+LgyAYoT0B1bz2UbyfwtLOm5bVwHBBKoIAdJGBNx5Yz1MKUANkGP6FU03sCaAMFwsV/No6VHbstunjg7Bmiq0196IdIG3ofXXrLcSImVTqBY/zqiG7IYb1sbhKIwoLr22qLe3Og3rFHTa4eKVRxrzljPsj5UF3JP5ALY1w561hOpMYew57sjpPh5IPhSqzY6AbjTOBQ8DRv/wmH1mxbrBry/IUyuBET8GibKvTVnB+UH6b1cXW2Ks52wEau6idMix67lMCzj+Ifh81lfSlaenrn01H6UgN4/fXy8hwVX3VBn+N02NDYpdhGvqM6HfqYyXU/1g/rpSHqYS0XpC5Cs52xwBtysi/KUd9So/9Tk99Rk39RTfEtNfdqsf57BfjO7PYhnWfsxozkc9jVvyOibzA3cqaWMh/lzJWUWYiZhRT5Q4zcSJGcj5Ap7pBSYqa4Q0pLmeIGqUyKlKvMpUh5McUzJO+5eITEN1OJJ0g+QEo8QfcGPT7f8wNfXvwfSOCAzi8PcPGoVZFtVlk+Tb8BQcK+7A==';
      var bp = new Blueprint().load(input);
      console.log(bp.toJSON());
      var train_stop = bp.findEntity(new Victor(-12, -2));

      assert.equal(train_stop.name, "train_stop");
      assert.equal(train_stop.position.x, -12.5);
      assert.equal(train_stop.position.y, -2.5);
      assert.equal(train_stop.condition.controlEnable, true);
      assert.equal(train_stop.condition.left, 'signal_anything');
      assert.equal(train_stop.condition.operator, '>');

    // TODO modes? some modes have more parameters?
    // assert.equal(train_stop.condition.modes['send_to_train'], 'false');
    });
    it('can handle signals', function () {

    });
    it('can handle coloured lamps', function () {

    });
    it('can handle programmable speakers', function () {

    });
    it('can read electric ore miners', function () {
      const input = '0eNrVVW1rwjAQ/ivjPqejSTt1/StDpC83PUhTSdIxkfz3JSkTdROjg7F9SXu95nm5Nnd7aOSIW03KQrUHagdloHrZg6G1qmV4ZndbhArIYg8MVN2HCCW2VlOb9aRIrbNOk5TgGJDq8B0q7thVDF3T8RbhlgxQWbKEk4YY7FZq7BvUHvMKO4PtYPzuQQVKj5iJxycGu+nGE3Wk/b6YLxl4q1YPctXgpn6jQYdNLel2JLtCVTcSVx2ZcIXqtZYG2SGtse78YoZRt0Gr1eNJdkpMr/VD5wFyFwnVxG8CFw+Lxu7YKvmocEvnQvnO7Itb7ef/0X15wX1xcN9jR2OfHYqwHbzGr9++/HTPo/tEen5EPck5jTm/oK+8UZ+4S544k1OcyxMX5D0d5Bnrz916Y7N4/L7WbRZl5ac/jPgGcpYMWaZCzpMhRSrkIhUyT0V8TkVM1sjzVMjkSvL7m6X4/CF/rz/wn3dHfnd7/Nt+p37oJ2OcndXRuGYg6wZlGKQe2Rt9iEaNT7yhNtHobDEXfFHM8qJ07gOJG7mk';
      var bp = new Blueprint().load(input);
      console.log(bp.toJSON());
      miner_1 = bp.findEntity(new Victor(-2, -2));
      console.log(miner_1);

      // TODO circuit_read_resources & circuit_resource_read_mode
    });


  });

  describe('connections', function () {
  });
});

// vi: sts=2 ts=2 sw=2 et
