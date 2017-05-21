/**
 * Created by anth on 21.05.2017.
 */


const Blueprint = require('./index');
const util = require('./util');

exports = module.exports = (str) => {
    let obj = util.decode(str);

    const blueprints = obj.blueprint_book.blueprints;
    const dict = {};

    blueprints.forEach((blueprint) => {
        const name = blueprint.label;
        dict[name] = Blueprint(blueprint);
    });

    return dict;
};