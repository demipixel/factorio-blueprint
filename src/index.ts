'use strict';

import prettyJSON from 'prettyjson';
import Victor from 'victor';

import book from './book';
import entityData from './defaultentities';
import { generateElectricalConnections } from './electrical-connections';
import Entity from './entity';
import Tile from './tile';
import util from './util';

export default class Blueprint {
  name: string;
  description: string;
  icons: string[];
  entities: Entity[];
  tiles: Tile[];
  entityPositionGrid: { [location: string]: Entity };
  tilePositionGrid: { [location: string]: Tile };
  version: number;
  checkWithEntityData: boolean;
  snapping: { grid: Position, position?: Position, absolute?: boolean };

  constructor(data?: any, opt: BlueprintOptions = {}) {
    this.name = 'Blueprint';
    this.icons = []; // Icons for Blueprint (up to 4)
    this.entities = []; // List of all entities in Blueprint
    this.tiles = []; // List of all tiles in Blueprint (such as stone path or concrete)
    this.entityPositionGrid = {}; // Object with tile keys in format "x,y" => entity
    this.tilePositionGrid = {};
    this.version = 281479273971713; // Factorio version 1.1.35
    this.checkWithEntityData =
      opt.checkWithEntityData != undefined ? opt.checkWithEntityData : true; // make sure checkName() validates with entityData
    if (data) this.load(data, opt);
  }

  // All entities in beautiful string format
  toString(opt: ToObjectOpt) {
    this.setIds();
    return prettyJSON.render(this.toObject(opt).blueprint, {
      noAlign: true,
      numberColor: 'magenta',
    });
  }

  // Load blueprint from an existing one
  load(data: any, opt: BlueprintOptions = { fixEntityData: false }) {
    if (typeof data === 'string') {
      const version = data.slice(0, 1);
      if (version !== '0') {
        throw new Error('Cannot find decoder for blueprint version ' + version);
      }
      data = util.decode[version](data);
    }
    return this.fillFromObject(data, opt);
  }

  static test(str) {
    const version = str.slice(0, 1);
    return util.decode[version](str);
  }

  fillFromObject(data: any, opt: BlueprintLoadOptions) {
    if (data.hasOwnProperty('blueprint')) data = data.blueprint;

    if (!data.tiles) data.tiles = [];
    if (!data.entities) data.entities = [];
    if (!data.icons) data.icons = [];

    this.name = data.label;
    this.description = data.description;
    this.version = data.version;

    data.entities.forEach((entity: any) => {
      if (opt.fixEntityData) {
        const data: any = {};
        data[this.jsName(entity.name)] = { type: 'item', width: 1, height: 1 };
        Blueprint.setEntityData(data);
      }
      this.createEntityWithData(entity, opt.allowOverlap || false, true, true); // no overlap (unless option allows it), place altogether later, positions are their center
    });
    this.entities.forEach((entity) => {
      entity.place(this.entityPositionGrid, this.entities);
    });

    data.tiles.forEach((tile: any) => {
      this.createTile(tile.name, tile.position);
    });

    this.icons = [];
    data.icons.forEach((icon: any) => {
      this.icons[icon.index - 1] = this.checkName(icon.signal.name);
    });

    if (data['snap-to-grid']) {
      this.setSnapping(data['snap-to-grid'], data['absolute-snapping'], data['position-relative-to-grid']);
    }

    this.setIds();

    return this;
  }

  placeBlueprint(
    bp: Blueprint,
    position: Position,
    rotations: number,
    allowOverlap: boolean,
  ) {
    // rotations is 0, 1, 2, 3 or any of the Blueprint.ROTATION_* constants.
    const entitiesCreated: Entity[] = [];
    bp.entities.forEach((ent) => {
      const data = ent.getData();

      data.direction += (rotations || 0) * 2;
      // data.direction += 8;
      data.direction %= 8;

      if (rotations == 3)
        data.position = { x: data.position.y, y: -data.position.x };
      else if (rotations == 2)
        data.position = { x: -data.position.x, y: -data.position.y };
      else if (rotations == 1)
        data.position = { x: -data.position.y, y: data.position.x };

      data.position.x += position.x;
      data.position.y += position.y;

      entitiesCreated.push(
        this.createEntityWithData(data, allowOverlap, true, true),
      );
    });

    entitiesCreated.forEach((e) => {
      e.place(this.entityPositionGrid, entitiesCreated);
    });

    bp.tiles.forEach((tile) => {
      const data = tile.getData();

      if (rotations == 3)
        data.position = { x: data.position.y, y: -data.position.x };
      else if (rotations == 2)
        data.position = { x: -data.position.x, y: -data.position.y };
      else if (rotations == 1)
        data.position = { x: -data.position.y, y: data.position.x };

      data.position.x += position.x;
      data.position.y += position.y;

      this.createTileWithData(data);
    });

    return this;
  }

  // Create an entity!
  createEntity(
    name: string,
    position: Position,
    direction?: number,
    allowOverlap?: boolean,
    noPlace?: boolean,
    center?: boolean,
  ) {
    return this.createEntityWithData(
      {
        name: name,
        position: position,
        direction: direction || 0,
      },
      allowOverlap,
      noPlace,
      center,
    );
    // Need to add to defaultentities.js whether something is rotatable. If not, set direction to null.
  }

  // Creates an entity with a data object instead of paramaters
  createEntityWithData(
    data: any,
    allowOverlap?: boolean,
    noPlace?: boolean,
    center?: boolean,
  ) {
    const ent = new Entity(data, this, center);
    if (allowOverlap || ent.checkNoOverlap(this.entityPositionGrid)) {
      if (!noPlace) ent.place(this.entityPositionGrid, this.entities);
      this.entities.push(ent);
      return ent;
    } else {
      const otherEnt = ent.getOverlap(this.entityPositionGrid);
      throw new Error(
        'Entity ' +
        data.name +
        ' overlaps ' +
        // @ts-ignore
        otherEnt.name +
        ' entity (' +
        data.position.x +
        ', ' +
        data.position.y +
        ')',
      );
    }
  }

  createTile(name: string, position: Position) {
    return this.createTileWithData({ name: name, position: position });
  }

  createTileWithData(data: any) {
    const tile = new Tile(data, this);
    if (this.tilePositionGrid[data.position.x + ',' + data.position.y])
      this.removeTile(
        this.tilePositionGrid[data.position.x + ',' + data.position.y],
      );

    this.tilePositionGrid[data.position.x + ',' + data.position.y] = tile;
    this.tiles.push(tile);
    return tile;
  }

  // Returns entity at a position (or null)
  findEntity(pos: Position) {
    return this.entityPositionGrid[Math.floor(pos.x) + ',' + pos.y] || null;
  }

  findTile(pos: Position) {
    return this.tilePositionGrid[Math.floor(pos.x) + ',' + pos.y] || null;
  }

  // Removes a specific entity
  removeEntity(ent: Entity) {
    if (!ent) return false;
    else {
      ent.removeCleanup(this.entityPositionGrid);
      const index = this.entities.indexOf(ent);
      if (index == -1) return ent;
      this.entities.splice(index, 1);
      return ent;
    }
  }

  removeTile(tile: Tile) {
    if (!tile) return false;
    else {
      const index = this.tiles.indexOf(tile);
      if (index == -1) return tile;
      this.tiles.splice(index, 1);
      return tile;
    }
  }

  // Removes an entity at a position (returns false if no entity is there)
  removeEntityAtPosition(position: Position) {
    if (!this.entityPositionGrid[position.x + ',' + position.y]) return false;
    return this.removeEntity(
      this.entityPositionGrid[position.x + ',' + position.y],
    );
  }

  removeTileAtPosition(position: Position) {
    if (!this.tilePositionGrid[position.x + ',' + position.y]) return false;
    return this.removeTile(
      this.tilePositionGrid[position.x + ',' + position.y],
    );
  }

  // Set ids for entities, called in toJSON()
  setIds() {
    this.entities.forEach((entity, i) => {
      entity.id = i + 1;
    });
    this.tiles.forEach((tile, i) => {
      tile.id = i + 1;
    });
    return this;
  }

  setSnapping(size: Position, absolute?: boolean, absolutePosition?: Position) {
    this.snapping = {
      grid: size,
      absolute: absolute,
      position: absolutePosition,
    }
  }

  // Get corner/center positions
  getPosition(
    f: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
    xcomp: Math['min'] | Math['max'],
    ycomp: Math['min'] | Math['max'],
  ) {
    if (!this.entities.length) return new Victor(0, 0);
    return new Victor(
      this.entities.reduce(
        (best, ent) => xcomp(best, ent[f]().x),
        this.entities[0][f]().x,
      ),
      this.entities.reduce(
        (best, ent) => ycomp(best, ent[f]().y),
        this.entities[0][f]().y,
      ),
    );
  }

  center() {
    return new Victor(
      (this.topLeft().x + this.topRight().x) / 2,
      (this.topLeft().y + this.bottomLeft().y) / 2,
    );
  }
  topLeft() {
    return this.getPosition('topLeft', Math.min, Math.min);
  }
  topRight() {
    return this.getPosition('topRight', Math.max, Math.min);
  }
  bottomLeft() {
    return this.getPosition('bottomLeft', Math.min, Math.max);
  }
  bottomRight() {
    return this.getPosition('bottomRight', Math.max, Math.max);
  }

  // Center all entities
  fixCenter(aroundPoint?: Position) {
    if (!this.entities.length) return this;

    let offsetX = aroundPoint
      ? -aroundPoint.x
      : -Math.floor(this.center().x / 2) * 2;
    let offsetY = aroundPoint
      ? -aroundPoint.y
      : -Math.floor(this.center().y / 2) * 2;
    const offset = new Victor(offsetX, offsetY);
    this.entities.forEach((entity) =>
      entity.removeTileData(this.entityPositionGrid),
    );
    this.entities.forEach((entity) => {
      entity.position.add(offset);
      entity.setTileData(this.entityPositionGrid);
    });
    this.tiles.forEach(
      (tile) =>
        delete this.tilePositionGrid[tile.position.x + ',' + tile.position.y],
    );
    this.tiles.forEach((tile) => {
      tile.position.add(offset);
      this.tilePositionGrid[tile.position.x + ',' + tile.position.y] = tile;
    });
    return this;
  }

  // Quickly generate 2 (or num) icons
  generateIcons(num?: number) {
    if (!num) num = 2;
    num = Math.min(this.entities.length, Math.min(Math.max(num, 1), 4));
    for (let i = 0; i < num; i++) {
      this.icons[i] = this.entities[i].name;
      if (
        this.icons[i] === 'straight_rail' ||
        this.icons[i] === 'curved_rail'
      ) {
        this.icons[i] = 'rail';
      }
    }
    return this;
  }

  // Give luaString that gets converted by encode()
  toObject({ autoConnectPoles = true }: ToObjectOpt = {}) {
    this.setIds();
    if (!this.icons.length) this.generateIcons();
    if (autoConnectPoles) generateElectricalConnections(this);

    const entityInfo = this.entities.map((ent, i) => {
      const entData = ent.getData();

      entData.entity_number = i + 1;

      return entData;
    });
    const tileInfo = this.tiles.map((tile, i) => tile.getData());
    const iconData = this.icons
      .map((icon, i) => {
        return icon
          ? {
            signal: {
              type: entityData[icon].type || 'item',
              name: this.fixName(icon),
            },
            index: i + 1,
          }
          : null;
      })
      .filter(Boolean);

    return {
      blueprint: {
        icons: iconData,
        entities: this.entities.length ? entityInfo : undefined,
        tiles: this.tiles.length ? tileInfo : undefined,
        item: 'blueprint',
        version: this.version || 0,
        label: this.name,
        description: this.description || undefined,
        "absolute-snapping": this.snapping ? this.snapping.absolute : undefined,
        "snap-to-grid": this.snapping ? this.snapping.grid : undefined,
        "position-relative-to-grid": this.snapping ? this.snapping.position : undefined
      },
    };
  }

  toJSON(opt: ToObjectOpt = {}) {
    return JSON.stringify(this.toObject(opt));
  }

  // Blueprint string! Yay!
  encode(opt?: EncodeOpt) {
    return util.encode[opt?.version || 'latest'](this.toObject(opt || {}));
  }

  // Set entityData
  static setEntityData(obj: any) {
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
    return 0;
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

  static get ROTATION_NONE() {
    return 0;
  }

  static get ROTATION_90_CW() {
    return 1;
  }

  static get ROTATION_180_CW() {
    return 2;
  }

  static get ROTATION_270_CW() {
    return 3;
  }

  static get ROTATION_270_CCW() {
    return this.ROTATION_90_CW;
  }

  static get ROTATION_180_CCW() {
    return this.ROTATION_180_CW;
  }

  static get ROTATION_90_CCW() {
    return this.ROTATION_270_CW;
  }

  checkName(name: string) {
    name = this.jsName(name);
    if (!entityData[name] && this.checkWithEntityData)
      throw new Error(
        name + ' does not exist! You can add it by putting it into entityData.',
      );
    return name;
  }

  jsName(name: string) {
    return typeof name == 'string' ? name.replace(/-/g, '_') : name;
  }

  fixName(name: string) {
    return name.replace(/_/g, '-');
  }

  static getBook(str: string, opt?: BlueprintOptions) {
    return getBook(str, opt);
  }

  static toBook(
    blueprints: (Blueprint | undefined | null)[],
    activeIndex = 0,
    opt?: EncodeOpt,
  ) {
    return toBook(blueprints, activeIndex, opt);
  }

  static isBook(str: string) {
    return isBook(str);
  }
}

function getBook(str: string, opt?: BlueprintOptions) {
  return book(str, opt);
}

function toBook(
  blueprints: (Blueprint | undefined | null)[],
  activeIndex = 0,
  opt: EncodeOpt = {},
): string {
  const obj = {
    blueprint_book: {
      blueprints: blueprints
        .map((bp, index) => (bp ? { ...bp.toObject(opt), index } : null))
        .filter(Boolean),
      item: 'blueprint-book',
      active_index: activeIndex,
      version: 0,
    },
  };

  return util.encode[opt?.version || 'latest'](obj);
}

function isBook(str: string): boolean {
  const version = str.slice(0, 1);
  if (version !== '0') {
    throw new Error('No decoder found for blueprint book version ' + version);
  }
  let obj = util.decode[version](str);

  return typeof obj.blueprint_book === 'object';
}

type Version = '0' | 'latest';
interface Position {
  x: number;
  y: number;
}

interface BlueprintLoadOptions {
  fixEntityData?: boolean;
  allowOverlap?: boolean;
}

export interface BlueprintOptions extends BlueprintLoadOptions {
  checkWithEntityData?: boolean; // Should we validate enitity names with entityData? Default true
}

interface EncodeOpt extends ToObjectOpt {
  version?: Version;
}

interface ToObjectOpt {
  autoConnectPoles?: boolean;
}
