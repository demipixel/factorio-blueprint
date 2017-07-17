/**
 * Created by anth on 21.05.2017.
 */


const Blueprint = require('./index');
const util = require('./util');

exports = module.exports = (str,opt) => {
    let obj = util.decode(str);

    const blueprints = obj.blueprint_book.blueprints;
    const blueprintList = [];

    blueprints.forEach((blueprint) => {
        blueprint = blueprint.blueprint;
        blueprintList.push(new Blueprint(blueprint,opt));
    });

    return blueprintList;
};
