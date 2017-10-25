const fluid = 'fluid';
const item = 'item';
const virtual = 'virtual';
const tile = 'tile'
const recipe = 'recipe';


module.exports = { // ADD MORE (vanilla) AS YOU PLEASE (or modded if it's just for you)! 
                   // Somebody will probably automate the gathering of this data soon...

  programmable_speaker: {
    type: item,
    width: 1,
    height: 1,


    parameters: true,
    alertParameters: true
  },

  heat_exchanger: {
    type: item,
    width: 3,
    height: 2
  },

  heat_pipe: {
    type: item,
    width: 1,
    height: 1
  },

  nuclear_reactor: {
    type: item,
    width: 5,
    height: 5
  },

  centrifuge: {
    type: item,
    width: 3,
    height: 3
  },

  steam_turbine: {
    type: item,
    width: 3,
    height: 5
  },

  tank: {
    type: item
  },
  car: {
    type: item
  },
  cargo_wagon: {
    type: item,
    inventorySize: 40
  },
  fluid_wagon: {
    type: item,
  },
  locomotive: {
    type: item
  },

  light_armor: {
    type: item
  },
  heavy_armor: {
    type: item
  },
  modular_armor: {
    type: item
  },
  grenade: {
    type: item
  },
  cluster_grenade: {
    type: item
  },
  flamethrower: {
    type: item
  },
  flamethrower_ammo: {
    type: item
  },
  rocket_launcher: {
    type: item
  },
  rocket: {
    type: item
  },
  explosive_rocket: {
    type: item
  },
  atomic_bomb: {
    type: item
  },
  combat_shotgun: {
    type: item
  },
  shotgun: {
    type: item
  },
  shotgun_shell: {
    type: item
  },
  piercing_shotgun_shell: {
    type: item
  },
  submachine_gun: {
    type: item
  },
  pistol: {
    type: item
  },
  firearm_magazine: {
    type: item
  },
  piercing_rounds_magazine: {
    type: item
  },
  uranium_rounds_magazine: {
    type: item
  },
  cannon_shell: {
    type: item
  },
  explosive_cannon_shell: {
    type: item
  },
  uranium_cannon_shell: {
    type: item
  },
  explosive_uranium_cannon_shell: {
    type: item
  },

  power_armor: {
    type: item
  },
  power_armor_mk2: {
    type: item
  },
  energy_shield_equipment: {
    type: item
  },
  energy_shield_mk2_equipment: {
    type: item
  },
  solar_panel_equipment: {
    type: item
  },
  fusion_reactor_equipment: {
    type: item
  },
  battery_equipment: {
    type: item
  },
  battery_mk2_equipment: {
    type: item
  },
  personal_laser_defense_equipment: {
    type: item
  },
  discharge_defense_equipment: {
    type: item
  },
  exoskeleton_equipment: {
    type: item
  },
  personal_roboport_equipment: {
    type: item
  },
  personal_roboport_mk2_equipment: {
    type: item
  },
  night_vision_equipment: {
    type: item
  },

  discharge_defense_remote: {
    type: item
  },
  destroyer_capsule: {
    type: item
  },
  distractor_capsule: {
    type: item
  },
  defender_capsule: {
    type: item
  },
  slowdown_capsule: {
    type: item
  },
  poison_capsule: {
    type: item
  },

  
  
  stone: {
    type: item
  },
  
  solid_fuel: {
    type: item
  },
  
  stone_brick: {
    type: item
  },

  stone_path: {
    type: tile
  },
  landfill: {
    type: item
  },
  concrete: {
    type: tile
  },
  hazard_concrete: {
    type: item
  },
  hazard_concrete_left: {
    type: tile
  },
  hazard_concrete_right: {
    type: tile
  },

  iron_axe: {
    type: item
  },
  steel_axe: {
    type: item
  },
  repair_pack: {
    type: item
  },
  blueprint: {
    type: item
  },
  deconstruction_planner: {
    type: item
  },
  blueprint_book: {
    type: item
  },

  copper_cable: {
    type: item
  },
  red_wire: {
    type: item
  },
  green_wire: {
    type: item
  },

  beacon: {
    type: item,
    width: 3,
    height: 3,

    modules: 2
  },
  small_electric_pole: {
    type: item,
    width: 1,
    height: 1
  },
  medium_electric_pole: {
    type: item,
    width: 1,
    height: 1
  },
  substation: {
    type: item,
    width: 2,
    height: 2
  },
  big_electric_pole: {
    type: item,
    width: 2,
    height: 2
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
  constant_combinator: {
    type: item,
    width: 1,
    height: 1
  },

  splitter: { // Default position is facing north, 2 wide and 1 high for all splitters.
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
  transport_belt: {
    type: item,
    width: 1,
    height: 1
  },
  fast_transport_belt: {
    type: item,
    width: 1,
    height: 1
  },
  express_transport_belt: {
    type: item,
    width: 1,
    height: 1
  },
  underground_belt: {
    type: item,
    width: 1,
    height: 1,
    directionType: true
  },
  fast_underground_belt: {
    type: item,
    width: 1,
    height: 1,
    directionType: true
  },
  express_underground_belt: {
    type: item,
    width: 1,
    height: 1,
    directionType: true
  },
  assembling_machine_1: {
    type: item,
    width: 3,
    height: 3,
    recipe: true
  },
  assembling_machine_2: {
    type: item,
    width: 3,
    height: 3,

    recipe: true,
    modules: 2
  },
  assembling_machine_3: {
    type: item,
    width: 3,
    height: 3,

    recipe: true,
    modules: 4
  },
  wooden_chest: {
    type: item,
    width: 1,
    height: 1,

    inventorySize: 16
  },
  iron_chest: {
    type: item,
    width: 1,
    height: 1,

    inventorySize: 32
  },
  steel_chest: {
    type: item,
    width: 1,
    height: 1,
    inventorySize: 48
  },
  logistic_chest_passive_provider: {
    type: item,
    width: 1,
    height: 1,
    inventorySize: 48
  },
  logistic_chest_active_provider: {
    type: item,
    width: 1,
    height: 1,
    inventorySize: 48
  },
  logistic_chest_storage: {
    type: item,
    width: 1,
    height: 1,
    inventorySize: 48
  },
  logistic_chest_requester: {
    type: item,
    width: 1,
    height: 1,
    inventorySize: 48
  },
  storage_tank: {
    type: item,
    width: 3,
    height: 3
  },
  burner_inserter: {
    type: item,
    width: 1,
    height: 1
  },
  inserter: {
    type: item,
    width: 1,
    height: 1
  },
  long_handed_inserter: {
    type: item,
    width: 1,
    height: 1
  },
  fast_inserter: {
    type: item,
    width: 1,
    height: 1
  },
  filter_inserter: {
    type: item,
    width: 1,
    height: 1,
    filterAmount: false
  },
  stack_inserter: {
    type: item,
    width: 1,
    height: 1,
  },
  stack_filter_inserter: {
    type: item,
    width: 1,
    height: 1,
    filterAmount: false
  },
  gate: {
    type: item,
    width: 1,
    height: 1
  },
  stone_wall: {
    type: item,
    width: 1,
    height: 1
  },
  radar: {
    type: item,
    width: 3,
    height: 3
  },
  rail: {
    type: item
  },
  straight_rail: {
    type: item,
    width: 2,
    height: 2
  },
  curved_rail: {
    type: item,
    width: 1,
    height: 1
  },
  // Lets figure out curved rails later. (1 curved rail deconstructs to 4 straight rails)
  land_mine: {
    type: item,
    width: 1,
    height: 1
  },
  train_stop: { // pretty sure this is a 1.2x1.2 centered in a 2x2 square.
    type: item,
    width: 2,
    height: 2
  },
  rail_signal: {
    type: item,
    width: 1,
    height: 1
  },
  rail_chain_signal: {
    type: item,
    width: 1,
    height: 1
  },
  lab: {
    type: item,
    width: 3,
    height: 3,

    modules: 2
  },
  rocket_silo: {
    type: item,
    width: 9,
    height: 10, //unsure about these values, got them from code only (never counted it in game, but 10 sounds right.)

    modules: 4
  },
  chemical_plant: {
    type: item,
    width: 3,
    height: 3,

    modules: 3
  },
  oil_refinery: {
    type: item,
    width: 5,
    height: 5,

    modules: 3
  },
  stone_furnace: {
    type: item,
    width: 2,
    height: 2
  },
  steel_furnace: {
    type: item,
    width: 2,
    height: 2
  },
  electric_furnace: {
    type: item,
    width: 3,
    height: 3,

    modules: 2
  },
  pumpjack: {
    type: item,
    width: 3,
    height: 3
  },
  burner_mining_drill: {
    type: item,
    width: 2,
    height: 2
  },
  
  electric_mining_drill: {
    type: item,
    width: 3,
    height: 3,

    modules: 3
  },
  pump: {
    type: item,
    width: 1,
    height: 2
  },
  pipe: {
    type: item,
    width: 1,
    height: 1
  },
  pipe_to_ground: {
    type: item,
    width: 1,
    height: 1
  },

  electronic_circuit: {
    type: item
  },
  advanced_circuit: {
    type: item
  },


  boiler: {
    type: item,
    width: 1,
    height: 1
  },
  steam_engine: {
    type: item,
    width: 5,
    height: 3
  },
  accumulator: {
    type: item,
    width: 2,
    height: 2
  },

  roboport: {
    type: item,
    width: 4,
    height: 4
  },
  construction_robot: {
    type: item
  },
  logistic_robot: {
    type: item
  },
  power_switch: {
    type: item,
    width: 3,
    height: 3
  },

  gun_turret: {
    type: item,
    width: 2,
    height: 2
  },
  laser_turret: {
    type: item,
    width: 2,
    height: 2
  },
  flamethrower_turret: {
    type: item,
    width: 2,
    height: 3
  },


  productivity_module: {
    type: item
  },
  productivity_module_2: {
    type: item
  },
  productivity_module_3: {
    type: item
  },
  effectivity_module: {
    type: item
  },
  effectivity_module_2: {
    type: item
  },
  effectivity_module_3: {
    type: item
  },
  speed_module: {
    type: item
  },
  speed_module_2: {
    type: item
  },
  speed_module_3: {
    type: item
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
  heavy_oil: {
    type: fluid
  },
  light_oil: {
    type: fluid
  },
  sulfuric_acid: {
    type: fluid
  },
  lubricant: {
    type: fluid
  },
  steam: {
    type: fluid
  },

  advanced_oil_processing: {
    type: recipe
  },

  raw_fish: {
    type: item
  },
  wood: {
    type: item
  },
  raw_wood: {
    type: item
  },
  iron_ore: {
    type: item
  },
  iron_plate: {
    type: item
  },
  copper_ore: {
    type: item
  },
  copper_plate: {
    type: item
  },
  steel_plate: {
    type: item
  },
  coal: {
    type: item
  },
  uranium_ore: {
    type: item
  },
  plastic_bar: {
    type: item
  },
  sulfur: {
    type: item
  },

  crude_oil_barrel: {
    type: item
  },
  heavy_oil_barrel: {
    type: item
  },
  light_oil_barrel: {
    type: item
  },
  lubricant_barrel: {
    type: item
  },
  petroleum_gas_barrel: {
    type: item
  },
  sulfuric_acid_barrel: {
    type: item
  },
  water_barrel: {
    type: item
  },
  empty_barrel: {
    type: item
  },

  processing_unit: {
    type: item
  },

  engine_unit: {
    type: item
  },

  electric_engine_unit: {
    type: item
  },

  battery: {
    type: item
  },

  explosives: {
    type: item
  },
  flying_robot_frame: {
    type: item
  },
  low_density_structure: {
    type: item
  },
  rocket_fuel: {
    type: item
  },
  rocket_control_unit: {
    type: item
  },
  satellite: {
    type: item
  },
  uranium_235: {
    type: item
  },
  uranium_238: {
    type: item
  },

  uranium_fuel_cell: {
    type: item
  },
  used_up_uranium_fuel_cell: {
    type: item
  },
  science_pack_1: {
    type: item
  },
  science_pack_2: {
    type: item
  },
  science_pack_3: {
    type: item
  },
  military_science_pack: {
    type: item
  },
  production_science_pack: {
    type: item
  },
  high_tech_science_pack: {
    type: item
  },
  space_science_pack: {
    type: item
  },

  iron_stick: {
    type: item
  },
  iron_gear_wheel: {
    type: item
  },
  

  signal_anything: {
    type: virtual,
    combinator: true
  },
  signal_each: {
    type: virtual,
    combinator: true
  },
  signal_everything: {
    type: virtual,
    combinator: true
  },
  signal_0: {
    type: virtual
  },
  signal_1: {
    type: virtual
  },
  signal_2: {
    type: virtual
  },
  signal_3: {
    type: virtual
  },
  signal_4: {
    type: virtual
  },
  signal_5: {
    type: virtual
  },
  signal_6: {
    type: virtual
  },
  signal_7: {
    type: virtual
  },
  signal_8: {
    type: virtual
  },
  signal_9: {
    type: virtual
  },
  signal_A: {
    type: virtual
  },
  signal_B: {
    type: virtual
  },
  signal_C: {
    type: virtual
  },
  signal_D: {
    type: virtual
  },
  signal_E: {
    type: virtual
  },
  signal_F: {
    type: virtual
  },
  signal_G: {
    type: virtual
  },
  signal_H: {
    type: virtual
  },
  signal_I: {
    type: virtual
  },
  signal_J: {
    type: virtual
  },
  signal_K: {
    type: virtual
  },
  signal_L: {
    type: virtual
  },
  signal_M: {
    type: virtual
  },
  signal_N: {
    type: virtual
  },
  signal_O: {
    type: virtual
  },
  signal_P: {
    type: virtual
  },
  signal_Q: {
    type: virtual
  },
  signal_R: {
    type: virtual
  },
  signal_S: {
    type: virtual
  },
  signal_T: {
    type: virtual
  },
  signal_U: {
    type: virtual
  },
  signal_V: {
    type: virtual
  },
  signal_W: {
    type: virtual
  },
  signal_X: {
    type: virtual
  },
  signal_Y: {
    type: virtual
  },
  signal_Z: {
    type: virtual
  },

  signal_blue: {
    type: virtual
  },
  signal_red: {
    type: virtual
  },
  signal_green: {
    type: virtual
  },
  signal_yellow: {
    type: virtual
  },
  signal_cyan: {
    type: virtual
  },
  signal_pink: {
    type: virtual
  },
  signal_white: {
    type: virtual
  },
  signal_grey: {
    type: virtual
  },
  signal_black: {
    type: virtual
  }
};
