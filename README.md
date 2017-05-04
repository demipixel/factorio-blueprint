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

#### bp.name

Name of the blueprint, can be set. Be wary of setting this to anything other than letters or numbers.

### Methods

#### Blueprint([str])

Create an empty blueprint. Accepts an optional encoded blueprint string `str` to be loaded in.

#### bp.load(str, opt)

Loads encoded blueprint string `str`. Returns self. Options are (all default false):

- allowOverlap: Throws an error if two entities are colliding
- fixEntityData: Automatically adds unknown entities to entityData

#### bp.toString()

Outputs fancy format with all the entities.

#### bp.createEntity(name, position, direction=0, allowOverlap=false, noPlace=false, center=false)

Creates an entity of type `name` at `position` (top-left corner) facing `direction`.
- Use `allowOverlap` to ignore two entities overlapping (which Factorio does not like...)
- Use `noPlace` if you want the entity to be created but not placed (mainly used in .load())
- Use `center` if you want `position` to refer to the center of the entity (again, mainly used by .load())

Returns the new entity

#### bp.createEntityWithData(data, allowOverlap=false, noPlace=false, center=false)

Creates an entity with loaded data (containing keys such as name, position, direction, recipe, filters, and other options).

Typically used when generating entities from a blueprint string. Can be used to clone an entity using the data of `entityToClone.getData()`

#### bp.createTile(name, position)

Creates a tile of type `name` at `position`.

Returns the new tile

#### bp.placeBlueprint(otherBlueprint, position, direction=0, allowOverlap=false)

Places `otherBlueprint` at `position` (being the center of `otherBlueprint`) with rotations direction (0, 1, 2, or 3 rotating clockwise each time). `allowOverlap` works the same as in createEntity(). Clones both entities and tiles.

Returns self.

#### bp.findEntity(position)

Return entity that overlaps `position` or null.

#### bp.findTile(position)

Return tile at `position` or null.

#### bp.removeEntity(entity)

Removes `entity`, returns it (or false if it was not removed)

#### bp.removeTile(tile)

Removes `tile`, returns it (or false if it was not removed)

#### bp.removeEntityAtPosition(position)

Removes an entity that overlaps `position`, returns the entity (or false if it was not removed)

#### bp.removeTileAtPosition(position)

Removes a tile at `position`, returns the entity (or false if it was not removed)

#### bp.setIds()

Initialize the IDs on each item. They default to -1, but this is called automatically for things like .toString() and .encode(). Returns self.

#### bp.fixCenter([point])

Centers all entities on the blueprint. I recommend calling this before `Blueprint.encode()`. An optional `point` may be provided to center about.

Returns self.

#### bp.center()

Get position that is the center of all entities

#### bp.topLeft()

Get top-left-most entity's corner position

#### bp.topRight()

Get top-right-most entity's corner position

#### bp.bottomLeft()

Get bottom-left-most entity's corner position

#### bp.bottomRight()

Get bottom-right-most entity's corner position

#### bp.generateIcon(num)

Generate icons based off the entities, `num` is the number of icons from 1 to 4. Returns self.

#### bp.toObject()

Object containing all the data (just before being converted to JSON)

#### bp.toJSON()

Get the JSON data of the blueprint before it's encoded

#### bp.encode()

Get the encoded blueprint string

#### static setEntityData(data)

Pass it extra items in the `data` object if you need custom entities (such as from mods or entities that aren't included).
Use the same format as defaultentities.js

#### static Blueprint.getEntityData()

Get a list of all entities added to be supported by factorio-blueprint.

## Entity

### Properties

#### entity.id

1-based index of entity in  `bp.entities` when `bp.setIds()` is called.

#### entity.bp

Get the entity's blueprint parent

#### entity.name

#### entity.position

#### entity.size

x/y contain the width/height

#### entity.direction

Number from 0 to 7. For most things it's 0, 2, 4, or 6

#### entity.connections

List of wire connections with other entities

#### entity.condition

Condition if the entity is a combinator

#### entity.filters

Object of filters. Keys are the positions (1 to X). Used for constant combinators and storage containers.

#### entity.recipe

Entity name of the recipe

#### entity.directionType

"input" or "output" to distinguish between ins and outs of underground belts

#### entity.bar

How many slots have not been blocked off (0 for all slots blocked off, 1 for all but one, -1 for none). Can be up to entity.INVENTORY_SIZE

#### entity.INVENTORY_SIZE

Number of slots this entity has

### Methods

#### entity.toString()

Fancy display for data about the entity

#### entity.remove()

Removes self from blueprint

#### entity.topLeft(), entity.topRight(), entity.bottomLeft(), entity.bottomRight(), entity.center()

Gets position of respective relative location. `entity.topLeft()` simply returns a clone of the entity's position.

#### entity.connect(toEntity, fromSide, toSide, color)

Connect with wire `entity`'s `fromSide` to `toEntity`'s `toSide` with wire `color` (red or green). Returns self.

#### entity.removeConnection(toEntity, fromSide, toSide, color)

Remove wire connection (if it exists). Returns self.

#### entity.removeConnectionsWithEntity(toEntity, color)

Removes all wire connections with `toEntity`. `color` is optional. Returns self.

#### entity.removeAllConnections()

Remove all wires connections. Returns self.

#### entity.setFilter(position, item, [amount])

Sets filter at `position` with `amount` of `item` (an entity name). Returns self.

#### entity.removeAllFilters()

Returns self.

#### entity.setRequestFilter(position, item, amount)

Sets logistics request filter at `position` with `amount` of `item` (an entity name). Returns self.

#### entity.removeAllRequestFilters()

Returns self.

#### entity.setCondition(opt)

`opt` contains the following data:
- left: Number (constant) or String (item/entity name)
- right: Number (constant) or String (item/entity name)
- operator: If arithmetic, +-*/, if decider, <>=
- countFromInput: For decider combinator, should output count from input (or be one). Default is false
- out: String (item/entity name)

#### entity.setDirection(dir)

See entity.direction, returns self

#### entity.setDirectionType(type)

See entity.directionType, returns self.

#### entity.setRecipe(recipe)

See entity.recipe, returns self.

#### entity.setBar(count)

See entity.bar, returns self.

#### entity.setConstant(position, name, count)

Set a constant combinator's value (count) for a signal (name) at position (0-indexed). Returns self

#### entity.setParameters(opt)

opt is an object with the following possible key/values. Returns self

- volume: 0.0 to 1.0 volume of a programmble speaker
- playGlobally: Whether a programmable speaker should play globally
- allowPolyphony: Whether a programmable speaker should be able to play multiple overlapping sounds

#### entity.setCircuityParameters(opt)

opt is an object with the following possible key/values. Returns self

- signalIsPitch: Whether a signal should be used as the pitch in a programmable speaker
- instrument: The ID of the instrument (0-indexed)
- note: The ID of the note to be played (0-indexed), different for different instruments

#### entity.setAlertParameters(opt)

opt is an object with the following possible key/values. Returns self

- showAlert: Whether or not to show an alert in the GUI when a sound is played
- showOnMap: Whether or not the location should appear on the map
- message: String containing the alert message

#### entity.getData()

Return object with factorio-style data about entity. Entity names will contain dashes, not underscores

## Tile

### Properties

#### tile.id

1-based index of tile in  `bp.tiles` when `bp.setIds()` is called.

#### tile.bp

Get the tile's blueprint parent

#### tile.name

#### tile.position

#### tile.remove()

Removes self from blueprint

#### tile.getData()

Return object with factorio-style data about entity. Entity names will contain dashes, not underscores