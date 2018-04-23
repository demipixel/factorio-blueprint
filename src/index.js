'use strict';

const prettyJSON = require('prettyjson');
const Victor = require('victor');

const entityData = require('./defaultentities');
const Entity = require('./entity')(entityData);
const Tile = require('./tile')(entityData);
const util = require('./util');

class Blueprint {

  constructor(data, opt = {}) {
    this.name = 'Blueprint';
    this.icons = []; // Icons for Blueprint (up to 4)
    this.entities = []; // List of all entities in Blueprint
    this.tiles = []; // List of all tiles in Blueprint (such as stone path or concrete)
    this.entityPositionGrid = {}; // Object with tile keys in format "x,y" => entity
    this.tilePositionGrid = {};
    this.version = null;
    this.checkWithEntityData = opt.checkWithEntityData != undefined ? opt.checkWithEntityData : true; // make sure checkName() validates with entityData
    if (data) this.load(data, opt);
  }

  // All entities in beautiful string format
  toString() {
    this.setIds();
    return prettyJSON.render(this.toObject().blueprint, {
      noAlign: true,
      numberColor: 'magenta'
    });
  }

  // Load blueprint from an existing one
  load(data, opt = {}) {
    if (typeof data === 'string') {
      const version = data.slice(0, 1);
      data = util.decode[version](data);
    }
    return this.fillFromObject(data, opt);
  }

  fillFromObject(data, opt) {
    if (data.hasOwnProperty('blueprint'))
      data = data.blueprint;

    if (!data.tiles) data.tiles = [];
    if (!data.entities) data.entities = [];
    if (!data.icons) data.icons = [];

    this.name = data.label;
    this.version = data.version;

    data.entities.forEach(entity => {
      if (opt.fixEntityData) {
        const data = {};
        data[this.jsName(entity.name)] = { type: 'item', width: 1, height: 1 };
        Blueprint.setEntityData(data);
      }
      this.createEntityWithData(entity, opt.allowOverlap, true, true); // no overlap (unless option allows it), place altogether later, positions are their center
    });
    this.entities.forEach(entity => {
      entity.place(this.entityPositionGrid, this.entities);
    });

    data.tiles.forEach(tile => {
      this.createTile(tile.name, tile.position);
    });

    this.icons = [];
    data.icons.forEach(icon => {
      this.icons[icon.index - 1] = this.checkName(icon.signal.name);
    });

    this.setIds();

    return this;
  }

  placeBlueprint(bp, position, rotations, allowOverlap) { // rotations is 0, 1, 2, or 3
    const entitiesCreated = []
    bp.entities.forEach(ent => {
      const data = ent.getData();

      data.direction += (rotations || 0) * 2;
      // data.direction += 8;
      data.direction %= 8;

      if (rotations == 3) data.position = { x: data.position.y, y: -data.position.x };
      else if (rotations == 2) data.position = { x: -data.position.x, y: -data.position.y };
      else if (rotations == 1) data.position = { x: -data.position.y, y: data.position.x };

      data.position.x += position.x;
      data.position.y += position.y;

      entitiesCreated.push(this.createEntityWithData(data, allowOverlap, true, true));
    });

    entitiesCreated.forEach(e => {
      e.place(this.entityPositionGrid, entitiesCreated);
    });

    bp.tiles.forEach(tile => {
      const data = tile.getData();

      if (rotations == 3) data.position = { x: data.position.y, y: -data.position.x };
      else if (rotations == 2) data.position = { x: -data.position.x, y: -data.position.y };
      else if (rotations == 1) data.position = { x: -data.position.y, y: data.position.x };

      data.position.x += position.x;
      data.position.y += position.y;

      this.createTileWithData(data);
    });

    return this;
  }

  // Create an entity!
  createEntity(name, position, direction, allowOverlap, noPlace, center) {
    return this.createEntityWithData({
      name: name,
      position: position,
      direction: direction || 0
    }, allowOverlap, noPlace, center);
    // Need to add to defaultentities.js whether something is rotatable. If not, set direction to null.
  }

  // Creates an entity with a data object instead of paramaters
  createEntityWithData(data, allowOverlap, noPlace, center) {
    const ent = new Entity(data, this.entityPositionGrid, this, center);
    if (allowOverlap || ent.checkNoOverlap(this.entityPositionGrid)) {
      if (!noPlace) ent.place(this.entityPositionGrid, this.entities);
      this.entities.push(ent);
      return ent;
    } else {
      const otherEnt = ent.getOverlap(this.entityPositionGrid);
      throw new Error('Entity ' + data.name + ' overlaps ' + otherEnt.name + ' entity (' + data.position.x + ', ' + data.position.y + ')');
    }
  }

  createTile(name, position) {
    return this.createTileWithData({ name: name, position: position });
  }

  createTileWithData(data) {
    const tile = new Tile(data, this);
    if (this.tilePositionGrid[data.position.x + ',' + data.position.y]) this.removeTile(this.tilePositionGrid[data.position.x + ',' + data.position
      .y]);

    this.tilePositionGrid[data.position.x + ',' + data.position.y] = tile;
    this.tiles.push(tile);
    return tile;
  }

  // Returns entity at a position (or null)
  findEntity(pos) {
    return this.entityPositionGrid[Math.floor(pos.x) + ',' + (pos.y)] || null;
  }

  findTile(pos) {
    return this.tilePositionGrid[Math.floor(pos.x) + ',' + (pos.y)] || null;
  }

  // Removes a specific entity
  removeEntity(ent) {
    if (!ent) return false;
    else {
      ent.removeCleanup(this.entityPositionGrid);
      const index = this.entities.indexOf(ent)
      if (index == -1) return ent;
      this.entities.splice(index, 1);
      return ent;
    }
  }

  removeTile(tile) {
    if (!tile) return false;
    else {
      const index = this.tiles.indexOf(tile)
      if (index == -1) return tile;
      this.tiles.splice(index, 1);
      return tile;
    }
  }

  // Removes an entity at a position (returns false if no entity is there)
  removeEntityAtPosition(position) {
    if (!this.entityPositionGrid[position.x + ',' + position.y]) return false;
    return this.removeEntity(this.entityPositionGrid[position.x + ',' + position.y]);
  }

  removeTileAtPosition(position) {
    if (!this.tilePositionGrid[position.x + ',' + position.y]) return false;
    return this.removeTile(this.tilePositionGrid[position.x + ',' + position.y]);
  }

  // Set ids for entities, called in toJSON()
  setIds() {
    this.entities.forEach((entity, i) => {
      entity.id = i + 1;
    })
    this.tiles.forEach((tile, i) => {
      tile.id = i + 1;
    });
    return this;
  }

  // Get corner/center positions
  getPosition(f, xcomp, ycomp) {
    if (!this.entities.length) return new Victor(0, 0);
    return new Victor(this.entities.reduce((best, ent) => xcomp(best, ent[f]().x), this.entities[0][f]().x), this.entities.reduce((best, ent) =>
      ycomp(best, ent[f]().y), this.entities[0][f]().y));
  }

  center() { return new Victor((this.topLeft().x + this.topRight().x) / 2, (this.topLeft().y + this.bottomLeft().y) / 2) }
  topLeft() { return this.getPosition('topLeft', Math.min, Math.min); }
  topRight() { return this.getPosition('topRight', Math.max, Math.min); }
  bottomLeft() { return this.getPosition('bottomLeft', Math.min, Math.max); }
  bottomRight() { return this.getPosition('bottomRight', Math.max, Math.max); }

  // Center all entities
  fixCenter(aroundPoint) {
    if (!this.entities.length) return this;

    let offsetX = aroundPoint ? -aroundPoint.x : -Math.floor(this.center().x / 2) * 2;
    let offsetY = aroundPoint ? -aroundPoint.y : -Math.floor(this.center().y / 2) * 2;
    const offset = new Victor(offsetX, offsetY);
    this.entities.forEach(entity => entity.removeTileData(this.entityPositionGrid));
    this.entities.forEach(entity => {
      entity.position.add(offset);
      entity.setTileData(this.entityPositionGrid);
    });
    this.tiles.forEach(tile => delete this.tilePositionGrid[tile.position.x + ',' + tile.position.y]);
    this.tiles.forEach(tile => {
      tile.position.add(offset);
      this.tilePositionGrid[tile.position.x + ',' + tile.position.y] = tile;
    });
    return this;
  }

  // Quickly generate 2 (or num) icons
  generateIcons(num) {
    if (!num) num = 2;
    num = Math.min(this.entities.length, Math.min(Math.max(num, 1), 4));
    for (let i = 0; i < num; i++) {
      this.icons[i] = this.entities[i].name;
    }
    return this;
  }

  // Give luaString that gets converted by encode()
  toObject() {
    this.setIds();
    if (!this.icons.length) this.generateIcons();
    const entityInfo = this.entities.map((ent, i) => {
      const entData = ent.getData();

      entData.entity_number = i + 1;

      return entData;
    });
    const tileInfo = this.tiles.map((tile, i) => tile.getData());
    const iconData = this.icons.map((icon, i) => {
      return { signal: { type: entityData[icon].type, name: this.fixName(icon) }, index: i + 1 };
    });

    return {
      blueprint: {
        icons: iconData,
        entities: this.entities.length ? entityInfo : undefined,
        tiles: this.tiles.length ? tileInfo : undefined,
        item: 'blueprint',
        version: this.version || 0,
        label: this.name
      }
    };
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  // Blueprint string! Yay!
  encode(version = 'latest') {
    return util.encode[version](this.toObject());
  }

  // Set entityData
  static setEntityData(obj) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      entityData[keys[i]] = obj[keys[i]];
    }
  }

  // Get entityData
  static getEntityData() {
    return entityData;
  }

  static get UP() {
    return 0
  }

  static get RIGHT() {
    return 2;
  }

  static get DOWN() {
    return 4;
  }

  static get LEFT() {
    return 6;
  }

  checkName(name) {
    if (typeof name != 'string') throw new Error('Expected name of entity or tile, instead got ' + name);
    name = this.jsName(name);
    if (!entityData[name] && this.checkWithEntityData) throw new Error(name + ' does not exist! You can add it by putting it into entityData.');
    return name;
  }

  jsName(name) {
    return typeof name == 'string' ? name.replace(/-/g, '_') : name;
  }

  fixName(name) {
    return name.replace(/_/g, '-');
  }
}

module.exports = Blueprint;

//Blueprint is imported in ./book, so it must be exported before we import ./book here
const book = require('./book');
Blueprint.getBook = function(str, opt) {
  return book(str, opt);
};

Blueprint.toBook = (blueprints, activeIndex = 0, version = 'latest') => {
  let obj = {
    blueprint_book: {
      blueprints: blueprints.map(bp => bp.toObject()),
      item: 'blueprint-book',
      active_index: activeIndex,
      version: 0
    }
  };

  return util.encode[version](obj);
}

Blueprint.isBook = (str) => {
  const version = str.slice(0, 1);
  let obj = util.decode[version](str);

  return typeof obj.blueprint_book === 'object';
}
