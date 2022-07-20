import Victor from 'victor';

import entityData from './defaultentities';
import Blueprint from './index';

export default class Tile {
  id: number;
  bp: Blueprint;
  name: string;
  position: Victor;

  constructor(data: any, bp: Blueprint) {
    this.id = -1;
    this.bp = bp;
    this.name = this.bp.checkName(data.name);
    if (
      !data.position ||
      data.position.x == undefined ||
      data.position.y == undefined
    )
      throw new Error('Invalid position provided: ' + data.position);
    this.position = Victor.fromObject(data.position);
  }

  remove() {
    return this.bp.removeTile(this);
  }

  getData() {
    return {
      name: this.bp.fixName(this.name),
      position: this.position as { x: number; y: number },
    };
  }
}
