const Victor = require('victor');

module.exports = function(entityData) {
  class Entity {

    constructor(data, tileGrid, bp, center) {
      this.id = -1; // Id used when generating blueprint
      this.bp = bp; // Blueprint
      this.name = checkName(data.name); // Name or "type"
      this.position = Victor.fromObject(data.position); // Position of top left corner
      this.direction = 0; // Direction (usually 0, 2, 4, or 6)
      this.rawConnections = data.connections; // Used in parsing connections from existing entity
      this.connections = []; // Wire connections
      this.condition = this.parseCondition(data.conditions); // Condition in combinator
      this.filters = {}; // Filters for container or signals in constant combinator
      this.requestFilters = {}; // Request filters for requester chest

      let myData = entityData[this.name]; // entityData contains info like width, height, filterAmount, etc
      this.size = myData ? new Victor(myData.width, myData.height) : // Size in Victor form
                          (entityData[this.name] ? new Victor(entityData[this.name].width, entityData[this.name].height) : new Victor(1, 1));
      this.filterAmount = myData.filterAmount !== false; // Should filters have an amount (e.g. constant combinators have an amount, cargo wagon filter would not)

      this.setDirection(data.direction || 0);

      this.parseFilters(data.filters);
      this.parseRequestFilters(data.request_filters);

      if (center) {
        this.position.subtract(this.size.clone().divide(new Victor(2, 2)));
      }
      this.position = new Victor(Math.round(this.position.x*100)/100, Math.round(this.position.y*100)/100);
    }

    // Beautiful string format
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

    /////////////////////////////////////
    ///// Parsing from existing blueprint
    /////////////////////////////////////

    // Parse connections into standard Entity format
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

    // Parse filters into standard Entity format
    parseFilters(filters) { // Parse filters from lua (for constructor)
      if (!filters) return [];
      for (let i = 0; i < filters.length; i++) {
        const name = checkName(this.filterAmount ? filters[i].signal.name : filters[i].name);

        if (this.filterAmount) filters[i].signal.name = name;
        else filters[i].name = name;

        this.setFilter(filters[i].index, this.filterAmount ? filters[i].signal.name : filters[i].name, this.filterAmount ? filters[i].count : undefined);
      }
    }

    // Parse request filters into standard Entity format
    parseRequestFilters(request_filters) { // Parse request_filters from lua (for constructor)
      if (!request_filters) return [];
      for (let i = 0; i < request_filters.length; i++) {
        request_filters[i].name = checkName(request_filters[i].name);
        this.setRequestFilter(request_filters[i].index, request_filters[i].name, request_filters[i].count);
      }
    }

    // Parse condition into standard Entity format
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

    ////////////////
    ////////////////
    ////////////////

    // Sets values in BP (tile data, parses connections).
    // Typically, when loading from an existing blueprint, all entities are creating at the same time,
    // and then all are placed at the same time (so each entity can parse the connections of the others)
    place(tileGrid, entityList) {
      this.setTileData(tileGrid);
      this.parseConnections(entityList);
      return this;
    }

    // Remove entity from blueprint
    remove(bp) {
      return (bp || this.bp).removeEntity(this);
    }

    // Cleans up tile data after removing
    removeCleanup(tileGrid) {
      this.removeTileData(tileGrid);
      return this;
    }

    // Quick corner/center positions
    topLeft() { return this.position.clone(); }
    topRight() { return this.position.clone().add(this.size.clone().multiply(new Victor(1, 0))); }
    bottomRight() { return this.position.clone().add(this.size); }
    bottomLeft() { return this.position.clone().add(this.size.clone().multiply(new Victor(0, 1))); }
    center() { return this.position.clone().add(this.size.clone().divide(new Victor(2, 2))); }

    // Adds self to grid array
    setTileData(tileGrid) {
      this.tileDataAction(tileGrid, (x, y) => tileGrid[x+','+y] = this);
      return this;
    }

    // Removes self from grid array
    removeTileData(tileGrid) {
      this.tileDataAction(tileGrid, (x, y) => delete tileGrid[x+','+y]);
      return this;
    }

    // Return true if this entity overlaps with no other
    checkNoOverlap(tileGrid) {
      return !this.getOverlap(tileGrid);
    }

    // Returns an item this entity overlaps with (or null)
    getOverlap(tileGrid) {
      let item = null;
      this.tileDataAction(tileGrid, (x, y) => {
        item = tileGrid[x+','+y] || item;
      });
      return item;
    }

    // Do an action on every tile that this entity overlaps in a given tileGrid
    tileDataAction(tileGrid, fn) {
      if (!tileGrid) return;
      const topLeft = this.topLeft();
      const bottomRight = this.bottomRight().subtract(new Victor(0.9, 0.9));
      for (let x = Math.floor(topLeft.x); x < bottomRight.x; x++) {
        for (let y = Math.floor(topLeft.y); y < bottomRight.y; y++) {
          fn(x, y);
        }
      }
    }

    // Connect current entity to another entity via wire
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

    // Remove a specific wire connection given all details
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

    // Remove all wire connections with entity (optionally of a specific color)
    removeConnectionsWithEntity(ent, color) {
      for (let i = this.connections.length-1; i >= 0; i--) {
        if (this.connections[i].entity == ent && (!color || this.connections[i].color == color)) this.connections.splice(i, 1);
      }

      for (let i = ent.connections.length-1; i >= 0; i--) {
        if (ent.connections[i].entity == this && (!color || ent.connections[i].color == color)) ent.connections.splice(i, 1);
      }
      return this;
    }

    // Remove all wire connections
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

    setFilter(pos, item, amt, request) {
      const filter = request ? 'requestFilters' : 'filters';
      item = checkName(item);
      if (item == null) delete this[filter][pos];
      else this[filter][pos] = {
            name: item,
            count: amt || 0
          };
      return this;
    }

    setRequestFilter(pos, item, amt) {
      return this.setFilter(pos, item, amt, true);
    }

    removeAllFilters() {
      this.filters = {};
      return this;
    }

    removeAllRequestFilters() {
      this.requestFilters = {};
      return this;
    }

    // Sets condition of entity (for combinators)
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

    // Sets direction of entity
    setDirection(dir) {
      // if (this.direction == null) return this; // Prevent rotation when we know what things can rotate in defaultentities.js
      this.size = new Victor((dir % 4 == this.direction % 4 ? this.size.x : this.size.y),
                             (dir % 4 == this.direction % 4 ? this.size.y : this.size.x));
      this.direction = dir;
      return this;
    }

    // Convert condition to lua format
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

    // Convert filter to lua format
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

    // Convert request filter to lua format
    luaRequestFilter() {
      return toLuaFixer(JSON.stringify(Object.keys(this.requestFilters).map(key => {
        return {
          name: this.requestFilters[key].name.replace(/_/g, '-'),
          count: this.requestFilters[key].count,
          index: parseInt(key)
        };
      })));
    }

    // Convert condition to Lua format
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

    // Entity luaString that gets merged in Blueprint.luaString()
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

  // Lib Functions

  // Convert to lua
  function toLuaFixer(str) {
    return str.replace(/\[/g, '{').replace(/\]/g, '}').replace(/"([a-z0-9_]+)":/g, '\$1=')
  }

  // Convert 'in' or 'out' of wires (only combinators have both of these) to a 1 or 2.
  function convertSide(side, ent) {
    if (!side) return 1;
    if (side == 1 || side == 2) return side;
    else if (side == 'in' || side == 'out') {
      if (ent && ent.name != 'arithmetic_combinator' && ent.name != 'decider_combinator') return 1;
      else return side == 'in' ? 1 : 2;
    } else throw new Error('Invalid side');
  }

  // Check that name of entity is valid
  function checkName(name) {
    name = name.replace(/-/g, '_');
    if (!entityData[name]) throw new Error(name+' does not exist! You can add it by putting it into entityData.');
    return name;
  }


  return Entity;
}