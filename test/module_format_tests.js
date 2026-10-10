const assert = require('assert');
const Blueprint = require('..');

/*
 *
 * The package can be loaded with require or with import. Both have to be
 * the same library, or what one is told the other does not know.
 *
 */

describe('Module formats', () => {
  it('import gives the same class as require', async () => {
    const imported = (await import('factorio-blueprint')).default;

    assert.strictEqual(imported, Blueprint);
  });

  it('entity data set through import is known through require', async () => {
    const imported = (await import('factorio-blueprint')).default;
    imported.setEntityData({
      module_format_test: { type: 'item', width: 2, height: 2 },
    });
    const bp = new Blueprint();
    const entity = bp.createEntity('module_format_test', { x: 0, y: 0 });

    assert.equal(entity.size.x, 2);
  });
});
