# factorio-blueprint

[![npm version](https://badge.fury.io/js/factorio-blueprint.svg)](https://badge.fury.io/js/factorio-blueprint)

A node.js library created to help you create, modify, and export Factorio blueprints and blueprint strings!

This library supports simple tasks such as adding or removing entities to more complex tasks such as connecting
entities via wires and modifying combinators.

See docs [here](https://demipixel.github.io/factorio-blueprint).

## Getting Started

### Install via NPM

```
$ npm install factorio-blueprint
```

### Basic Usage

```js
const Blueprint = require('factorio-blueprint');

// Create a blueprint with nothing in it
const myBlueprint = new Blueprint();
// Import a blueprint using a blueprint string
const importedBlueprint = new Blueprint(blueprintString);

// Modify the blueprint!
myBlueprint.createEntity('transport-belt', { x: 0, y: 0 }, Blueprint.UP);
importedBlueprint.entities[0].remove();

// Export the string to use in-game
console.log(myBlueprint.encode());
```

## [Click here for full documentation!](https://demipixel.github.io/factorio-blueprint)
