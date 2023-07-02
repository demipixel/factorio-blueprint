# Blueprint

Blueprint is the class that is returned by `require('factorio-blueprint')`. It is the main class used for loading
 or creating new blueprints.

## Properties

### icons

Array of names of entities. No more than four icons are allowed. If this array is empty when calling `.luaString()`, two icons will be automatically generated.

### entities

Array of all entities.

### name

Name of the blueprint, can be set. Be wary of setting this to anything other than letters or numbers.

### description

Description of the blueprint, can be set. 

### snapping

Dictionary with information on grid snapping, if set. Not set by default.
```
{
  grid: {x: 32, y: 32}, //size of the grid, defaults to one chunk
  absolute: true //whether it is absolutely positioned on the world grid or relative to the first placement
  position: {x: 1, y: 1}, //world offset of the upper left corner of the blueprint, used only with absolute positioning
}
```

### static UP

Returns the integer for the direction up, helpful in Blueprint.createEntity()

### static DOWN

### static RIGHT

### static LEFT

### static ROTATION_NONE, ROTATION_90_CW, ROTATION_180_CW, ROTATION_270_CW, ROTATION_270_CCW, ROTATION_180_CCW, ROTATION_90_CCW

Rotation parameters for the `placeBlueprint` function.

## Methods

### Blueprint([data], [opt])

Create an empty blueprint. Optional `data` can be a blueprint string or a Factorio blueprint object. See `load()` for info on the `opt`.

### static Blueprint.getBook(str)

Returns an array of blueprints that were in the book.

### load(data, [opt])

Loads blueprint from a blueprint string or a Factorio blueprint object `data`. Returns self. Options are (all default false):

```js
opt = {
  allowOverlap: false, // Throws an error if two entities are colliding unless allowOverlap is true
  fixEntityData: false // Automatically adds unknown entities to entityData, useful for mods
}
```

### toString()

Outputs blueprint in fancy format with all the entities.

### createEntity(name, position, direction=0, allowOverlap=false, noPlace=false, center=false)

Creates an entity of type `name` (use underscores) at `position` (top-left corner, any object with x and y attributes) facing `direction`.
- Use `allowOverlap` to ignore two entities overlapping (which Factorio does not like...)
- Use `noPlace` if you want the entity to be created but not placed (mainly used in .load())
- Use `center` if you want `position` to refer to the center of the entity (again, mainly used by .load())

Returns the newly created [Entity](./classes/Entity.md).

### createEntityWithData(data, allowOverlap=false, noPlace=false, center=false)

Creates an entity with loaded data (containing keys such as name, position, direction, recipe, filters, and other options).

Typically used when generating entities from a blueprint string. Can be used to clone an entity using the data of `entityToClone.getData()` (though make sure you change the position or whatever else you want to before creating it).

### createTile(name, position)

Creates a tile (such as concrete or stone bricks) of type `name` at `position`.

Returns the newly created [Tile](./classes/Tile.md).

### placeBlueprint(otherBlueprint, position, rotations=0, allowOverlap=false)

Places `otherBlueprint` at `position` (being the center of `otherBlueprint`) with `rotations`; Supply one of the `Blueprint.ROTATION_*` constants. `allowOverlap` works the same as in createEntity(). Clones both entities and tiles.

Returns self.

### findEntity(position)

Return entity that overlaps `position` (or `null` if there is no such entity).

### findTile(position)

Return tile at `position` (or `null` if there is no such tile).

### removeEntity(entity)

Removes `entity`, returns it (or false if it was not removed)

### removeTile(tile)

Removes `tile`, returns it (or false if it was not removed)

### removeEntityAtPosition(position)

Removes an entity that overlaps `position`, returns the entity (or false if it was not removed).

This is helpful as `blueprint.findEntity(position).remove()` could throw an error if no entity is found at that position.

### removeTileAtPosition(position)

Removes a tile at `position`, returns the tile (or false if it was not removed)

### setSnapping(size, absolute?, absolutePosition?)

Sets the grid snapping for the blueprint.
`size` Position. Size of the grid
`absolute` Boolean (optional). Absolute positioning will align the blueprint with the world grid
`absolutePosition` Position (optional). Offsets an absolutely positioned blueprint from the world grid

Note: The value that's shown as "grid position" in the GUI is controlled by moving the center with `fixCenter()`

### fixCenter([point])

Centers all entities on the blueprint. I recommend calling this before `Blueprint.encode()`. An optional `point` may be provided to center about.

Returns self.

### center()

Get position that is the center of all entities

### topLeft()

Get top-left-most entity's corner position

### topRight()

Get top-right-most entity's corner position

### bottomLeft()

Get bottom-left-most entity's corner position

### bottomRight()

Get bottom-right-most entity's corner position

### generateIcon(num)

Generate icons based off the entities, `num` is the number of icons from 1 to 4. This is called automatically if no icons are provided. Returns self.

### toObject({ autoConnectPoles = true })

Object containing all the data (just before being converted to JSON). This is the data used by Factorio to load the blueprint (after it has been decoded). `autoConnectPoles` will destroy all (if any) electrical pole connections and reconnect them all as if they were placed manually in Factorio.

### toJSON()

Get the JSON data of the blueprint just before it's encoded.

### encode({version="latest", autoConnectPoles=true})

Get the encoded blueprint string wihh options.
- `version` encoding method (only option is `0` or `latest` at the moment).
- `autoConnectPoles` described above in `toObject()`

### static Blueprint.isBook(str)

Returns a boolean on whether or not the string is a blueprint book (otherwise it's just a blueprint).

### static Blueprint.toBook(blueprints, activeIndex=0, {version="latest", autoConnectPoles=true})

Get an encoded string using an array of blueprint objects stored in `blueprints`. `activeIndex` is the currently selected blueprint. Options described above in `encode()`

### static Blueprint.setEntityData(data)

`data` should be an object, with keys as entity names and values as objects with options. A basic example is:

```js
{
  my_modded_assembly_machine: {
    type: 'item', // 'item', 'fluid', 'virtual', 'tile', or 'recipe'
    width: 2,
    height: 2,

    recipe: true,
    modules: 4,

    inventorySize: 48, // How many slots this container has (such as a chest)
    filterAmount: false, // Set to false for filter inserters which have filters but no "amounts" on the filters
    directionType: false // true for underground belts
  }
}
```

If you do not provide data for modded objects, certain functions such as `entity.size` as `blueprint.findEntity()` will not work correctly.

Use [defaultentities.js](https://github.com/demipixel/factorio-blueprint/blob/master/defaultentities.js) as a reference for vanilla items.

### static Blueprint.getEntityData()

Get the current object containing all entity data (mapping (entity name) -> (entity data)). See above for format.
