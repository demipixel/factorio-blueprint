'use strict';

const RawFlate = require('./rawflate');
const atob = require('atob');
const Victor = require('victor');
const gzip = require('gzip-js');

const entityData = require('./defaultentities');
const Entity = require('./entity')(entityData);

class Blueprint {

  constructor(str) {
    this.icons = []; // Icons for Blueprint (up to 4)
    this.entities = []; // List of all entities in Blueprint
    this.tileGrid = {}; // Object with tile keys in format "x,y" => entity
    this.name = ''; // Name if it exists
    if (str) this.load(str);
  }

  // All entities in beautiful string format
  toString() {
    this.setIds();
    return this.entities.map(ent => ent.toString()).join('\n');
  }

  // Load blueprint from an existing one
  load(str) {
    const converted = RawFlate.inflate(atob(str).slice(10, -8));
    const match = converted.match(/do local _={entities={(.+)},icons={(.+)}(,name="(.+)")?};return _;end/);
    if (!match) throw new Error('Invalid blueprint string');

    const correctFormat = str => {
      return fromLuaBracket(str.replace(/\["([0-9]+)"\]/g, '\$1').replace(/=/g, ':').replace(/([a-z0-9_]+):/g, '"\$1":'));
    }

    const entities = JSON.parse('['+correctFormat(match[1])+']');
    const icons = JSON.parse('['+correctFormat(match[2])+']');
    this.name = match[4] || '';

    entities.forEach(entity => {
      this.createEntityWithData(entity, false, true, true); // no overlap, place altogether later, positions are their center
    });
    this.entities.forEach(entity => {
      entity.place(this.tileGrid, this.entities);
    })

    this.icons = [];
    for (let i = 0; i < icons.length; i++) {
      this.icons[icons[i].index-1] = icons[i].name;
    }
    return this;
  }

  // Create an entity!
  createEntity(name, position, direction, allowOverlap, noPlace, center) {
    return this.createEntityWithData({ name: name, position: position, direction: direction || 0 }, allowOverlap, noPlace, center);
    // Need to add to defaultentities.js whether something is rotatable. If not, set direction to null.
  }

  // Creates an entity with a data object instead of paramaters
  createEntityWithData(data, allowOverlap, noPlace, center) {
    const ent = new Entity(data, this.tileGrid, this, center);
    if (allowOverlap || ent.checkNoOverlap(this.tileGrid)) {
      if (!noPlace) ent.place(this.tileGrid, this.entities);
      this.entities.push(ent);
      return ent;
    } else {
      const otherEnt = ent.getOverlap(this.tileGrid);
      throw new Error('Entity '+data.name+' overlaps '+otherEnt.name+' entity ('+data.position.x+', '+data.position.y+')');
    }
  }

  // Returns entity at a position (or null)
  findEntity(pos) {
    return this.tileGrid[Math.floor(pos.x)+','+(pos.y)] || null;
  }

  // Removes a specific entity
  removeEntity(ent) {
    if (!ent) return false;
    else {
      ent.removeCleanup(this.tileGrid);
      this.entities.splice(this.entities.indexOf(ent), 1);
      return ent;
    }
  }

  // Removes an entity at a position (returns false if no entity is there)
  removeEntityPosition(position) {
    if (!this.tileGrid[position.x+','+position.y]) return false;
    return this.removeEntity(this.tileGrid[position.x+','+position.y]);
  }

  // Set ids for entities, called in luaString()
  setIds() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].id = i+1;
    }
    return this;
  }

  // Get corner/center positions
  getPosition(f, xcomp, ycomp) {
    if (!this.entities.length) return new Victor(0, 0);
    return new Victor(this.entities.reduce((best, ent) => xcomp(best, ent[f]().x), this.entities[0][f]().x), this.entities.reduce((best, ent) => ycomp(best, ent[f]().y), this.entities[0][f]().y));
  }
  center() { return new Victor((this.topLeft().x + this.topRight().x) / 2, (this.topLeft().y + this.bottomLeft().y) / 2) }
  topLeft() { return this.getPosition('topLeft', Math.min, Math.min); }
  topRight() { return this.getPosition('topRight', Math.max, Math.min); }
  bottomLeft() { return this.getPosition('bottomLeft', Math.min, Math.max); }
  bottomRight() { return this.getPosition('bottomRight', Math.max, Math.max); }

  // Center all entities
  fixCenter() {
    if (!this.entities.length) return this;
    
    let offsetX = -this.center().x;
    let offsetY = -this.center().y;
    const offset = new Victor(offsetX, offsetY);
    this.entities.forEach(entity => {
      entity.position.add(offset);
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
  luaString() {
    this.setIds();
    if (!this.icons.length) this.generateIcons();
    const entString = this.entities.map(ent => ent.luaString()).join(',');
    const iconString = this.icons.map((icon, i) => '{index='+(i+1)+',name="'+icon.replace(/_/g, '-')+'"}');

    return 'do local _={entities={'+entString+'},icons={'+iconString+'}'+(this.name.length != 0 ? ',name="'+this.name+'"' : '')+'};return _;end';
  }

  // Blueprint string! Yay!
  encode() {
    return (new Buffer(gzip.zip(this.luaString()))).toString('base64');
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
}

module.exports = Blueprint;


// Convert from lua to JSON
function fromLuaBracket(str) {
  let out = '';
  const brackets = [];
  for (var i = 0; i < str.length; i++) {
    if (str[i] == '{') {
      if (str[i+1] == '{') {
        out += '[';
        brackets.push(true);
      } else {
        out += '{';
        brackets.push(false);
      }
    } else if (str[i] == '}') {
      let isArray = brackets.splice(-1)[0];
      if (isArray) out += ']';
      else out += '}';
    } else out += str[i];
  }
  return out;
}