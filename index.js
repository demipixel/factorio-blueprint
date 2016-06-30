'use strict';

const RawFlate = require('./rawflate');
const atob = require('atob');
const Victor = require('victor');
var gzip = require('gzip-js');

var entityData = require('./defaultentities');

class Blueprint {

  constructor(str) {
    this.icons = [];
    this.entities = [];
    this.tileArray = {};
    if (str) this.load(str);
  }

  toString() {
    this.setIds();
    return this.entities.map(ent => ent.toString()).join('\n');
  }

  load(str) {
    const converted = RawFlate.inflate(atob(str).slice(10, -8));
    const match = converted.match(/do local _={entities={(.+)},icons={(.+)}};return _;end/);
    if (!match) throw new Error('Invalid blueprint string');

    const correctFormat = str => {
      return fromLuaBracket(str.replace(/\["([0-9]+)"\]/g, '\$1').replace(/=/g, ':').replace(/([a-z0-9_]+):/g, '"\$1":'));
    }

    const entities = JSON.parse('['+correctFormat(match[1])+']');
    const icons = JSON.parse('['+correctFormat(match[2])+']');

    entities.forEach(entity => {
      this.createEntityWithData(entity, false, true, true); // no overlap, place altogether later, positions are their center
    });
    this.entities.forEach(entity => {
      entity.place(this.tileArray, this.entities);
    })

    this.icons = [];
    for (let i = 0; i < icons.length; i++) {
      this.icons[icons[i].index-1] = icons[i].name;
    }
  }

  createEntity(name, position, allowOverlap, noPlace, center) {
    return this.createEntityWithData({ name: name, position: position, direction: position.direction || 0 }, allowOverlap, noPlace, center);
    // Need to add to defaultentities.js whether something is rotatable. If not, set direction to null.
  }

  createEntityWithData(data, allowOverlap, noPlace, center) {
    const ent = new Entity(data, this.tileArray, this, center);
    if (allowOverlap || ent.checkNoOverlap(this.tileArray)) {
      if (!noPlace) ent.place(this.tileArray, this.entities);
      this.entities.push(ent);
      return ent;
    } else {
      const otherEnt = ent.getOverlap(this.tileArray);
      throw new Error('Entity '+data.name+' overlaps '+otherEnt.name+' entity ('+data.position.x+', '+data.position.y+')');
    }
  }

  findEntity(pos) {
    return this.tileArray[Math.floor(pos.x)+','+(pos.y)] || null;
  }

  removeEntity(ent) {
    if (!ent) return false;
    else {
      ent.removeCleanup(this.tileArray);
      this.entities.splice(this.entities.indexOf(ent), 1);
      return ent;
    }
  }

  removeEntityPosition(position) {
    if (!this.tileArray) return false;
    return this.removeEntity(this.tileArray[position.x+','+position.y]);
  }

  setIds() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].id = i+1;
    }
  }

  getPosition(f, xcomp, ycomp) {
    if (!this.entities.length) return new Victor(0, 0);
    return new Victor(this.entities.reduce((best, ent) => xcomp(best, ent[f]().x), this.entities[0][f]().x), this.entities.reduce((best, ent) => ycomp(best, ent[f]().y), this.entities[0][f]().y));
  }
  center() { return new Victor((this.topLeft().x + this.topRight().x) / 2, (this.topLeft().y + this.bottomLeft().y) / 2) }
  topLeft() { return this.getPosition('topLeft', Math.min, Math.min); }
  topRight() { return this.getPosition('topRight', Math.max, Math.min); }
  bottomLeft() { return this.getPosition('bottomLeft', Math.min, Math.max); }
  bottomRight() { return this.getPosition('bottomRight', Math.max, Math.max); }

  fixCenter() {
    if (!this.entities.length) return;
    
    let offsetX = -this.center().x;
    let offsetY = -this.center().y;
    const offset = new Victor(offsetX, offsetY);
    this.entities.forEach(entity => {
      entity.position.add(offset);
    });
  }

  generateIcons(num) {
    if (!num) num = 2;
    num = Math.min(this.entities.length, Math.min(Math.max(num, 1), 4));
    for (let i = 0; i < num; i++) {
      this.icons[i] = this.entities[i].name;
    }
  }

  luaString() {
    this.setIds();
    if (!this.icons.length) this.generateIcons();
    const entString = this.entities.map(ent => ent.luaString()).join(',');
    const iconString = this.icons.map((icon, i) => '{index='+(i+1)+',name="'+icon.replace(/_/g, '-')+'"}');

    return 'do local _={entities={'+entString+'},icons={'+iconString+'}};return _;end';
  }

  encode() {
    return (new Buffer(gzip.zip(this.luaString()))).toString('base64');
  }

  static entityData(obj) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      entityData[keys[i]] = obj[keys[i]];
    }
  }

  static getEntityData() {
    return entityData;
  }
}

class Entity {

  constructor(data, tileArray, bp, center) {
    this.id = -1;
    this.bp = bp;
    this.name = checkName(data.name);
    this.position = Victor.fromObject(data.position);
    this.direction = 0;
    this.rawConnections = data.connections;
    this.connections = [];
    this.condition = this.parseCondition(data.conditions);
    this.filters = {};
    this.requestFilters = {};

    let myData = entityData[this.name];
    this.size = myData ? new Victor(myData.width, myData.height) :
                        (entityData[this.name] ? new Victor(entityData[this.name].width, entityData[this.name].height) : new Victor(1, 1));
    this.filterAmount = myData.filterAmount !== false;

    this.setDirection(data.direction || 0);

    this.parseFilters(data.filters);
    this.parseRequestFilters(data.request_filters);

    if (center) {
      this.position.subtract(this.size.clone().divide(new Victor(2, 2)));
    }
    this.position = new Victor(Math.round(this.position.x*100)/100, Math.round(this.position.y*100)/100);
  }

  toString() {
    let str = this.id+') '+this.name + ' =>\n';
    str += '  position: '+this.position+'\n';
    str += '  direction: '+this.direction+'\n';
    str += '  connections: ';
    if (!this.connections.length) str += 'none\n';
    else {
      str += '\n';
      const two = this.name == 'arithmetic_combinator' || this.name == 'decider_combinator';
      for (let i = 1; i <= (two ? 2 : 1); i++) {
        const side = two && i == 2 ? 'out' : 'in'
        const conns = this.connections.filter(c => c.side == i);
        if (conns.length) {
          if (two) str += '    '+side+':\n';
          for (let j = 0; j < 2; j++) {
            const color = j == 0 ? 'red' : 'green';
            const exactConns = conns.filter(c => c.color == color);
            if (exactConns.length) str += '      '+color+': '+exactConns.map(c => c.entity.id).join(',')+'\n';
          }
        }
      }
    }
    if (this.condition) {
      str += '  condition:\n';
      str += '    expr: '+this.condition.left+' '+this.condition.operator+' '+this.condition.right+'\n';
      str += this.condition.countFromInput != undefined ? '    countFromInput: '+(this.condition.countFromInput || false)+'\n' : '';
      str += this.condition.out != undefined ? '    out: '+this.condition.out+'\n' : '';
    }
    return str;
  }

  parseConnections(entityList) {
    const conns = this.rawConnections;
    if (!conns) return [];
    for (let side in conns) {
      for (let color in conns[side]) {
        for (let i = 0; i < conns[side][color].length; i++ ) {
          const id = conns[side][color][i]['entity_id'];
          this.connections.push({
            entity: entityList[id-1],
            color: color,
            side: side,
            id: conns[side][color][i]['circuit_id']
          });
        }
      }
    }
  }

  parseFilters(filters) { // Parse filters from lua (for constructor)
    if (!filters) return [];
    for (let i = 0; i < filters.length; i++) {
      const name = checkName(this.filterAmount ? filters[i].signal.name : filters[i].name);

      if (this.filterAmount) filters[i].signal.name = name;
      else filters[i].name = name;

      this.setFilter(filters[i].index, this.filterAmount ? filters[i].signal.name : filters[i].name, this.filterAmount ? filters[i].count : undefined);
    }
  }

  parseRequestFilters(request_filters) { // Parse request_filters from lua (for constructor)
    if (!request_filters) return [];
    for (let i = 0; i < request_filters.length; i++) {
      request_filters[i].name = checkName(request_filters[i].name);
      this.setRequestFilter(request_filters[i].index, request_filters[i].name, request_filters[i].count);
    }
  }

  parseCondition(condition) {
    if (!condition) return (this.name == 'decider_combinator' || this.name == 'arithmetic_combinator' ? {} : null);
    const key = Object.keys(condition)[0];
    const obj = condition[key];
    if (obj.first_signal) obj.first_signal.name = checkName(obj.first_signal.name);
    if (obj.second_signal) obj.second_signal.name = checkName(obj.second_signal.name);
    if (obj.output_signal) obj.output_signal.name = checkName(obj.output_signal.name);
    const out = {
      left: obj.first_signal ? obj.first_signal.name : undefined,
      right: obj.second_signal ? obj.second_signal.name : parseInt(obj.constant),
      out: obj.output_signal ? obj.output_signal.name : undefined
    };
    if (key == 'decider') {
      out.countFromInput = obj.copy_count_from_input == 'true';
    }

    if (obj.comparator) // Set operator
      out.operator = obj.comparator == ':' ? '=' : obj.comparator;
    else
      out.operator = obj.operation;

    return out;
  }

  place(tileArray, entityList) { // Setup for placing
    this.setTileData(tileArray);
    this.parseConnections(entityList);
    return this;
  }

  remove(bp) {
    return (bp || this.bp).removeEntity(this);
  }

  removeCleanup(tileArray) { // Cleanup for removal
    this.removeTileData(tileArray);
    return this;
  }

  // Quick corner positions
  topLeft() { return this.position.clone(); }
  topRight() { return this.position.clone().add(this.size.clone().multiply(new Victor(1, 0))); }
  bottomRight() { return this.position.clone().add(this.size); }
  bottomLeft() { return this.position.clone().add(this.size.clone().multiply(new Victor(0, 1))); }
  center() { return this.position.clone().add(this.size.clone().divide(new Victor(2, 2))); }

  setTileData(tileArray) { // Add self to grid array
    this.tileDataAction(tileArray, (x, y) => tileArray[x+','+y] = this);
    return this;
  }

  removeTileData(tileArray) { // Remove self from grid array
    this.tileDataAction(tileArray, (x, y) => delete tileArray[x+','+y]);
    return this;
  }

  checkNoOverlap(tileArray) { // Check overlap with other tiles based off size
    return !this.getOverlap(tileArray);
  }

  getOverlap(tileArray) {
    let item = null;
    this.tileDataAction(tileArray, (x, y) => {
      item = tileArray[x+','+y] || item;
    });
    return item;
  }

  tileDataAction(tileArray, fn) { // Do something with all tiles entity overlaps
    if (!tileArray) return;
    const topLeft = this.topLeft();
    const bottomRight = this.bottomRight().subtract(new Victor(0.9, 0.9));
    for (let x = Math.floor(topLeft.x); x < bottomRight.x; x++) {
      for (let y = Math.floor(topLeft.y); y < bottomRight.y; y++) {
        fn(x, y);
      }
    }
  }

  connect(ent, mySide, theirSide, color) {
    mySide = convertSide(mySide, this);
    theirSide = convertSide(theirSide, ent);

    const checkCombinator = name => {
      return name == 'decider_combinator' || name == 'arithmetic_combinator';
    }

    color = color == 'green' ? color : 'red';

    this.connections.push({ entity: ent, color: color, side: mySide, id: checkCombinator(ent.name) ? theirSide : undefined });
    ent.connections.push({ entity: this, color: color, side: theirSide, id: checkCombinator(this.name) ? mySide : undefined });
    return this;
  }

  removeConnection(ent, mySide, theirSide, color) {
    mySide = convertSide(mySide, this);
    theirSide = convertSide(theirSide, ent);
    color = color || 'red';

    for (let i = 0; i < this.connections.length; i++) {
      if (this.connections[i].entity == ent && this.connections[i].side == mySide && this.connections[i].color == color) {
        this.connections.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < ent.connections.length; i++) {
      if (ent.connections[i].entity == this && ent.connections[i].side == theirSide && ent.connections[i].color == color) {
        ent.connections.splice(i, 1);
        break;
      }
    }
    return this;
  }

  removeConnectionsWithEntity(ent, color) {
    for (let i = this.connections.length-1; i >= 0; i--) {
      if (this.connections[i].entity == ent && (!color || this.connections[i].color == color)) this.connections.splice(i, 1);
    }

    for (let i = ent.connections.length-1; i >= 0; i--) {
      if (ent.connections[i].entity == this && (!color || ent.connections[i].color == color)) ent.connections.splice(i, 1);
    }
  }

  removeAllConnections() {
    for (let i = 0; i < this.connections.length; i++) {
      let ent = this.connections[i].entity;
      for (let j = 0; j < ent.connections.length; j++) {
        if (ent.connections[j].entity == this) {
          ent.connections.splice(j, 1);
          break;
        }
      }
    }
    this.connections = [];
    return this;
  }

  setFilter(pos, item, amt) {
    item = checkName(item);
    if (item == null) delete this.filters[pos];
    this.filters[pos] = {
      name: item,
      count: amt || 0
    };
    return this;
  }

  setRequestFilter(pos, item, amt) {
    item = checkName(item);
    if (item == null) delete this.requestFilters[pos];
    this.requestFilters[pos] = {
      name: item,
      count: amt
    };
    return this;
  }

  removeAllFilters() {
    this.filters = {};
    return this;
  }

  removeAllRequestFilters() {
    this.requestFilters = {};
    return this;
  }

  setCondition(opt) {
    if (opt.countFromInput != undefined && this.name != 'decider_combinator') throw new Error('Cannot set countFromInput for '+this.name);

    if (opt.left) opt.left = checkName(opt.left);
    if (typeof opt.right == 'string') opt.right = checkName(opt.right);
    if (opt.out) opt.out = checkName(opt.out);
    const checkAllow = name => {
      if (opt[name] != undefined) {
        return opt[name];
      } else if (this.condition[name] != undefined) {
        return this.condition[name];
      } else {
        return undefined;
      }
    }
    if (!this.condition) this.condition = {};
    this.condition = {
      left: checkAllow('left'),
      right: checkAllow('right'),
      operator: checkAllow('operator'),
      countFromInput: checkAllow('countFromInput'),
      out: checkAllow('out')
    };
    return this;
  }

  setDirection(dir) {
    // if (this.direction == null) return this; // Prevent rotation when we know what things can rotate in defaultentities.js
    this.size = new Victor((dir % 4 == this.direction % 4 ? this.size.x : this.size.y),
                           (dir % 4 == this.direction % 4 ? this.size.y : this.size.x));
    this.direction = dir;
    return this;
  }

  luaConnections() {
    const out = {};
    for (let i = 0; i < this.connections.length; i++) {
      let side = this.connections[i].side;
      let color = this.connections[i].color;
      if (!out[side]) out[side] = {};
      if (!out[side][color]) out[side][color] = [];
      out[side][color].push({ entity_id: this.connections[i].entity.id, circuit_id: this.connections[i].id });
    }
    return toLuaFixer(JSON.stringify(out)).replace(/([12])=/g, '["\$1"]=');
  }

  luaFilter() {
    return toLuaFixer(JSON.stringify(Object.keys(this.filters).map(key => {
      const obj = {
        index: parseInt(key)
      };
      const name = this.filters[key].name.replace(/_/g, '-');
      if (this.filterAmount) {
        const type = entityData[this.filters[key].name].type;
        obj.signal = {
          type: type,
          name: name,
        };
        obj.count = this.filters[key].count;
      } else {
        obj.name = name;
      }
      return obj;
    })));
  }

  luaRequestFilter() {
    return toLuaFixer(JSON.stringify(Object.keys(this.requestFilters).map(key => {
      return {
        name: this.requestFilters[key].name.replace(/_/g, '-'),
        count: this.requestFilters[key].count,
        index: parseInt(key)
      };
    })));
  }

  luaCondition() {
    let key = this.name == 'arithmetic_combinator' ? 'arithmetic' : (this.name == 'decider_combinator' ? 'decider' : 'circuit');
    let out = {};
    out[key] = {
      first_signal: (this.condition.left ? {
        type: entityData[this.condition.left].type,
        name: this.condition.left.replace(/_/g, '-')
      } : undefined),
      second_signal: (typeof this.condition.right == 'string' ? {
        type: entityData[this.condition.right].type,
        name: this.condition.right.replace(/_/g, '-')
      } : undefined),
      constant: typeof this.condition.right == 'number' ? this.condition.right : undefined,
      operation: undefined,
      comparator: undefined,
      output_signal: (this.condition.out ? {
        type: entityData[this.condition.out].type,
        name: this.condition.out.replace(/_/g, '-')
      } : undefined)
    };
    if (key != 'arithmetic') {
      out[key].comparator = this.condition.operator;
      out[key].copy_count_from_input = this.condition.countFromInput != undefined ? (!!this.condition.countFromInput).toString() : undefined;
    } else {
      out[key].operation = this.condition.operator;
    }
    return toLuaFixer(JSON.stringify(out));
  }

  luaString() {
    const direction = this.direction ? ',direction='+this.direction : '';
    const connections = this.connections.length ? ',connections='+this.luaConnections() : '';
    const filters = Object.keys(this.filters).length ? ',filters='+this.luaFilter() : '';
    const request_filters = Object.keys(this.requestFilters).length ? ',request_filters='+this.luaRequestFilter() : '';
    const condition = this.condition ? ',conditions='+this.luaCondition() : '';
    const centerPos = this.center();
    return '{name="'+this.name.replace(/_/g, '-')+'",position={x='+centerPos.x+',y='+centerPos.y+'}'+direction+connections+filters+request_filters+condition+'}';
  }
}

function toLuaFixer(str) {
  return str.replace(/\[/g, '{').replace(/\]/g, '}').replace(/"([a-z0-9_]+)":/g, '\$1=')
}

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

function convertSide(side, ent) {
  if (!side) return 1;
  if (side == 1 || side == 2) return side;
  else if (side == 'in' || side == 'out') {
    if (ent && ent.name != 'arithmetic_combinator' && ent.name != 'decider_combinator') return 1;
    else return side == 'in' ? 1 : 2;
  } else throw new Error('Invalid side');
}

function checkName(name) {
  name = name.replace(/-/g, '_');
  if (!entityData[name]) throw new Error(name+' does not exist! You can add it by putting it into entityData.');
  return name;
}

module.exports = Blueprint;
