const Victor = require('victor');

module.exports = function(entityData) {
  class Entity {

    constructor(data, positionGrid, bp, center) {
      if (!entityData[bp.checkName(data.name)]) entityData[bp.checkName(data.name)] = {};
      let myData = entityData[bp.checkName(data.name)]; // entityData contains info like width, height, filterAmount, etc

      this.id = -1; // Id used when generating blueprint
      this.bp = bp; // Blueprint
      this.name = this.bp.checkName(data.name); // Name or "type"
      this.position = Victor.fromObject(data.position); // Position of top left corner
      this.direction = 0; // Direction (usually 0, 2, 4, or 6)

      this.rawConnections = data.connections; // Used in parsing connections from existing entity
      this.connections = []; // Wire connections
      this.circuitParameters = data.circuit_parameters || null;
      this.condition = this.parseCondition(data); // Condition in combinator
      this.constants = {};
      this.constantEnabled = data.control_behavior && data.control_behavior.is_on !== undefined ? data.control_behavior.is_on : true; // Is constant combinator on/off

      this.parameters = data.paramaters || (myData.parameters ? {} : null);
      this.alertParameters = data.alert_parameters || (myData.alertParameters ? {} : null);

      this.filters = {}; // Filters for container or signals in constant combinator
      this.requestFilters = {}; // Request filters for requester chest
      this.directionType = data.type || 'input'; // Underground belts input/output
      this.recipe = data.recipe ? this.bp.checkName(data.recipe) : null;
      this.bar = data.bar || -1;

      this.modules = data.items ? Object.keys(data.items).reduce((obj, key) => {
        obj[this.bp.checkName(key)] = data.items[key];
        return obj;
      }, {}) : {};


      this.size = myData ? new Victor(myData.width, myData.height) : // Size in Victor form
                          (entityData[this.name] ? new Victor(entityData[this.name].width, entityData[this.name].height) : new Victor(1, 1));
      this.FILTER_AMOUNT = myData.filterAmount !== false; // Should filters have an amount (e.g. constant combinators have an amount, cargo wagon filter would not)
      this.HAS_DIRECTION_TYPE = myData.directionType;
      this.CAN_HAVE_RECIPE = myData.recipe;
      this.CAN_HAVE_MODULES = myData.modules;
      this.INVENTORY_SIZE = myData.inventorySize || null;

      this.setDirection(data.direction || 0);

      this.parseFilters(this.name == 'constant_combinator' && data.control_behavior ? data.control_behavior.filters : data.filters);
      this.parseRequestFilters(data.request_filters);

      if (center) {
        this.position.add(new Victor(0.5, 0.5)).subtract(this.size.clone().divide(new Victor(2, 2)));
      }
      this.position = new Victor(Math.round(this.position.x*100)/100, Math.round(this.position.y*100)/100);
    }

    // Beautiful string format
    /*toString() {
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
    }*/

    /////////////////////////////////////
    ///// Parsing from existing blueprint
    /////////////////////////////////////

    // Parse connections into standard Entity format
    parseConnections(entityList) {
      const conns = this.rawConnections;
      if (!conns) return [];
      for (let side in conns) {
        if (parseInt(side) != side) return; // Not a number!
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
    parseFilters(filters) { // Parse filters from json (for constructor)
      if (!filters) return [];
      for (let i = 0; i < filters.length; i++) {
        const name = this.bp.checkName(this.FILTER_AMOUNT ? filters[i].signal.name : filters[i].name);

        if (this.FILTER_AMOUNT) filters[i].signal.name = name;
        else filters[i].name = name;

        if (filters[i].signal && !entityData[filters[i].signal.name]) entityData[filters[i].signal.name] = { type: filters[i].signal.type };
        if (filters[i].signal && !myData.filterAmount) myData.filterAmount = true;

        this.setFilter(filters[i].index, this.FILTER_AMOUNT ? filters[i].signal.name : filters[i].name, this.FILTER_AMOUNT ? filters[i].count : undefined);
      }
    }

    // Parse request filters into standard Entity format
    parseRequestFilters(request_filters) { // Parse request_filters from json (for constructor)
      if (!request_filters) return [];
      for (let i = 0; i < request_filters.length; i++) {
        request_filters[i].name = this.bp.checkName(request_filters[i].name);
        this.setRequestFilter(request_filters[i].index, request_filters[i].name, request_filters[i].count);
      }
    }

    // Parse condition into standard Entity format
    parseCondition(data) {
      const controlBehavior = data.control_behavior;
      const condition = (controlBehavior && (controlBehavior.decider_conditions || controlBehavior.arithmetic_conditions || controlBehavior.circuit_condition)) || {};
      if (!controlBehavior) return {};
      if (condition.first_signal) condition.first_signal.name = this.bp.checkName(condition.first_signal.name);
      if (condition.second_signal) condition.second_signal.name = this.bp.checkName(condition.second_signal.name);
      if (condition.output_signal) condition.output_signal.name = this.bp.checkName(condition.output_signal.name);
      const out = {
        left: condition.first_signal ? condition.first_signal.name : undefined,
        right: condition.second_signal ? condition.second_signal.name : (condition.constant ? parseInt(condition.constant) : undefined),
        out: condition.output_signal ? condition.output_signal.name : undefined,

        controlEnable: controlBehavior.circuit_enable_disable, // circuit_enable_disable, true/false
        readContents: controlBehavior.circuit_read_hand_contents, // circuit_read_hand_contents, true/false
        readMode: controlBehavior.circuit_contents_read_mode != undefined ? (condition.circuit_contents_read_mode == 0 ? 'pulse' : 'hold') : undefined
      };
      [condition.first_signal, condition.second_signal, condition.output_signal].forEach(signal => {
        if (signal && !entityData[signal.name]) entityData[signal.name] = { type: signal.type };
      });
      if (this.name == 'decider_combinator') {
        out.countFromInput = condition.copy_count_from_input == 'true';
      }

      if (condition.comparator) // Set operator
        out.operator = condition.comparator == ':' ? '=' : condition.comparator;
      else
        out.operator = condition.operation;

      return out;
    }

    ////////////////
    ////////////////
    ////////////////

    // Sets values in BP (tile data, parses connections).
    // Typically, when loading from an existing blueprint, all entities are creating at the same time,
    // and then all are placed at the same time (so each entity can parse the connections of the others)
    place(positionGrid, entityList) {
      this.setTileData(positionGrid);
      this.parseConnections(entityList);
      return this;
    }

    // Remove entity from blueprint
    remove() {
      return this.bp.removeEntity(this);
    }

    // Cleans up tile data after removing
    removeCleanup(positionGrid) {
      this.removeTileData(positionGrid);
      return this;
    }

    // Quick corner/center positions
    topLeft() { return this.position.clone(); }
    topRight() { return this.position.clone().add(this.size.clone().multiply(new Victor(1, 0))); }
    bottomRight() { return this.position.clone().add(this.size); }
    bottomLeft() { return this.position.clone().add(this.size.clone().multiply(new Victor(0, 1))); }
    center() { return this.position.clone().add(this.size.clone().divide(new Victor(2, 2))); }

    // Adds self to grid array
    setTileData(positionGrid) {
      this.tileDataAction(positionGrid, (x, y) => positionGrid[x+','+y] = this);
      return this;
    }

    // Removes self from grid array
    removeTileData(positionGrid) {
      this.tileDataAction(positionGrid, (x, y) => delete positionGrid[x+','+y]);
      return this;
    }

    // Return true if this entity overlaps with no other
    checkNoOverlap(positionGrid) {
      const ent = this.getOverlap(positionGrid);

      if (!ent) return true;

      if ((this.name == 'gate' && ent.name == 'straight_rail') || (ent.name == 'gate' && this.name == 'straight_rail')) return true;

      return false;
    }

    // Returns an item this entity overlaps with (or null)
    getOverlap(positionGrid) {
      let item = null;
      this.tileDataAction(positionGrid, (x, y) => {
        item = positionGrid[x+','+y] || item;
      });
      return item;
    }

    // Do an action on every tile that this entity overlaps in a given positionGrid
    tileDataAction(positionGrid, fn) {
      if (!positionGrid) return;
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

    setFilter(pos, name, amt, request) {
      const filter = request ? 'requestFilters' : 'filters';
      name = this.bp.checkName(name);
      if (name == null) delete this[filter][pos];
      else this[filter][pos] = {
            name: name,
            count: amt || 0
          };
      return this;
    }

    setRequestFilter(pos, name, amt) {
      return this.setFilter(pos, name, amt, true);
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
      else if (opt.readMode && (opt.readMode != 'pulse' && opt.readMode != 'hold')) throw new Error('readMode in a condition must be "pulse" or "hold"!');
      else if (this.name == 'arithmetic_combinator' && (opt.left == 'signal_everything' || opt.out == 'signal_everything' || opt.left == 'signal_anything' || opt.out == 'signal_anything'))
        throw new Error('Only comparitive conditions can contain signal_everything or signal_anything. Instead use signal_each');
      else if (opt.out == 'signal_each' && opt.left != 'signal_each')
        throw new Error('Left condition must be signal_each for output to be signal_each.'+(this.name != 'arithmetic_combinator' ? ' Use signal_everything for the output instead' : ''));

      if (opt.left) opt.left = this.bp.checkName(opt.left);
      if (typeof opt.right == 'string') opt.right = this.bp.checkName(opt.right);
      if (opt.out) opt.out = this.bp.checkName(opt.out);
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
        out: checkAllow('out'),

        controlEnable: checkAllow('controlEnable'), // circuit_enable_disable, true/false
        readContents: checkAllow('readContents'), // circuit_read_hand_contents, true/false
        readMode: checkAllow('readMode') // circuit_contents_read_mode, 0 or 1
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

    setDirectionType(type) {
      if (!this.HAS_DIRECTION_TYPE) throw new Error('This type of item does not have a directionType! Usually only underground belts have these.');
      else if (type != 'input' && type != 'output') throw new Error('setDirectionType() accepts the string "input" and "output" only');
      this.directionType = type;

      return this;
    }

    setRecipe(recipe) {
      if (!this.CAN_HAVE_RECIPE) throw new Error('This entity cannot have a recipe.');
      this.recipe = checkName(recipe);

      return this;
    }

    setBar(num) {
      if (!this.INVENTORY_SIZE) throw new Error('Only entities with inventories can have bars!');
      else if (typeof num == 'number' && num < 0) throw new Error('You must provide a positive value to setBar()');
      this.bar = typeof num != 'number' || num >= this.INVENTORY_SIZE ? -1 : num;

      return this;
    }

    setCircuitParameters(obj) {
      if (!this.circuitParameters) this.circuitParameters = {};
      Object.keys(obj).forEach(key => this.circuitParameters[key] = obj[key]);

      return this;
    }

    setParameters(obj) {
      if (!this.parameters) this.parameters = {};
      Object.keys(obj).forEach(key => this.parameters[key] = obj[key]);

      return this;
    }

    setAlertParameters(obj) {
      if (!this.alertParameters) this.alertParameters = {};
      Object.keys(obj).forEach(key => this.alertParameters[key] = obj[key]);

      return this;
    }

    setConstant(pos, name, count) {
      if (this.name != 'constant_combinator') throw new Error('Can only set constants for constant combinators!');
      else if (pos < 0 || pos >= 18) throw new Error(pos+' is an invalid position (must be between 0 and 17 inclusive)');

      if (!name) delete this.constants[pos];
      else this.constants[pos] = {
        name: this.bp.checkName(name),
        count: count == undefined ? 0 : count
      };

      return this;
    }

    // Convert condition to lua format
    /*luaConnections() {
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
        if (this.FILTER_AMOUNT) {
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
    }*/

    getData() {
      const useValueOrDefault = (val, def) => val != undefined ? val : def;

      const getOptionData = (append={}) => {

        if (!this.condition) return append;

        append.circuit_enable_disable = this.condition.controlEnable;
        append.circuit_read_hand_contents = this.condition.readContents;
        append.circuit_contents_read_mode = this.condition.readMode != undefined ? (this.condition.readMode == 'pulse' ? 0 : 1) : undefined;

        return append;
      }

      const getCondition = () => {
        // let key = this.name == 'arithmetic_combinator' ? 'arithmetic' : (this.name == 'decider_combinator' ? 'decider' : 'circuit');
        const out = {};

        out.first_signal = (this.condition.left ? {
          type: entityData[this.condition.left].type,
          name: this.condition.left.replace(/_/g, '-')
        } : undefined);
        out.second_signal = (typeof this.condition.right == 'string' ? {
          type: entityData[this.condition.right].type,
          name: this.condition.right.replace(/_/g, '-')
        } : undefined);
        out.constant = typeof this.condition.right == 'number' ? this.condition.right : undefined;
        out.operation = undefined;
        out.comparator = undefined;
        out.output_signal = (this.condition.out ? {
          type: entityData[this.condition.out].type,
          name: this.condition.out.replace(/_/g, '-')
        } : undefined);

        if (this.name != 'arithmetic_combinator') {
          out.comparator = this.condition.operator;
          out.copy_count_from_input = this.condition.countFromInput != undefined ? (!!this.condition.countFromInput).toString() : undefined;
        } else {
          out.operation = this.condition.operator;
        }
        return out;
      }
      
      const getAlertParameters = ({
        showAlert,
        showOnMap,
        message,
        iconSignalId
      }) => {
        if(iconSignalId) {
          iconSignalId = {
            type: iconSignalId.type.replace(/_/g, '-'),
            name: iconSignalId.name.replace(/_/g, '-')
          };
        }
        return {
          show_alert: useValueOrDefault(showAlert, false),
          show_on_map: useValueOrDefault(showOnMap, true),
          alert_message: useValueOrDefault(message, ''),
          icon_signal_id: useValueOrDefault(iconSignalId, undefined)
        };
      }

      return {
        name: this.bp.fixName(this.name),
        position: this.center().subtract(new Victor(0.5, 0.5)),
        direction: this.direction || 0,

        type: /*this.HAS_DIRECTION_TYPE*/ this.directionType ? this.directionType : undefined,
        recipe: /*this.CAN_HAVE_RECIPE &&*/ this.recipe ? this.bp.fixName(this.recipe) : undefined,
        bar: /*this.INVENTORY_SIZE &&*/ (this.bar != -1) ? this.bar : undefined,

        items: /*this.CAN_HAVE_MODULES &&*/ this.modules && Object.keys(this.modules).length ? Object.keys(this.modules).reduce((obj, key) => {
          obj[this.bp.fixName(key)] = this.modules[key];
          return obj;
        }, {}) : undefined,

        filters: makeEmptyArrayUndefined(Object.keys(this.filters).map(index => {
          const filter = this.filters[index];

          const obj = { index: parseInt(index) };
          if (this.FILTER_AMOUNT) {
            const type = entityData[filter.name].type;
            obj.signal = {
              name: this.bp.fixName(filter.name),
              type: type
            };
            obj.count = filter.count;
          } else {
            obj.name = filter.name;
          }
          return obj;
        })),

        request_filters: makeEmptyArrayUndefined(Object.keys(this.requestFilters).map(index => {
          const rFilter = this.requestFilters[index];
          return {
            name: this.bp.fixName(rFilter.name),
            count: rFilter.count,
            index: parseInt(index)
          }
        })),

        connections: this.connections.length || this.condition || Object.keys(this.condition).length || Object.keys(this.circuitParameters).length ? this.connections.reduce((obj, connection) => {
          let side = connection.side;
          let color = connection.color;
          if (!obj[side]) obj[side] = {};
          if (!obj[side][color]) obj[side][color] = [];
          obj[side][color].push({ entity_id: connection.entity.id, circuit_id: connection.id });
          return obj;
        }, {}) : undefined,

        parameters: this.parameters ? {
          playback_volume: useValueOrDefault(this.parameters.volume, 1.0),
          playback_globally: useValueOrDefault(this.parameters.playGlobally, false),
          allow_polyphony: useValueOrDefault(this.parameters.allowPolyphony, true)
        } : undefined,

        alert_parameters: this.alertParameters ? getAlertParameters(this.alertParameters) : undefined,

        control_behavior: this.constants || this.condition || this.name == 'decider_combinator' || this.name == 'arithmetic_combinator' ? getOptionData({
          filters: this.constants && Object.keys(this.constants).length ? Object.keys(this.constants).map((key, i) => {
            const data = this.constants[key];
            return {
              signal: {
                name: this.bp.fixName(data.name),
                type: entityData[data.name].type
              },
              count: data.count != undefined ? data.count : 0,
              index: parseInt(key) + 1
            };
          }) : undefined,

          decider_conditions: this.name == 'decider_combinator' ? getCondition() : undefined,
          arithmetic_conditions: this.name == 'arithmetic_combinator' ? getCondition() : undefined,
          circuit_condition: !this.name.includes('combinator') && this.condition.left ? getCondition() : undefined,

          is_on: this.name == 'constant_combinator' && !this.constantEnabled ? this.constantEnabled : undefined,

          circuit_parameters: this.circuitParameters ? {
            signal_value_is_pitch: useValueOrDefault(this.circuitParameters.signalIsPitch, false),
            instrument_id: useValueOrDefault(this.circuitParameters.instrument, 0),
            note_id: useValueOrDefault(this.circuitParameters.note, 0)
          } : undefined
        }) : undefined,
      };
    }
  }

  // Lib Functions

  // Convert to lua
  /*function toLuaFixer(str) {
    return str.replace(/\[/g, '{').replace(/\]/g, '}').replace(/"([a-z0-9_]+)":/g, '\$1=')
  }*/

  // Convert 'in' or 'out' of wires (only combinators have both of these) to a 1 or 2.
  function convertSide(side, ent) {
    if (!side) return 1;
    if (side == 1 || side == 2) return side;
    else if (side == 'in' || side == 'out') {
      if (ent && ent.name != 'arithmetic_combinator' && ent.name != 'decider_combinator') return 1;
      else return side == 'in' ? 1 : 2;
    } else throw new Error('Invalid side');
  }

  function makeEmptyArrayUndefined(arr) {
    return arr.length ? arr : undefined;
  }


  return Entity;
}
