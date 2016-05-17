var fluid = 'fluid';
var item = 'item';
var virtual = 'virtual';

module.exports = { // ADD MORE (vanilla) AS YOU PLEASE (or modded if it's just for you)! 
                   // Somebody will probably automate the gathering of this data soon...

  basic_armor: {
    type: item
  },
  'basic_bullet_magazine': {
    type: item
  },
  'heavy_armor':{
    type: item
  },


  medium_electric_pole: {
    type: item,
    width: 1,
    height: 1
  },
  offshore_pump: {
    type: item,
    width: 2,
    height: 2
  },
  small_lamp: {
    type: item,
    width: 1,
    height: 1
  },
  solar_panel: {
    type: item,
    width: 3,
    height: 3
  },
  arithmetic_combinator: {
    type: item,
    width: 1,
    height: 2
  },
  decider_combinator: {
    type: item,
    width: 1,
    height: 2
  },

  water: {
    type: fluid
  },
  crude_oil: {
    type: fluid
  },
  petroleum_gas: {
    type: fluid
  },
  sulfuric_acid: {
    type: fluid
  },
  lubricant: {
    type: fluid
  },

  signal_anything: {
    type: virtual
  },
  signal_each: {
    type: virtual
  },
  signal_everything: {
    type: virtual
  }
};