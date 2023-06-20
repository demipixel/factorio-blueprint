import Victor from 'victor';

import entityData from './defaultentities';
import Blueprint from './index';

type PositionGrid = { [location: string]: Entity };
type Side = 1 | 2 | 'in' | 'out';
type Color = 'red' | 'green';
type Priority = 'left' | 'right';
type DirectionType = 'input' | 'output';

interface Connection {
  entity: Entity;
  color: Color;
  side: Side;
  id?: string;
}

interface CombinatorData {
  left?: string;
  right?: string;
  operator?: string;
  out?: string;

  controlEnable?: boolean;
  readContents?: boolean;
  readMode?: string;
  countFromInput?: boolean;
}

interface Constant {
  name: string;
  count: number;
}

interface AlertParameters {
  showAlert?: boolean;
  showOnMap?: boolean;
  icon?: string | { type: string; name: string };
  message?: string;
}

export default class Entity {
  id: number;
  bp: Blueprint;
  name: string;
  position: Victor;
  direction: number;

  rawConnections: any;
  connections: Connection[];
  rawNeighbours?: number[];
  neighbours: Entity[];
  circuitParameters: any;
  condition: CombinatorData;
  constants?: { [position: number]: Constant };
  constantEnabled: boolean;
  trainControlBehavior: Record<string, any>;

  parameters: any;
  alertParameters: AlertParameters;

  filters: { [position: number]: string };
  requestFilters: { [position: number]: Constant };
  directionType: DirectionType;
  recipe?: string;
  bar: number;

  modules: any;

  stationName?: string;
  manualTrainsLimit?: number;

  splitterFilter?: string;
  inputPriority: Priority | undefined;
  outputPriority: Priority | undefined;

  size: Victor;
  HAS_DIRECTION_TYPE: boolean;
  CAN_HAVE_RECIPE: boolean;
  CAN_HAVE_MODULES: number;
  INVENTORY_SIZE: number;

  constructor(data: any, bp: Blueprint, center?: boolean) {
    if (!entityData[bp.checkName(data.name)])
      entityData[bp.checkName(data.name)] = {};
    let myData = entityData[bp.checkName(data.name)]; // entityData contains info like width, height, filterAmount, etc

    this.id = -1; // Id used when generating blueprint
    this.bp = bp; // Blueprint
    this.name = this.bp.checkName(data.name); // Name or "type"
    this.position = Victor.fromObject(data.position); // Position of top left corner
    this.direction = 0; // Direction (usually 0, 2, 4, or 6)

    this.rawConnections = data.connections; // Used in parsing connections from existing entity
    this.connections = []; // Wire connections
    this.rawNeighbours = data.neighbors;
    this.neighbours = [];
    this.circuitParameters = data.circuit_parameters || null;
    this.condition = this.parseCondition(data); // Condition in combinator
    this.constants = this.parseConstants(data);
    this.trainControlBehavior = this.parseTrainControlBehavior(data);
    this.constantEnabled =
      data.control_behavior && data.control_behavior.is_on !== undefined
        ? data.control_behavior.is_on
        : true; // Is constant combinator on/off

    this.parameters = data.paramaters || (myData.parameters ? {} : null);
    this.alertParameters =
      data.alert_parameters || (myData.alertParameters ? {} : null);

    this.filters = {}; // Filters for container
    this.requestFilters = {}; // Request filters for requester chest
    this.directionType = data.type || 'input'; // Underground belts input/output
    this.recipe = data.recipe ? this.bp.checkName(data.recipe) : undefined;
    this.bar = data.bar || -1;

    this.modules = data.items
      ? Object.keys(data.items).reduce(
          (obj: { [module: string]: number }, key) => {
            obj[this.bp.checkName(key)] = data.items[key];
            return obj;
          },
          {},
        )
      : {};

    this.stationName = data.station ? data.station : undefined;
    this.manualTrainsLimit = data.manual_trains_limit || undefined;

    this.splitterFilter = data.filter
      ? this.bp.checkName(data.filter)
      : undefined;
    this.inputPriority = data.input_priority || undefined;
    this.outputPriority = data.output_priority || undefined;

    this.size = myData
      ? new Victor(myData.width || 0, myData.height || 0) // Size in Victor form
      : entityData[this.name]
      ? new Victor(
          entityData[this.name].width || 0,
          entityData[this.name].height || 0,
        )
      : new Victor(1, 1);
    this.HAS_DIRECTION_TYPE = myData.directionType || false;
    this.CAN_HAVE_RECIPE = myData.recipe || false;
    this.CAN_HAVE_MODULES = myData.modules || 0;
    this.INVENTORY_SIZE = myData.inventorySize || 0;

    this.setDirection(data.direction || 0);

    this.parseFilters(data.filters);
    this.parseRequestFilters(data.request_filters);

    if (center) {
      this.position
        .add(new Victor(0.5, 0.5))
        .subtract(this.size.clone().divide(new Victor(2, 2)));
    }
    this.position = new Victor(
      Math.round(this.position.x * 100) / 100,
      Math.round(this.position.y * 100) / 100,
    );
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
  parseConnections(entityList: any) {
    const conns = this.rawConnections;
    if (conns) {
      for (let side in conns) {
        if (side != '1' && side != '2') return; // Not a number!
        for (let color in conns[side]) {
          for (let i = 0; i < conns[side][color].length; i++) {
            const id = conns[side][color][i]['entity_id'];
            const connection: Connection = {
              entity: entityList[id - 1],
              color: color == 'red' ? 'red' : 'green', // Garbage to make typescript shut up
              side: parseInt(side) == 1 ? 1 : 2,
              id: conns[side][color][i]['circuit_id'],
            };
            this.connections.push(connection);
          }
        }
      }
    }

    if (this.rawNeighbours) {
      this.neighbours = this.rawNeighbours.map((id) => entityList[id - 1]);
    }
  }

  // Parse filters into standard Entity format
  parseFilters(filters: any) {
    // Parse filters from json (for constructor)
    if (!filters) return [];
    for (let i = 0; i < filters.length; i++) {
      const name = this.bp.checkName(filters[i].name);

      const final_position = filters[i].index - 1;
      const final_name = name;

      this.setFilter(final_position, final_name);
    }
  }

  // Parse request filters into standard Entity format
  parseRequestFilters(request_filters: any) {
    // Parse request_filters from json (for constructor)
    if (!request_filters) return [];
    for (let i = 0; i < request_filters.length; i++) {
      request_filters[i].name = this.bp.checkName(request_filters[i].name);
      this.setRequestFilter(
        request_filters[i].index - 1,
        request_filters[i].name,
        request_filters[i].count,
      );
    }
  }

  // Parse condition into standard Entity format
  parseCondition(data: any) {
    const controlBehavior = data.control_behavior;
    const condition =
      (controlBehavior &&
        (controlBehavior.decider_conditions ||
          controlBehavior.arithmetic_conditions ||
          controlBehavior.circuit_condition)) ||
      {};
    if (!controlBehavior) return {};
    if (condition.first_signal)
      condition.first_signal.name = this.bp.checkName(
        condition.first_signal.name,
      );
    if (condition.second_signal)
      condition.second_signal.name = this.bp.checkName(
        condition.second_signal.name,
      );
    if (condition.output_signal)
      condition.output_signal.name = this.bp.checkName(
        condition.output_signal.name,
      );
    const out: CombinatorData = {
      left: condition.first_signal ? condition.first_signal.name : undefined,
      right: condition.second_signal
        ? condition.second_signal.name
        : condition.constant
        ? parseInt(condition.constant)
        : undefined,
      out: condition.output_signal ? condition.output_signal.name : undefined,
      operator: undefined,

      controlEnable: controlBehavior.circuit_enable_disable, // circuit_enable_disable, true/false
      readContents: controlBehavior.circuit_read_hand_contents, // circuit_read_hand_contents, true/false
      readMode:
        controlBehavior.circuit_contents_read_mode != undefined
          ? condition.circuit_contents_read_mode == 0
            ? 'pulse'
            : 'hold'
          : undefined,
      countFromInput: undefined,
    };
    [
      condition.first_signal,
      condition.second_signal,
      condition.output_signal,
    ].forEach((signal) => {
      if (signal && !entityData[signal.name])
        entityData[signal.name] = { type: signal.type };
    });
    if (this.name == 'decider_combinator') {
      out.countFromInput = condition.copy_count_from_input == 'true';
    }

    if (condition.comparator)
      // Set operator
      out.operator = condition.comparator == ':' ? '=' : condition.comparator;
    else out.operator = condition.operation;

    return out;
  }

  // Parse constants if this is a constant combinator
  parseConstants(data: any) {
    if (this.name != 'constant_combinator') return undefined;
    else if (!data.control_behavior || !data.control_behavior.filters)
      return {};
    const constants: {
      [position: number]: { name: string; count: number };
    } = {};

    data.control_behavior.filters.forEach((filter: any) => {
      if (!entityData[this.bp.checkName(filter.signal.name)]) {
        entityData[this.bp.checkName(filter.signal.name)] = {
          type: filter.signal.type,
        };
      }

      constants[parseInt(filter.index) - 1] = {
        name: this.bp.checkName(filter.signal.name),
        count: filter.count || 0,
      };
    });

    return constants;
  }

  parseTrainControlBehavior(data: any) {
    if (!data.control_behavior) return {};

    const controlBehavior = data.control_behavior;
    const keys = [
      'circuit_enable_disable',
      'read_from_train',
      'read_stopped_train',
      'train_stopped_signal',
      'set_trains_limit',
      'trains_limit_signal',
      'read_trains_count',
      'trains_count_signal',
    ];

    const out: Record<string, any> = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (controlBehavior[key] != undefined) {
        out[key] = controlBehavior[key];
      }
    }

    return out;
  }

  ////////////////
  ////////////////
  ////////////////

  // Sets values in BP (tile data, parses connections).
  // Typically, when loading from an existing blueprint, all entities are creating at the same time,
  // and then all are placed at the same time (so each entity can parse the connections of the others)
  place(positionGrid: PositionGrid, entityList: any[]) {
    this.setTileData(positionGrid);
    this.parseConnections(entityList);
    return this;
  }

  // Remove entity from blueprint
  remove() {
    return this.bp.removeEntity(this);
  }

  // Cleans up tile data after removing
  removeCleanup(positionGrid: PositionGrid) {
    this.removeTileData(positionGrid);
    return this;
  }

  // Quick corner/center positions
  topLeft() {
    return this.position.clone();
  }
  topRight() {
    return this.position
      .clone()
      .add(this.size.clone().multiply(new Victor(1, 0)));
  }
  bottomRight() {
    return this.position.clone().add(this.size);
  }
  bottomLeft() {
    return this.position
      .clone()
      .add(this.size.clone().multiply(new Victor(0, 1)));
  }
  center() {
    return this.position
      .clone()
      .add(this.size.clone().divide(new Victor(2, 2)));
  }

  // Adds self to grid array
  setTileData(positionGrid: PositionGrid) {
    this.tileDataAction(
      positionGrid,
      (x, y) => (positionGrid[x + ',' + y] = this),
    );
    return this;
  }

  // Removes self from grid array
  removeTileData(positionGrid: PositionGrid) {
    this.tileDataAction(
      positionGrid,
      (x, y) => delete positionGrid[x + ',' + y],
    );
    return this;
  }

  // Return true if this entity overlaps with no other
  checkNoOverlap(positionGrid: PositionGrid) {
    const ent = this.getOverlap(positionGrid);

    if (!ent) return true;

    if (
      (this.name == 'gate' && ent.name == 'straight_rail') ||
      (ent.name == 'gate' && this.name == 'straight_rail')
    )
      return true;

    return false;
  }

  // Returns an item this entity overlaps with (or null)
  getOverlap(positionGrid: PositionGrid): Entity | null {
    let item: Entity | null = null;
    this.tileDataAction(positionGrid, (x, y) => {
      item = positionGrid[x + ',' + y] || item;
    });
    return item;
  }

  // Do an action on every tile that this entity overlaps in a given positionGrid
  tileDataAction(
    positionGrid: PositionGrid,
    fn: (x: number, y: number) => void,
  ) {
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
  connect(
    ent: Entity,
    mySide: Side = 1,
    theirSide: Side = 1,
    color: Color = 'red',
  ) {
    mySide = convertSide(mySide, this);
    theirSide = convertSide(theirSide, ent);

    const checkCombinator = (name: string) => {
      return name == 'decider_combinator' || name == 'arithmetic_combinator';
    };

    color = color == 'green' ? color : 'red';

    this.connections.push({
      entity: ent,
      color: color,
      side: mySide,
      id: checkCombinator(ent.name) ? theirSide.toString() : undefined,
    });
    ent.connections.push({
      entity: this,
      color: color,
      side: theirSide,
      id: checkCombinator(this.name) ? mySide.toString() : undefined,
    });
    return this;
  }

  // Remove a specific wire connection given all details
  removeConnection(
    ent: Entity,
    mySide: Side = 1,
    theirSide: Side = 1,
    color: Color = 'red',
  ) {
    mySide = convertSide(mySide, this);
    theirSide = convertSide(theirSide, ent);
    color = color || 'red';

    for (let i = 0; i < this.connections.length; i++) {
      if (
        this.connections[i].entity == ent &&
        this.connections[i].side == mySide &&
        this.connections[i].color == color
      ) {
        this.connections.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < ent.connections.length; i++) {
      if (
        ent.connections[i].entity == this &&
        ent.connections[i].side == theirSide &&
        ent.connections[i].color == color
      ) {
        ent.connections.splice(i, 1);
        break;
      }
    }
    return this;
  }

  // Remove all wire connections with entity (optionally of a specific color)
  removeConnectionsWithEntity(ent: Entity, color: Color) {
    for (let i = this.connections.length - 1; i >= 0; i--) {
      if (
        this.connections[i].entity == ent &&
        (!color || this.connections[i].color == color)
      )
        this.connections.splice(i, 1);
    }

    for (let i = ent.connections.length - 1; i >= 0; i--) {
      if (
        ent.connections[i].entity == this &&
        (!color || ent.connections[i].color == color)
      )
        ent.connections.splice(i, 1);
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

  setFilter(pos: number, name: string) {
    if (pos < 0) throw new Error('Filter index cannot be less than 0!');
    name = this.bp.checkName(name);
    if (name == null) delete this.filters[pos];
    else this.filters[pos] = name;
    return this;
  }

  setRequestFilter(pos: number, name: string, count: number) {
    if (pos < 0) throw new Error('Filter index cannot be less than 0!');
    name = this.bp.checkName(name);
    if (name == null) delete this.requestFilters[pos];
    else
      this.requestFilters[pos] = {
        name,
        count,
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

  // Sets condition of entity (for combinators)
  setCondition(opt: CombinatorData) {
    if (opt.countFromInput != undefined && this.name != 'decider_combinator')
      throw new Error('Cannot set countFromInput for ' + this.name);
    else if (opt.readMode && opt.readMode != 'pulse' && opt.readMode != 'hold')
      throw new Error('readMode in a condition must be "pulse" or "hold"!');
    else if (
      this.name == 'arithmetic_combinator' &&
      (opt.left == 'signal_everything' ||
        opt.out == 'signal_everything' ||
        opt.left == 'signal_anything' ||
        opt.out == 'signal_anything')
    )
      throw new Error(
        'Only comparitive conditions can contain signal_everything or signal_anything. Instead use signal_each',
      );
    else if (opt.out == 'signal_each' && opt.left != 'signal_each')
      throw new Error(
        'Left condition must be signal_each for output to be signal_each.' +
          (this.name != 'arithmetic_combinator'
            ? ' Use signal_everything for the output instead'
            : ''),
      );

    if (opt.left) opt.left = this.bp.checkName(opt.left);
    if (typeof opt.right == 'string') opt.right = this.bp.checkName(opt.right);
    if (opt.out) opt.out = this.bp.checkName(opt.out);

    if (!this.condition) this.condition = {};
    this.condition = {
      left: this.condition.left || opt.left,
      right: this.condition.right || opt.right,
      operator: this.condition.operator || opt.operator,
      countFromInput: this.condition.countFromInput || opt.countFromInput,
      out: this.condition.out || opt.out,

      controlEnable: this.condition.controlEnable || opt.controlEnable, // circuit_enable_disable, true/false
      readContents: this.condition.readContents || opt.readContents, // circuit_read_hand_contents, true/false
      readMode: this.condition.readMode || opt.readMode, // circuit_contents_read_mode, 0 or 1
    };
    return this;
  }

  // Sets direction of entity
  setDirection(dir: number) {
    // if (this.direction == null) return this; // Prevent rotation when we know what things can rotate in defaultentities.js
    this.size = new Victor(
      dir % 4 == this.direction % 4 ? this.size.x : this.size.y,
      dir % 4 == this.direction % 4 ? this.size.y : this.size.x,
    );
    this.direction = dir;
    return this;
  }

  setDirectionType(type: DirectionType) {
    if (!this.HAS_DIRECTION_TYPE)
      throw new Error(
        'This type of item does not have a directionType! Usually only underground belts have these.',
      );
    this.directionType = type;

    return this;
  }

  setRecipe(recipe: string) {
    if (!this.CAN_HAVE_RECIPE)
      throw new Error('This entity cannot have a recipe.');
    this.recipe = this.bp.checkName(recipe);

    return this;
  }

  setBar(num: number) {
    if (!this.INVENTORY_SIZE)
      throw new Error('Only entities with inventories can have bars!');
    else if (typeof num == 'number' && num < 0)
      throw new Error('You must provide a positive value to setBar()');
    this.bar = typeof num != 'number' || num >= this.INVENTORY_SIZE ? -1 : num;

    return this;
  }

  setCircuitParameters(obj: any) {
    if (!this.circuitParameters) this.circuitParameters = {};
    Object.keys(obj).forEach((key) => (this.circuitParameters[key] = obj[key]));

    return this;
  }

  setParameters(obj: any) {
    if (!this.parameters) this.parameters = {};
    Object.keys(obj).forEach((key) => (this.parameters[key] = obj[key]));

    return this;
  }

  setAlertParameters(opt: AlertParameters) {
    if (!this.alertParameters) this.alertParameters = {};

    Object.keys(opt).forEach(
      // @ts-ignore
      (key: keyof AlertParameters) => (this.alertParameters[key] = opt[key]),
    );

    return this;
  }

  setConstant(pos: number, name: string, count: number) {
    if (this.name != 'constant_combinator')
      throw new Error('Can only set constants for constant combinators!');
    else if (pos < 0 || pos >= 18)
      throw new Error(
        pos + ' is an invalid position (must be between 0 and 17 inclusive)',
      );

    if (!this.constants) {
      this.constants = {};
    }

    if (!name) delete this.constants[pos];
    else
      this.constants[pos] = {
        name: this.bp.checkName(name),
        count: count == undefined ? 0 : count,
      };

    return this;
  }

  setStationName(name: string) {
    this.stationName = name;
    return this;
  }

  setManualTrainsLimit(limit: number) {
    this.manualTrainsLimit = limit;
    return this;
  }

  setSplitterFilter(name: string) {
    this.splitterFilter = name;
    return this;
  }

  setInputPriority(priority?: Priority) {
    this.inputPriority = priority;
    return this;
  }

  setOutputPriority(priority?: Priority) {
    this.outputPriority = priority;
    return this;
  }

  getData() {
    const useValueOrDefault = (val: any, def: any) =>
      val != undefined ? val : def;

    const getOptionData = (append: any = {}) => {
      if (!this.condition) return append;

      append.circuit_enable_disable = this.condition.controlEnable;
      append.circuit_read_hand_contents = this.condition.readContents;
      append.circuit_contents_read_mode =
        this.condition.readMode != undefined
          ? this.condition.readMode == 'pulse'
            ? 0
            : 1
          : undefined;

      return append;
    };

    const getCondition = () => {
      // let key = this.name == 'arithmetic_combinator' ? 'arithmetic' : (this.name == 'decider_combinator' ? 'decider' : 'circuit');
      const out: any = {};

      out.first_signal = this.condition.left
        ? {
            type: entityData[this.condition.left].type,
            name: this.condition.left.replace(/_/g, '-'),
          }
        : undefined;
      out.second_signal =
        typeof this.condition.right == 'string'
          ? {
              type: entityData[this.condition.right].type,
              name: this.condition.right.replace(/_/g, '-'),
            }
          : undefined;
      out.constant =
        typeof this.condition.right == 'number'
          ? this.condition.right
          : undefined;
      out.operation = undefined;
      out.comparator = undefined;
      out.output_signal = this.condition.out
        ? {
            type: entityData[this.condition.out].type,
            name: this.condition.out.replace(/_/g, '-'),
          }
        : undefined;

      if (this.name != 'arithmetic_combinator') {
        out.comparator = this.condition.operator;
        out.copy_count_from_input =
          this.condition.countFromInput != undefined
            ? (!!this.condition.countFromInput).toString()
            : undefined;
      } else {
        out.operation = this.condition.operator;
      }
      return out;
    };

    const getAlertParameters = ({
      showAlert = false,
      showOnMap = true,
      message = '',
      icon = undefined,
    }: AlertParameters) => {
      if (icon) {
        // Allow shorthand (icon name only) by
        // looking up type
        if (typeof icon === 'string') {
          icon = {
            type: entityData[icon].type || '',
            name: icon.replace(/_/g, '-'),
          };
        } else {
          icon = {
            type: icon.type.replace(/_/g, '-'),
            name: icon.name.replace(/_/g, '-'),
          };
        }
      }
      return {
        show_alert: showAlert,
        show_on_map: showOnMap,
        alert_message: message,
        icon_signal_id: icon,
      };
    };

    return {
      name: this.bp.fixName(this.name),
      position: this.center().subtract(new Victor(0.5, 0.5)) as {
        x: number;
        y: number;
      },
      direction: this.direction || 0,
      entity_number: -1,

      type: /*this.HAS_DIRECTION_TYPE*/ this.directionType
        ? this.directionType
        : undefined,
      recipe: /*this.CAN_HAVE_RECIPE &&*/ this.recipe
        ? this.bp.fixName(this.recipe)
        : undefined,
      bar: /*this.INVENTORY_SIZE &&*/ this.bar != -1 ? this.bar : undefined,

      station: this.stationName,
      manual_trains_limit: this.manualTrainsLimit,

      filter: this.splitterFilter
        ? this.bp.fixName(this.splitterFilter)
        : undefined,
      input_priority: this.inputPriority || undefined,
      output_priority: this.outputPriority || undefined,

      items:
        /*this.CAN_HAVE_MODULES &&*/ this.modules &&
        Object.keys(this.modules).length
          ? Object.keys(this.modules).reduce(
              (obj: { [name: string]: number }, key) => {
                obj[this.bp.fixName(key)] = this.modules[key];
                return obj;
              },
              {},
            )
          : undefined,

      filters: makeEmptyArrayUndefined(
        Object.keys(this.filters).map((filterPosition: string) => {
          return {
            index: parseInt(filterPosition) + 1,
            name: this.bp.fixName(this.filters[parseInt(filterPosition)]),
          };
        }),
      ),

      request_filters: makeEmptyArrayUndefined(
        Object.keys(this.requestFilters).map((index: string) => {
          const rFilter = this.requestFilters[parseInt(index)];
          return {
            name: this.bp.fixName(rFilter.name),
            count: rFilter.count,
            index: parseInt(index) + 1,
          };
        }),
      ),

      connections:
        this.connections.length ||
        this.condition ||
        Object.keys(this.condition).length ||
        Object.keys(this.circuitParameters).length
          ? this.connections.reduce(
              (
                obj: {
                  [side: string]: {
                    [color: string]: {
                      entity_id: number;
                      circuit_id?: string;
                    }[];
                  };
                },
                connection,
              ) => {
                let side = connection.side;
                let color = connection.color;
                if (!obj[side]) obj[side] = {};
                if (!obj[side][color]) obj[side][color] = [];
                obj[side][color].push({
                  entity_id: connection.entity.id,
                  circuit_id: connection.id,
                });
                return obj;
              },
              {},
            )
          : undefined,

      neighbours: this.neighbours.map((ent) => ent.id),
      parameters: this.parameters
        ? {
            playback_volume: useValueOrDefault(this.parameters.volume, 1.0),
            playback_globally: useValueOrDefault(
              this.parameters.playGlobally,
              false,
            ),
            allow_polyphony: useValueOrDefault(
              this.parameters.allowPolyphony,
              true,
            ),
          }
        : undefined,

      alert_parameters: this.alertParameters
        ? getAlertParameters(this.alertParameters)
        : undefined,

      control_behavior:
        this.constants ||
        this.condition ||
        this.trainControlBehavior ||
        this.name == 'decider_combinator' ||
        this.name == 'arithmetic_combinator'
          ? getOptionData({
              ...this.trainControlBehavior,

              filters:
                this.constants && Object.keys(this.constants).length
                  ? Object.keys(this.constants).map((key, i) => {
                      // @ts-ignore
                      const data = this.constants[key];
                      return {
                        signal: {
                          name: this.bp.fixName(data.name),
                          type: entityData[data.name].type,
                        },
                        count: data.count != undefined ? data.count : 0,
                        index: parseInt(key) + 1,
                      };
                    })
                  : undefined,

              decider_conditions:
                this.name == 'decider_combinator' ? getCondition() : undefined,
              arithmetic_conditions:
                this.name == 'arithmetic_combinator'
                  ? getCondition()
                  : undefined,
              circuit_condition:
                !this.name.includes('combinator') && this.condition.left
                  ? getCondition()
                  : undefined,

              is_on:
                this.name == 'constant_combinator' && !this.constantEnabled
                  ? this.constantEnabled
                  : undefined,

              circuit_parameters: this.circuitParameters
                ? {
                    signal_value_is_pitch: useValueOrDefault(
                      this.circuitParameters.signalIsPitch,
                      false,
                    ),
                    instrument_id: useValueOrDefault(
                      this.circuitParameters.instrument,
                      0,
                    ),
                    note_id: useValueOrDefault(this.circuitParameters.note, 0),
                  }
                : undefined,
            })
          : undefined,
    };
  }
}

// Lib Functions

// Convert 'in' or 'out' of wires (only combinators have both of these) to a 1 or 2.
function convertSide(side: Side, ent: Entity) {
  if (!side) return 1;
  if (side == 1 || side == 2) return side;
  else if (side == 'in' || side == 'out') {
    if (
      ent &&
      ent.name != 'arithmetic_combinator' &&
      ent.name != 'decider_combinator'
    )
      return 1;
    else return side == 'in' ? 1 : 2;
  } else throw new Error('Invalid side');
}

function makeEmptyArrayUndefined(arr: any[]) {
  return arr.length ? arr : undefined;
}
