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
  
  basic_underground_belt: {
    type: item,
    width: 1,
    height: 1
  },
  fast_underground_belt: {
    type: item,
    width: 1,
    height: 1
  },
  express_underground_belt: {
    type: item,
    width: 1,
    height: 1
  },
  basic_splitter: { // Default position is facing north, 2 wide and 1 high for all splitters.
    type: item,
    width: 2,
    height: 1
  },
  fast_splitter: {
    type: item,
    width: 2,
    height: 1
  },
  express_splitter: {
    type: item,
    width: 2,
    height: 1
  },
  basic_transport_belt: {
    type: item,
    width: 1,
    height: 1
  },
  fast_transport_belt: {
    type:item,
    width:1,
    height:1
  },
  express_transport_belt: {
    type:item,
    width:1,
    height:1
  },
  assembling_machine_1: {
    type:item,
    width:3,
    height:3
  },
  assembling_machine_2: {
    type:item,
    width:3,
    height:3
  },
  assembling_machine_3: {
    type:item,
    width:3,
    height:3
  },
  iron_chest: {
    type:item,
    width:1,
    height:1
  },
  steel_chest: {
    type:item,
    width:1,
    height:1
  },
  smart_chest: {
    type:item,
    width:1,
    height:1
  },
  logistic_chest_passive_provider: {
    type:item,
    width:1,
    height:1
  },
  logistic_chest_active_provider: {
    type:item,
    width:1,
    height:1
  },
  logistic_chest_storage: {
    type:item,
    width:1,
    height:1
  },
  logistic_chest_requester: {
    type:item,
    width:1,
    height:1
  },
  long_handed_inserter: {
    type:item,
    width:1,
    height:1
  },
  fast_inserter: {
    type:item,
    width:1,
    height:1
  },
  smart_inserter: {
    type:item,
    width:1,
    height:1
  },
  gate: {
    type:item,
    width:1,
    height:1
  },
  wall: {
    type:item,
    width:1,
    height:1
  },
  straight_rail: {
    type:item,
    width:2,
    height:2
  },
  curved_rail: {
    type:item,
    width:1,
    height:1
  },
  // Lets figure out curved rails later.
  land_mine: {
    type:item,
    width:1,
    height:1
  },
  train_station: { // pretty sure this is a 1.2x1.2 centered in a 2x2 square.
    type:item,
    width:2,
    height:2
  },
  lab: {
    type:item,
    width:3,
    height:3
  },
  rocket_silo: {
    type:item,
    width:10,
    height:10 //unsure about these values, got them from code only (never counted it in game, but 10 sounds right.)
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
