# Entity

Entities are any object that can be stored in a blueprint at a specific location.
 Examples of entities include belts, power poles, and assembly machines.

## Properties

Do not modify properties directly! Functions to set things such as direction or position
 are included because they do more than just set the variable.

### bp

Get the entity's blueprint parent.

### name

The name of the entity using underscores (such as `"transport_belt"`).
 Only change to entities with the same size (e.g. You could swap a medium electric pole for
 a transport belt, but not for an electric furnace)

### position

A [VictorJS](http://victorjs.org/) object of the top left corner of the entity.

### size

[VictorJS](http://victorjs.org/) object for the width/height of the entity (using `size.x` and `size.y`)

### direction

Number from 0 to 7. For most things it's 0, 2, 4, or 6. You can compare using the static properties
 for Blueprint such as `Blueprint.UP`.

### connections

List of wire connections with other entities.

### neighbours

List of entities that this electrical pole is connected to.

### condition

Condition (circuit or logistic).

### constantEnabled

Boolean which specifies whether or not a constant combinator is on or off.

### filters

Object of filters. Keys are the positions (0 to X), values are item names. Used for storage containers.

### requestFilters

Same format as `filters` but instead used for a chest's request filters.

### constants

Same format as `filters` but instead use for constant combinator values.

### recipe

Entity name of the recipe (again, using underscores).

### directionType

"input" or "output" to distinguish between ins and outs of underground belts

### bar

How many slots have not been blocked off (0 for all slots blocked off, 1 for all but one, -1 for none). Can be up to entity.INVENTORY_SIZE

### modules

Dictionary of (module name) -> (# of that moudle). You *can* edit this property! Example:

```
{
  speed_module_3: 2
}
```

### INVENTORY_SIZE

Number of slots this entity has

## Methods

### toString()

Fancy display for data about the entity.

### remove()

Removes self from blueprint.

### topLeft(), topRight(), bottomLeft(), bottomRight(), center()

Gets a Victor position of respective relative location. `entity.topLeft()` is the same as `entity.position.clone()`.

### connect(toEntity, { fromSide, toSide, color })

Connect a wire (used for circuits) from one entity to another.

`toEntity` The entity we are connecting the wire to.

`fromSide` The side on the current entity that we should connect the wire to. This can be `"in"` or `"out"`. `"in"` is needed for most entities (other than decider/arithmetic combinators) and `undefined` will default to `"in"`.

`toSide` The side on the `toEntity` that we should connect the wire to.

`color` The color used, either `"red"` or `"green"` (default is `"red"`).

Returns self.

### removeConnection(toEntity, { fromSide, toSide, color })

Remove wire connection (if it exists). Returns self.

### removeConnectionsWithEntity(toEntity, color)

Removes all wire connections with `toEntity`. `color` is optional (defaults to all color wires) or either `"red"` or `"green"`. Returns self.

### removeAllConnections()

Remove all wire connections with this entity. Returns self.

### setFilter(position, item, [amount])

Sets filter at `position` (this is 0-indexed) with `amount` of `item` (an entity name).

Returns self.

### removeAllFilters()

Removes all filters on the given entity. Returns self.

### setRequestFilter(position, item, amount)

Sets logistics request filter at `position` (this is 1-indexed) with `amount` of `item` (an entity name). Returns self.

### removeAllRequestFilters()

Remove all request filters on this entity. Returns self.

### setCondition(opt)

Sets the condition, either circuit or logistic.

```js
opt = {
  left: 'transport_belt', // String (item/entity name)
  right: 4, // Number (constant) or String (item/entity name)
  operator: '>', // If arithmetic, +-*/, if decider, <>=
  countFromInput: true, // For decider combinator, should output count from input (or be one). Default is true
  out: 'medium_electric_pole' // String (item/entity name)
}
```

To set a logistic condition, specify the type as 'logistic'. If the type property is left off, it defaults to a circuit condition.

```js
opt = {
  left: 'fast-inserter',
  operator: '<',
  right: 200,
  type: 'logistic'
}
```

### setDirection(dir)

See `entity.direction`, recommend using static directions on Blueprint (such as `Blueprint.UP`). Returns self

### setDirectionType(type)

Either `input` or `output`, only used for underground belts. Returns self.

### setRecipe(recipe)

Sets the recipe for this entity.

### setBar(count)

Sets the bar for this entity (see `entity.bar`). Returns self.

### setConstant(position, name, count)

Set a constant combinator's value (`count`) for a signal (`name`) at `position` (0-indexed). Returns self

### setParameters(opt)

Parameters for programmable speakers.

```js
opt = {
  volume: 0, // 0.0 to 1.0 volume of a programmble speaker
  playGlobally: true, // Whether a programmable speaker should play globally
  allowPolyphony: true // Whether a programmable speaker should be able to play multiple overlapping sounds
}
```

Returns self.

### setCircuityParameters(opt)

More programmable speaker options, (in a different function because of how blueprints are constructed, to be changed soon).

```js
opt = {
  signalIsPitch: false, // Whether a signal should be used as the pitch in a programmable speaker
  instrument: 0, // The ID of the instrument (0-indexed)
  note: 5, // The ID of the note to be played (0-indexed), different for different instruments
}
```

Returns self.

### setAlertParameters(opt)

Sets options for alerts on programmable speakers.

```js
opt = {
  showAlert: true, // Whether or not to show an alert in the GUI when a sound is played
  showOnMap: false, // Whether or not the location should appear on the map
  message: 'I was created automagically!', // String containing the alert message
  icon: 'transport_belt' // The name of the icon to be displayed with the message
}
```

### getData()

Return object with factorio-style data about entity. Entity names will contain dashes, not underscores.
 This is what is used decoded by Factorio when parsing a blueprint. For the whole blueprint, use `blueprint.toObject()`.
