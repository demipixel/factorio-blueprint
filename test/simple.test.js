const Blueprint = require('../src');


describe('load simple blueprint', function () {
  it('load simple blueprint', () => {
    const bpString = require('./simple-bp.json');
    const bp = new Blueprint(bpString);

    bp.fixCenter();
    bp.encode();
  });
});

// vi: sts=2 ts=2 sw=2 et
