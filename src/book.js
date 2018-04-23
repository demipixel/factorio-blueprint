/**
 * Created by anth on 21.05.2017.
 */


const Blueprint = require('./index');
const util = require('./util');

module.exports = (str, opt = {}) => {
  const version = str.slice(0, 1);
  let obj = util.decode[version](str);

  const blueprints = obj.blueprint_book.blueprints;
  const blueprintList = [];

  blueprints.forEach((blueprint) => {
    blueprint = blueprint.blueprint;
    blueprintList.push(new Blueprint(blueprint, opt));
  });

  return blueprintList;
};
