const Victor = require('victor');

module.exports = function(entityData) {
  class Tile {

    constructor(data, bp) {
      this.id = -1;
      this.bp = bp;
      this.name = this.bp.checkName(data.name);
      if (!data.position || data.position.x == undefined || data.position.y == undefined) throw new Error('Invalid position provided: '+data.position)
      this.position = Victor.fromObject(data.position);
    }

    remove() {
      return this.bp.removeTile(this);
    }

    getData() {
      return {
        name: this.bp.fixName(this.name),
        position: this.position
      };
    }

  }

  return Tile;
}