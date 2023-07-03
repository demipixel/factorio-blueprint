const assert = require('assert');
const Blueprint = require('../dist/factorio-blueprint.min.js');
const util = require('./util');
const Victor = require('victor');

/*
 *
 * Parsing tests that are aimed at end-to-end tests.
 *
 * Format should be a simple blueprint from in-game that demonstrates
 * features. Then various assertions based on that.
 *
 */

describe('Blueprint Parsing', () => {
  describe('metadata', () => {
    const input =
      '0eNp9j90OgjAMhd+l18Pg/EH2DL6BMWZANU2gW7ZiJIR3d4Mbr7w7bb6eczpD04/oA7GAmaHD2AbyQo7BAPk4DqCAWscRzG2GSC+2fSZl8pgRwUywHfL0tFEKCZajd0GKBnuBJd1zhx8w++WuAFlICDe7dZgePA4NhgT8NVLgXaSt2gzJr9DlsdydFExZ11XSKayjgO1GnXPg2tD8vKmgt8kw7a4urO3fGOJ6oC/7Y1Xr6lzr8nLQy/IFJUNeXw==';
    let bp = new Blueprint(input);

    it('supports a label', () => {
      assert.equal(bp.name, 'Lorem');
    });
    it('supports a description', () => {
      assert.equal(bp.description, 'ipsum');
    });

  });

  describe('simple, small', () => {
    it('2x walls centered on one of them', () => {
      const input =
        '0eNqNj8EKgzAQRP9lzhGqFiv5lVKKtktZiBsx0TZI/r2JXgrtoadllpm3syt6M9M4sXjoFXyz4qDPKxw/pDN558NI0GBPAxSkG7Jy3goVz84YRAWWO72gy3hRIPHsmXbKJsJV5qGnKRl+5RVG61LESr6WMEWyhTxiVF+I6i/ETkiAVGgrrj/+VFhocpu5aU9V2dbNoT7G+AaeUViT';
      var bp = new Blueprint(input);
      var wall1 = bp.findEntity(new Victor(-1, -1));

      assert.equal(wall1.name, 'stone_wall');
      assert.equal(wall1.position.x, -1);
      assert.equal(wall1.position.y, -1);

      var wall2 = bp.findEntity(new Victor(1, 1));
      assert.equal(wall2.name, 'stone_wall');
      assert.equal(wall2.position.x, 1);
      assert.equal(wall2.position.y, 1);
    });
  });

  describe('directions', () => {
    it('supports belts going in all directions', () => {
      const input =
        '0eNqV0dFqwzAMBdB/uc82xEnoin9ljJG02jAkirHV0hD874sTGO2atuzRNjq6sia03Yl8cCywE9xh4Aj7PiG6b266fCejJ1g4oR4K3PT5JKHh6IcguqVOkBQcH+kCa5J6WfzVRNEPhTJ9KBCLE0drluUwfvKpbynMLR6lUPBDnMsGzq1nqlAYYbVJOdQfpfxV6OIDxahfadosXDFHPbpAh/Vpt2FXT0e9gzfdcsOt/zm5uSXr/LPLKuzV2hXOFOI6y/6tNPtqV1R1Sj8D1bWS';
      var bp = new Blueprint(input);
      var n = bp.findEntity(new Victor(0, -1));
      var e = bp.findEntity(new Victor(1, 0));
      var s = bp.findEntity(new Victor(0, 1));
      var w = bp.findEntity(new Victor(-1, 0));

      assert.equal(n.name, 'transport_belt');
      assert.equal(n.direction, Blueprint.UP);
      assert.equal(n.position.x, 0);
      assert.equal(n.position.y, -1);
      assert.equal(e.name, 'fast_transport_belt');
      assert.equal(e.direction, Blueprint.RIGHT);
      assert.equal(e.position.x, 1);
      assert.equal(e.position.y, 0);
      assert.equal(s.name, 'transport_belt');
      assert.equal(s.direction, Blueprint.DOWN);
      assert.equal(s.position.x, 0);
      assert.equal(s.position.y, 1);
      assert.equal(w.name, 'express_transport_belt');
      assert.equal(w.direction, Blueprint.LEFT);
      assert.equal(w.position.x, -1);
      assert.equal(w.position.y, 0);
    });
  });

  describe('recipes', () => {
    it('supports recipes in assemblers', () => {
      const input =
        '0eNp9j8EKwjAQRP9lzim0KrXkV0QkrUtdSDalSdVS+u8m8eLJy8Iss29mN/R2oWlmidAbePASoC8bAo9ibN7FdSJocCQHBTEuKxMCud6yjJUzw4OFqga7Asud3tDNflUgiRyZvrwi1pssrqc5Gf6TFCYf0rGX3CABa4U1zZQw08ClUIg+eV/GWuS00k//vKPwpDkURNudD013bOvjad8/hm1RIQ==';
      var bp = new Blueprint(input);
      var assembler = bp.findEntity(new Victor(0, 0));

      assert.equal(assembler.name, 'assembling_machine_1');
      assert.equal(assembler.direction, Blueprint.UP);
      assert.equal(assembler.position.x, -1);
      assert.equal(assembler.position.y, -1);
      assert.equal(assembler.recipe, 'stone_wall');
    });
  });

  describe('modules', () => {
    it('supports modules in assemblers', () => {
      const input =
        '0eNp9kNFqwzAMRf9Fzw60zeiKf2WMkTg3rZgtG9spC8H/Pjt96Rj0xXCtq6sjbTTaBSGyZNIbsfGSSH9slPgqg21/eQ0gTZzhSJEMrqkhJbjRslw7N5gbC7qeiiKWCT+kj+VTESRzZjzydrF+yeJGxGp4naQo+FSbvTSCGnhQtNa3TogwvANFb76Ru3mBrf6Gl5o5BWDqnJ8W25LaJMwzTOZ7BfhbCLGq/5VTafj7wvrpPoruiGlnOl/eT8dLfz70b6X8AvmFbMw=';
      var bp = new Blueprint(input);
      var assembler = bp.findEntity(new Victor(0, 0));

      assert.equal(assembler.name, 'assembling_machine_3');
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

  describe('filter inserters', () => {
    it('stack filter inserters have only one filter', () => {
      const input =
        '0eNqFj9EKgzAMRf/lPlfQOZz0V4YMddkI01TaOibSf1+rbOxtLyE35J7crOiGmSbL4qFXcG/EQZ9XOL5LO6SZXyaCBnsaoSDtmJTzbf/Ibjx4shmLIxsbBAWWK72gi9AokHj2TDtwE8tF5rGLm7r4g1KYjItuIylDJOYKS6zxxL66Uz/nvjS2RjJjCaFJEbbU+udJhWf0btiqPh2Kuqzy8hjCG3KaWUM=';
      var bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(0, 0));

      assert.equal(entity.name, 'stack_filter_inserter');
      assert.equal(entity.direction, Blueprint.UP);
      assert.equal(entity.position.x, 0);
      assert.equal(entity.position.y, 0);
      assert.equal(entity.filters['0'], 'iron_ore');
    });
    it('have multiple filters', () => {
      const input =
        '0eNp1j90KgzAMhd8l1x34M5z0VYYMddkIaFraOibSd19amexmNyHJSb6TbDBMC1pHHEBvQKNhD/q6gacn91PqhdUiaKCAMyjgfk7Vg6aA7kTs0UkCUQHxHd+gy9gpQA4UCHdULtYbL/Mgk7r8C1FgjZc9w8lXWIWCVaLA99Gd9zU6OOQMn4xDueJQq0MdjbXikvUuHZc/0T+PK3gJO9s27aUq27op6nOMH0+tXzQ=';
      var bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(0, 0));

      assert.equal(entity.name, 'filter_inserter');
      assert.equal(entity.direction, Blueprint.UP);
      assert.equal(entity.position.x, 0);
      assert.equal(entity.position.y, 0);
      assert.equal(entity.filters['0'], 'iron_ore');
      assert.equal(entity.filters['1'], 'copper_ore');
    });
  });

  describe('inventory filters', () => {
    // What sort of entity has inventory filters?
  });

  describe('logistic filters', () => {
    it('knows about requester chests', () => {
      const input =
        '0eNqFkN1uwjAMhd/F14nUlomhvMqEUEhNsdQ6XX5gVdV3x2kH7G5Xlq1zvmN7hnOfcQzECcwM5DxHMF8zROrY9mWWphHBACUcQAHboXS97ygmctpdMSYd8DtLxQCLAuIWf8DUy1EBcqJEuDHXZjpxHs6iNPX/NAWjjwLwXDYRqBbTBKaSmF/V6UK9SLeEZ/SLbNubZYetdhRcpiRE53M5tqkE8nY0L0uwd333vn1La5EeyzXrD8yflym4SfS63v7w2dSH3b7afSzLA3pZc0M=';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-1, 0));

      assert.equal(entity.name, 'logistic_chest_requester');
      assert.equal(entity.requestFilters['0'].name, 'advanced_circuit');
      assert.equal(entity.requestFilters['0'].count, 200);
      assert.equal(entity.requestFilters['11'].name, 'raw_wood');
      assert.equal(entity.requestFilters['11'].count, 100);
    });
    it('knows about storage chests', () => {
      const input =
        '0eNqFjsEKgzAQRP9lzhG0LVbyK6UUtYtd0I0ka1Ek/16TXnrrcYaZx9vRjQvNnkVhd3DvJMDedgQepB1Tp9tMsGClCQbSTimNbuCg3Bf9i4IWQZ1vB0I0YHnSClvFuwGJsjJ9iTlsD1mmjvwx+McymF047k6SxZofG2wZEznb2B95gzf5kMd1cz1Vzbkuz5cYP3muTDQ=';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(1, 0));
      assert.equal(entity.name, 'logistic_chest_storage');
    });
    it('knows about storage chests with filters', () => {
      const input =
        '0eNqFj8EKgzAQRP9lzxG0Fiv5lSKidmsXdGOTtSiSf2+itPTW4yw7b2Y2aIcZJ0ssoDegzrADfd3AUc/NEG+yTggaSHAEBdyMUQ2mJyfUJd0DnSROjG16BK+A+IYL6MxXCpCFhPAg7mKteR5btOHhH0vBZFywG44tlt2xgk5DhsXnHF7rOw2C9sB/cr9YsoYTYyOoM3Pcl/oqttqX6J/hCl6BsgcV5eWUlXmR5mfv3w0JYHM=';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(1, 0));
      assert.equal(entity.name, 'logistic_chest_storage');
      assert.equal(entity.requestFilters['0'].name, 'iron_ore');
      assert.equal(entity.requestFilters['0'].count, 0);
    });
  });
  it('knows about buffer chests', () => {
    const input =
      '0eNqFkNsKgzAMht8l1xU8jE36KkNEXdwCtXU2HYr47ksdO9ztMuX7v+TvCq0JOE5kGfQK1DnrQZ9X8HS1jYlvvIwIGohxAAW2GeJk3JU8U5d0N/SctKHvcYJNAdkLzqCzrVKAlokJX8J9WGobhlZInf1RKRidl7Sz8YZ5DyygU1kx4T0IWfdkGKeX/b32Y/WMaJLRNIzi6lyIBbNU8l84/9Btw6JavmQuZBU77LX1zy8peMjS/a5jecqzsjimxWHbnvgJbh8=';
    const bp = new Blueprint(input);

    const entity = bp.findEntity(new Victor(1, 0));

    assert.equal(entity.name, 'logistic_chest_buffer');
    assert.equal(entity.requestFilters['0'].name, 'steel_plate');
    assert.equal(entity.requestFilters['0'].count, 100);
    assert.equal(entity.requestFilters['11'].name, 'battery');
    assert.equal(entity.requestFilters['11'].count, 200);
  });

  describe('bars', () => {
    it('has a box with no bar', () => {
      const input =
        '0eNptjsEKgzAQRP9lzhG0Fiv5lVKK2qVdiKuYVSoh/97EXnrocZY3bzagdyvNC4vCBvAwiYe9Bnh+SufyTfeZYMFKIwykG3PySuSK4UVeEQ1YHvSGreLNgERZmb6aI+x3WceelgT8FRjMk0+dSfJe8hSJ22HLmH3HsP3502CjxR90015OVVs3ZX2O8QPQS0Ob';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-1, 0));

      assert.equal(entity.name, 'steel_chest');
      assert.equal(entity.bar, -1);
    });
    it('has a box with some bar', () => {
      const input =
        '0eNptjt0KwjAMhd/lXFfYH3P0VURkm0EDXTbWTByj725bb7zwJnBCvi/nwOA2WlYWhT3A4ywe9nLA80N6l3a6LwQLVppgIP2Uklcidxqf5BXBgOVOb9gyXA1IlJXpq8lhv8k2DbTGg78Cg2X2kZkl/YuewmCPM4qHPlJVk7y5gP3pa/Ci1Weq7c5V2dVtUTchfADkJ0Wy';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(0, 0));

      assert.equal(entity.name, 'steel_chest');
      assert.equal(entity.bar, 24);
    });
  });

  describe('arithmetic combinators', () => {
    it('describes multiplication', () => {
      const input =
        '0eNqVktFqwzAMRf9Fj8MZbbJ1Ja/9jDGCk2itILaDLZeV4H+fnEBX1nXdXgyypavjK03QDhFHT5ahnoA6ZwPUrxME2ls95Ds+jQg1EKMBBVabHGlPfDDI1BWdMy1Zzc5DUkC2xw+o1+lNAVomJlwE5+DU2Gha9JJwljLYUzQFDtixF73RDSiNRhek2NmMIILFRsEp6yoQRiu5NKNOsM6Hx/6yC0lUSSb5LhLPoRCllNQVSPlPkOdfOfYe0d4hKW+QVHfcvfZk9bjQlELTk19g5i8JG3s3NC0e9JGkWCq+VBt57ulM/k4+cHNn4i3tv1kjTQNmpSwXWOcVkrG6Eb1eQOBB6l3kMf4gfyTPUW7OHZaMYgfZnb9OOY9VQXnT+8VsWcb5N/XFuis4og8z52b7Uq631WZVPaX0CRchDRw=';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-0.5, 2));

      assert.equal(entity.name, 'arithmetic_combinator');
      assert.equal(entity.condition.left, 'big_electric_pole');
      assert.equal(entity.condition.out, 'signal_C');
      assert.equal(entity.condition.operator, '*');
    });
    it('describes modulo', () => {
      const input =
        '0eNqVklFqwzAMhu8i2Jsz2mTrSu7QE4wRnERrBbEdbLmsBN99cgJdWdd1ezHIln59/qUJ2iHi6Mky1BNQ52yA+nWCQHurh3zHpxGhBmI0oMBqkyPtiQ8Gmbqic6Ylq9l5SArI9vgB9Tq9KUDLxISL4BycGhtNi14SzlIGe4qmwAE79qI3ugGl0eiCFDubEUSw2Cg4ZV0Fwmgll2bUCdb58NhfdiGJKskk30XiORSilJK6Ain/CfL8K8feI9o7JOUNkuqOu9eerB4XmlJoevILzPwlYWPvhqbFgz6SFEvFl2ojzz2dyd/JB27uTLyl/TdrpGnArJTlAuu8QjJWN6LXCwg8SL2LPMYf5I/kOcrNucOSUewgu/PXKeexKihver+YLcs4/6a+WHcFR/Rh5txsX8r1ttqsqqeUPgEYnQ0h';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-0.5, 2));

      assert.equal(entity.name, 'arithmetic_combinator');
      assert.equal(entity.condition.left, 'big_electric_pole');
      assert.equal(entity.condition.out, 'signal_M');
      assert.equal(entity.condition.operator, '%');
    });
  });

  describe('arithmetic combinators', () => {
    it('uses "each"', () => {
      const input =
        '0eNqVkttqwzAMht9F185ok7bbcrEXGSM4idoK4gOKUxaC331yMkJpt7LdGHT8P0uaoO4G9Ew2QDkBNc72UL5P0NPJ6i75wugRSqCABhRYbZLVYkMtctY4U5PVwTFEBWRb/IRyGz8UoA0UCJduszFWdjA1siSsfQy2NJgMO2wCU5N516GoeNdLsbNJXxpmBwVj6qtAAK3k0sw5wTY9jO21ComVSyZxM1CYTSGKMao7kPzRh+4xNk/7FaQlXjgWMWcDu66q8awvJMVS8d2yklhLK/GRuA/V3XgvxGEQzwq0ZGSomzMs/+6DTlvavSbLeM0zZQlvkBx+FKHBhurIzlRk/SC5R931GP8+tjQnBXmKnhjR3saLX+ZY/HOh+4f7/FH6ZqP5TCJ3Nt9leXXGCi7I/ax1eHnOty/FYVPsYvwCygX/SA==';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-0.5, 1));

      assert.equal(entity.name, 'decider_combinator');
      assert.equal(entity.condition.left, 'signal_each');
      assert.equal(entity.condition.right, 49);
      assert.equal(entity.condition.operator, '>');
    });
  });

  describe('constant combinators', () => {
    it('basic setup', () => {
      const input =
        '0eNqNkdFqwzAMRf9Fzw7UyehCfmWU4jjaJrDl4DihIfjfJ7tQCoXRFxuZq3t15ANGt+IciRMMB5ANvMDwdcBCP2xceUv7jDAAJfSggI0vVdElw6mxwY/EJoUIWQHxhDcYdL4oQE6UCO92tdivvPoRowj+NVIwh0V6A5d88Ws6BbtcWiKkIcXgriP+mo1ELZJvcgnjW4ObaTNscWosRbtSgmq5Fvz+9ADo8+UexWjLHEvx0+WIOD0DkVStiHNWL5DtI9TjRKtv0IlbJNvMweErZVsh9fvBugbLqivi8PSVCjbZR7U+95+t7rvzqfvI+Q/5g6g5';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-3, -1));

      assert.equal(entity.name, 'constant_combinator');
      assert.equal(entity.constants['7'].name, 'advanced_circuit');
      assert.equal(entity.constants['7'].count, 80);
      // XXX should assert on {entity}.control_behaviour.is_on == true / undefined.
    });
    it('with "output off" set', () => {
      const input =
        '0eNqNkeGKwyAQhN9lfxuoydELeZWjFGO2dwu6BjXhQvDdz02hFApH/ygr48x8usPoFpwjcYZhB7KBEwxfOyT6ZuPkLG8zwgCU0YMCNl4m0WXDubHBj8QmhwhFAfGEvzDoclGAnCkT3u2OYbvy4keMVfCvkYI5pHo3sORXv6ZVsNVN14h6IcfgriP+mJWqukpu5DLGt4qbaTVscWosRbtQhsNyEfz+9ADoBYDSVRrcjEt4D2a00iqJu5Yl4vSMR3Vqy6WUol6Q20cFjxMtvkFX3SLZZg4OX5m7A1m/H6yPYOktwMPTxypY6+sc1uf+s9V9dz51H6X8AWGKrQY=';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(-2, -1));

      assert.equal(entity.name, 'constant_combinator');
      assert.equal(entity.constants['7'].name, 'advanced_circuit');
      assert.equal(entity.constants['7'].count, 80);
      // XXX should assert on {entity}.control_behaviour.is_on == false.
    });
  });

  describe('power switches', () => {
    it('simple example', () => {
      const input =
        '0eNqVUkFugzAQ/MueTWUgoRGHXvKMKEJgts1KYCPbhCLE37uGKEobpLYX5LFnZzxjJqiaHjtL2kM+ASmjHeSnCRx96LIJe37sEHIgjy0I0GUbUGcGtJEbyKsLzAJI1/gJeTyfBaD25AlXnQWMhe7bCi0TthUEQ8dDRgdHForky17AuC5Yn+/lrWmKCi/llYwNNEVW9eQLPqvvs+9knS9+uT02qFhOk4puIrB6OF+GInYyoLYrbemDF7zBvBI0D9LS0QRx+FisH3MSo2Q+M/nYy6cDAQNZXNYyNHXs45+c9DuHbZ86TO45Wqypb6M1DofpTIMbXWZLk/LvCeJgvOGc/tN5fzMOWZcXyB9+NwFXtG4hZ4fXJD6kmUx38/wFX4PeRw==';
      const bp = new Blueprint(input);

      const entity = bp.findEntity(new Victor(0, 0));

      assert.equal(entity.name, 'power_switch');
      assert.equal(entity.condition.left, 'electronic_circuit');
      assert.equal(entity.condition.right, 40);
      assert.equal(entity.condition.operator, '>');
      // XXX should assert on {entity}.connections.Cu0/Cu1
    });
  });

  describe('circuit conditions', () => {
    it('can enable/disable train stops', () => {
      const input =
        '0eNqdlsFu2zAMht+FZ7uIZCf1fOihxwK9DdihKAzFZhMCtmxIctAg8LtPtIcsWxKA7SUGJfHjT1KEcoJtO+LgyAYoT0B1bz2UbyfwtLOm5bVwHBBKoIAdJGBNx5Yz1MKUANkGP6FU03sCaAMFwsV/No6VHbstunjg7Bmiq0196IdIG3ofXXrLcSImVTqBY/zqiG7IYb1sbhKIwoLr22qLe3Og3rFHTa4eKVRxrzljPsj5UF3JP5ALY1w561hOpMYew57sjpPh5IPhSqzY6AbjTOBQ8DRv/wmH1mxbrBry/IUyuBET8GibKvTVnB+UH6b1cXW2Ks52wEau6idMix67lMCzj+Ifh81lfSlaenrn01H6UgN4/fXy8hwVX3VBn+N02NDYpdhGvqM6HfqYyXU/1g/rpSHqYS0XpC5Cs52xwBtysi/KUd9So/9Tk99Rk39RTfEtNfdqsf57BfjO7PYhnWfsxozkc9jVvyOibzA3cqaWMh/lzJWUWYiZhRT5Q4zcSJGcj5Ap7pBSYqa4Q0pLmeIGqUyKlKvMpUh5McUzJO+5eITEN1OJJ0g+QEo8QfcGPT7f8wNfXvwfSOCAzi8PcPGoVZFtVlk+Tb8BQcK+7A==';
      const bp = new Blueprint(input);
      const train_stop = bp.findEntity(new Victor(-12, -2));

      assert.equal(train_stop.name, 'train_stop');
      assert.equal(train_stop.position.x, -12.5);
      assert.equal(train_stop.position.y, -2.5);
      assert.equal(train_stop.condition.controlEnable, true);
      assert.equal(train_stop.condition.left, 'signal_anything');
      assert.equal(train_stop.condition.operator, '>');
      // XXX assert.equal(train_stop.condition.constant, 0);
      // XXX assert.equal(train_stop.condition.modes['send_to_train'], 'false');
    });
    //    it('can handle signals', () => {
    //    });
    //    it('can handle coloured lamps', () => {
    //    });
    //    it('can handle programmable speakers', () => {
    //    });
    it('can read electric ore miners', () => {
      const input =
        '0eNrVVW1rwjAQ/ivjPqejSTt1/StDpC83PUhTSdIxkfz3JSkTdROjg7F9SXu95nm5Nnd7aOSIW03KQrUHagdloHrZg6G1qmV4ZndbhArIYg8MVN2HCCW2VlOb9aRIrbNOk5TgGJDq8B0q7thVDF3T8RbhlgxQWbKEk4YY7FZq7BvUHvMKO4PtYPzuQQVKj5iJxycGu+nGE3Wk/b6YLxl4q1YPctXgpn6jQYdNLel2JLtCVTcSVx2ZcIXqtZYG2SGtse78YoZRt0Gr1eNJdkpMr/VD5wFyFwnVxG8CFw+Lxu7YKvmocEvnQvnO7Itb7ef/0X15wX1xcN9jR2OfHYqwHbzGr9++/HTPo/tEen5EPck5jTm/oK+8UZ+4S544k1OcyxMX5D0d5Bnrz916Y7N4/L7WbRZl5ac/jPgGcpYMWaZCzpMhRSrkIhUyT0V8TkVM1sjzVMjkSvL7m6X4/CF/rz/wn3dHfnd7/Nt+p37oJ2OcndXRuGYg6wZlGKQe2Rt9iEaNT7yhNtHobDEXfFHM8qJ07gOJG7mk';
      const bp = new Blueprint(input);
      miner_1 = bp.findEntity(new Victor(-2, -2));

      assert.equal(miner_1.name, 'electric_mining_drill');
      // TODO circuit_read_resources & circuit_resource_read_mode
    });
  });

  describe('connections', () => { });

  describe('splitters', () => {
    function asserts(
      bp,
      inputPriority = undefined,
      outputPriority = undefined,
      filter = undefined,
    ) {
      assert.equal(bp.entities[0].inputPriority, inputPriority);
      assert.equal(bp.entities[0].outputPriority, outputPriority);
      assert.equal(bp.entities[0].splitterFilter, filter);
    }

    it('normal splitter', () => {
      const input =
        '0eNp1jsEKgzAQRP9lzrGYSpXur5RStF3Kgq4hiaJI/r3GXnrpcYaZN7Oh6yd2XjSCNshz1AC6bQjy1rbPXlwdgyCRBxhoO2TFi/McQhFcLzGyRzIQffECsuluwBolCn9Zh1gfOg3dniT7n2LgxrAXR83LO6woTxeDFVSmjD1O0M9ng5l9OPJNVdprfbZVU6f0AanySJQ=';
      const bp = new Blueprint(input);
      asserts(bp);
    });

    it('input priority right', () => {
      const input =
        '0eNp1j8EKgzAQRP9lzrFopUrzK6WItotd0BiStSiSf2+SXnrpcZadNzMHhmkl69gI9AF+LMZD3w54Hk0/pZvslqDBQjMUTD8nRZt15H3h7cQi5BAU2Dxpg67CXYGMsDB9WVnsnVnnIX7q6j9FwS4+GheTkiOsKE8XhR26zAF2lS6WXVzkRb/j8SVIebmd/hmj8CbnM6ity+ranKu6bUL4AG+1UbE=';
      const bp = new Blueprint(input);
      asserts(bp, 'right');
    });

    it('output priority left', () => {
      const input =
        '0eNp1j0EKwjAQRe/y11Eaiy3mKiKl1VECaRKSibSU3N2kbty4/MPMe382TCaRD9oy1AZ9dzZCXTdE/bKjqTNePUFBM80QsONcEy0+UIyH6I1mpoAsoO2DFiiZbwJkWbOmL2sP62DTPJVNJf9TBLyL5dDZai6wQ3M8C6xQTRG4xD7xUNq6UIAFYOjJqL69nfp5RuBNIe6gvm3kpTvJtu9y/gB0cFG/';
      const bp = new Blueprint(input);
      asserts(bp, undefined, 'left');
    });

    it('filter green circuit', () => {
      const input =
        '0eNp1j8EKwjAQRP9lzqm0ihXzKyLSxlUW0m1ItmIp/XeTevHicZaZNzsLej9RiCwKu4DdKAn2siDxUzpfbjoHggUrDTCQbiiK3iFSSlUKnlUpYjVgudMbtlmvBiTKyvRlbWK+yTT02Wmb/xSDMKYcHKU0Z1hV744GM2ydCx7siynnPDmNo7CrHEc3saKUbi/an0UGL4ppo50OdXNu983h1K7rBwT3U1A=';
      const bp = new Blueprint(input);
      asserts(bp, undefined, undefined, 'electronic_circuit');
    });

    it('input priority left, output priority right, filter green circuit', () => {
      const input =
        '0eNp1UNtqwzAM/Zfz7IxkZS3zr4xRWk/tBI5sbHk0hPz75OxlDPZ4pHPR0YprbJQLi8Kv4JCkwr+tqHyXS+wzXTLBg5VmOMhl7ogeuVCtQ82RValgc2D5oAf8tL07kCgr04/XDpaztPlqTD/97+KQUzVhkp5sZsP49OKwwI8WcOPYSaaLFLQk4TAELqGxmjI1zU3P1iUVizNa4ftn37D8WUS6KfqZeyn/6wcOX1Tqnn86jNPr8Xk6nI7b9g2VX2WY';
      const bp = new Blueprint(input);
      asserts(bp, 'left', 'right', 'electronic_circuit');
    });
  });

  describe('train station', () => {
    it('should have station name and control behavior', () => {
      const input =
        '0eNqNUs1ugzAMfpXKZ6gKW0fHbZsqbc8wVSiA11mCBDmmWoXy7ktCVbXrDr2A/MXfT2JPUHcjDkxaoJyAGqMtlJ8TWNpr1QVMjgNCCSTYQwJa9aESVqRTK2YAlwDpFn+gzNwuAdRCQjirxOJY6bGvkX3Dmd9jS2OfYoeNMDXpYDr06oOxnmx08PWCxXKdwBHKtFgt197Hp9OeQDHkBFn4MLaXVuSr3O2cc8mNff5f/BvTLDt5ZrOjsOmqGr/VgQyHnoa4GUkq1KrusGrJhj+UwiMmPo9qqy82fRVNruBgOGB7fRKL89HNux+IZfTIOfvckb6Gh7cos5itOupJrjRP2P2SL0EyBj3xGzPqv5oRu1/zDdz9g8vC4PytRM3zgA9tkWWxVVaQF9v9fvGOjBD2LO5jebG+CRyQbeTlm+yxeM6Lp+d8tXnInfsFuMkA7g==';
      const bp = new Blueprint(input);
      const trainStop = bp.entities.find((ent) => ent.name === 'train_stop');
      assert.equal(trainStop.stationName, 'Insert Easter Egg Here');
      assert.deepEqual(trainStop.trainControlBehavior, {
        circuit_enable_disable: true,
        read_from_train: true,
        read_stopped_train: true,
        train_stopped_signal: { type: 'virtual', name: 'signal-B' },
        set_trains_limit: true,
        trains_limit_signal: { type: 'virtual', name: 'signal-A' },
        read_trains_count: true,
        trains_count_signal: { type: 'virtual', name: 'signal-C' },
      });
    });

    it('should have manual trains limit', () => {
      const input =
        '0eNqNkt1OxCAQhd9lrtnE1p/ucqc+hjGEtqNOUqCBobFp+u4C3Wzs6sVekTmc+ebws0A7RBw9WQa5AHXOBpBvCwT6tHrIGs8jggRiNCDAapMr9prsIbAbYRVAtsdvkNX6LgAtExNulFLMykbTok+G//oFjC6kFmfztIxJthnkoakSOgVi7wbV4peeyPns6ch3kVih1e2AqqeQV5DsIwrwqHv14Z1RZchOzgNH7Pc7pbhs/Tn4RJ5jUi7ZN8fhJZ88IG+woAYyxDvmWbsd+ZyRJei5v3PRXjOLdjvzFdack/V2w5AMRtvkvMpdPdb5+cozy1+/QsCEPpTe+lg9NKe6eTrVd8f7el1/AHgPyCM=';
      const bp = new Blueprint(input);
      assert.equal(bp.entities[0].manualTrainsLimit, 152);
    });
  });

  describe('snapping', () => {
    it('should preserve snapping grid size', () => {
      // a simple loop of fast belts in a 3x3 space with relative snapping
      const input = '0eNqd001rhDAQBuC/InOOi8bP9bY999ZjKSXq7BLQJCTZUhH/e0e9bFsp1YuSZPLwZjQj1N0djZXKQzVCi66x0nipFVRwCWj+FuhrUGPnHTBwSpjQ6/BmZTvXf0KVMBjoOTGQjVYOqtcRnLwp0c0FfjBIkvTY03Yl+nl0Fc6H3grljLY+nHGY96sWCYynNwaovPQSV24ZDO/q3tdoqeBPiIHRTq4nWAJGp2yJGJ+yaWK/NH5MozdFbqXFZl3lG3ayz+YPSb/Z6YadHrOj/9jZPjve05P8WL/59tcrjiXlP5PmG3Z5rMMbNv3Qyw2oHm4bg04QRHMvsjcdBk+kBs9aG1r6QOvWDpZxWpx5kZ95VCZ8mr4AU8k4pA==';
      const bp = new Blueprint(input);
      assert.equal(bp.snapping.grid.x, 3);
      assert.equal(bp.snapping.grid.y, 3);

    });
    it('should preserve absolute snapping', () => {
      // same as above, but with absolute snapping
      const input = '0eNqdk8FugzAMhl8F+RwqSCm03Lrz3mCapgBuFQmSKDHTKsS7z8AO3YamlUsix/bnP048QNX26Lw2BOUADYbaa0faGijhHPH5NbKXqMKWAggIRrmYbHz1upniP6DcC7jxOgpQVbBtTxhPUY4zoSTfowBdWxOgfBkg6KtR7ZRJN4dcQhN2zDWqm6yLChSTVyY46ymeqgKDtWmQK6XjqwA0pEnjgpuN25vpuwo9B/wJEuBs0MvVZuXJ7jBrT3eHcRS/aHIbjXeW3GiP9eKVK+z9Y2x5p/QbO1thZ9vYyX/Yh8fY6SM9ybf1W66/XrFNqfypNF9hH7d1eIXNH3qegPJuDAW0ikHT/H0NVPTE3OjZWsfOd/Rh6eExzYqTLPKTTI57OY6fhfJCzw==';
      const bp = new Blueprint(input);
      assert.strictEqual(bp.snapping.absolute, true);
    });

  });
  it('should preserve absolute offset', () => {
    // as above, but offst from the absolute grid by 1, 1
    const input =
      '0eNqd091qgzAUB/BXkXMdS02/veuu9wZjjFhPS0CTkBzLRHz3nWhhXSdj9UbJ1y9/jp4OiqpB57UhyDsoMZy8dqStgRyOCc9fEntOCqwogIBglEvJphevy7j/E/KVgJafvQBVBFs1hGnc5fgk5OQbFOBs0JFMPVaK9BUfiGwgMib0yZoA+VsHQV+MquIGah1yGE1YcwKj6jg6q0ApeWWCs57SmA/ieVNiBPt3AWiIb8WRGwbth2nqAv1w4x/Qd+JbwOViM0ZcbPpe/NLkPI3fHLnUHk/jqpywV8/Z8i7pD3s9Ya/n2cv/2Jvn7OyZmmzn1VtOf73dvKTyMel2wt7Pq/CEzT/00AH5XcMKqBRDsVNvrZe8sJu8Wut48Yo+jDXcZ+vdQe62B7ncr2TffwEVn1DN';
    const bp = new Blueprint(input);
    assert.equal(bp.snapping.position.x, 1);
    assert.equal(bp.snapping.position.y, 1);
  });
});

// vi: sts=2 ts=2 sw=2 et
