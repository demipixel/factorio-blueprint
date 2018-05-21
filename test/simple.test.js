const Blueprint = require('../src');

test('load simple blueprint', () => {
  const bpString = require('./simple-bp.json');
  const bp = new Blueprint(bpString);

  bp.fixCenter();
  bp.encode();
});
