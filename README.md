# factorio-blueprint
Import and Export blueprint strings automagically with this handy dandy blueprint API

# Getting Started

`npm install --save factorio-blueprint`

And don't forget to install the blue print mod!

https://forums.factorio.com/viewtopic.php?t=13651

## Blueprint

### Properties

#### bp.icons

Array of names of entities. No more than four icons are allowed. If this array is empty when calling `.luaString()`, two icons will be automatically generated.

#### bp.entities

List of all entities

### Methods

#### Blueprint([str])

Create an empty blueprint. Accepts an optional encoded blueprint string `str` to be loaded in.

#### bp.load(str)

Loads encoded blueprint string `str`

#### bp.toString()

Outputs fancy format with all the entities.

#### bp.createEntity(name, position, allowOverlap=false, noPlace=false, center=false)

Created an entity of type `name` at `position` (top-left corner).
- Use `allowOverlap` to ignore two entities overlapping (which Factorio does not like...)
- Use `noPlace` if you want the entity to be created but not placed (mainly used in .load())
- Use `center` if you want `position` to refer to the center of the entity (again, mainly used by .load())

#### bp.findEntity(position)

Return entity that overlaps `position` or null.

#### bp.removeEntity(entity)

Removes `entity`, returns it (or false if it was not removed)

#### bp.removeEntityPosition(position)

Removes an entity given the `position`, returns the entity (or false if it was not removed)

#### bp.setIds()

Initialize the IDs on each item. They default to -1, but this is called automatically for things like .toString() and .encode()

#### bp.center()

Centers all entities on the blueprint. I recommend calling this before .encode()

#### bp.generateIcon(num)

Generate icons based off the entities, `num` is the number of icons from 1 to 4.

#### bp.luaString()

The lua string that is encoded

#### bp.encode()

Get the encoded blue print string

#### static entityData(data)

Pass it extra items in the `data` object if you need custom entities (such as from mods or entities that aren't included).
Use the same format as defaultentities.js

## Entity

### Properties

#### entity.id

Position in `bp.entities` when `bp.setIds()` is called.

#### entity.bp

Get the entity's blueprint parent

#### entity.name

#### entity.position

#### entity.direction

Number from 1 to 8. For most things it's 2, 4, 6, and 8

#### entity.connections

List of wire connections with other entities

#### entity.condition

Condition if the entity is a combinator

#### entity.filters

Object of filters. Keys are the positions (1 to X). Used for constant combinators and storage containers.

#### entity.size

x/y contain the width/height

### Methods

#### entity.toString()

Fancy display for data about the entity

#### entity.remove()

Removes self from blueprint

#### entity.topLeft(), entity.topRight(), entity.bottomLeft(), entity.bottomRight(), entity.center()

Gets position of respective relative location. `entity.topLeft()` simply returns a clone of the entity's position.

#### entity.connect(toEntity, fromSide, toSide, color)

Connect with wire `entity`'s `fromSide` to `toEntity`'s `toSide` with wire `color` (red or green)

#### entity.removeConnection(toEntity, fromSide, toSide, color)

Remove wire connection (if it exists).

#### entity.removeConnectionsWithEntity(toEntity, color)

Removes all wire connections with `toEntity`. `color` is optional.

#### entity.removeAllConnections()

Remove all wires connections.

#### entity.setFilter(position, item, [amount])

Sets filter at `position` with `amount` of `item` (an entity name)

#### entity.removeAllFilters()

#### entity.setRequestFilter(position, item, amount)

Sets logistics request filter at `position` with `amount` of `item` (an entity name)

#### entity.removeAllRequestFilters()

#### entity.setCondition(opt)

`opt` contains the following data:
- left: Number (constant) or String (item/entity name)
- right: Number (constant) or String (item/entity name)
- operator: If arithmetic, +-*/, if decider, <>=
- countFromInput: For decider combinator, should output count from input (or be one). Default is false
- out: String (item/entity name)

#### entity.setDirection(dir)
