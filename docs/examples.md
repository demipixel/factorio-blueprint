# Examples

## factorio-generators and Autotorio

A fantastic example is [factorio-generators](https://github.com/demipixel/factorio-generators), a tool which is used to create ore outposts, oil outposts, and modify blueprints (such as replacing entities or flipping the blueprint entirely). [Autotorio](http://autotorio.com/outpost) uses factorio-generators to provide these tools to users.

## Basic Train Station

```js
const Blueprint = require('factorio-blueprint');

const bp = new Blueprint();

// Rails are size 2, therefore we only need them every other tile
for (let i = 0; i < 20; i += 2) {
  bp.createEntity('straight_rail', { x: i, y: 1 }, Blueprint.RIGHT);
}
// Train stops face toward tracks, and positive-y is in the down direction.
bp.createEntity('train_stop', { x: 0, y: 3}, Blueprint.UP);

// Center the blueprint around the entities instead of position (0,0)
bp.fixCenter();

// Output the blueprint string!
console.log(bp.encode());
```
## Belt Upgrader

```js
const Blueprint = require('factorio-blueprint');

const bp = new Blueprint(str);

bp.entities.forEach(entity => {
  if (entity.name.includes('transport_belt')) entity.name = 'express_transport_belt';
  else if (entity.name.includes('splitter')) entity.name = 'express_splitter';
  else if (entity.name.includes('underground_belt')) entity.name = 'express_underground_belt';
});

console.log(bp.encode());
```

## Speedy Miners

```js
const Blueprint = require('factorio-blueprint');

const bp = new Blueprint(str);

bp.entities.forEach(entity => {
  if (entity.name == 'electric_mining_drill') entity.modules['speed_module_3'] = 3;
});

console.log(bp.encode());
```
