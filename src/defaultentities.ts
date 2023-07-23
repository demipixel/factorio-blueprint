enum Type {
  Fluid = 'fluid',
  Item = 'item',
  Virtual = 'virtual',
  Tile = 'tile',
  Recipe = 'recipe',
}

export interface EntityDescription {
  type?: string;
  width?: number;
  height?: number;

  parameters?: boolean;
  alertParameters?: boolean;

  inventorySize?: number;
  directionType?: boolean;
  filterAmount?: boolean;
  combinator?: boolean;
  modules?: number;
  recipe?: boolean;
  maxElectricReach?: number;
}

const DEFAULT_ENTITIES: { [entity_name: string]: EntityDescription } = {
  // ADD MORE (vanilla) AS YOU PLEASE (or modded if it's just for you)!
  // Somebody will probably automate the gathering of this data soon...

  programmable_speaker: {
    type: Type.Item,
    width: 1,
    height: 1,

    parameters: true,
    alertParameters: true,
  },

  heat_exchanger: {
    type: Type.Item,
    width: 3,
    height: 2,
  },

  heat_pipe: {
    type: Type.Item,
    width: 1,
    height: 1,
  },

  nuclear_reactor: {
    type: Type.Item,
    width: 5,
    height: 5,
  },

  centrifuge: {
    type: Type.Item,
    width: 3,
    height: 3,
  },

  steam_turbine: {
    type: Type.Item,
    width: 3,
    height: 5,
  },

  tank: {
    type: Type.Item,
  },
  car: {
    type: Type.Item,
  },
  cargo_wagon: {
    type: Type.Item,
    inventorySize: 40,
  },
  fluid_wagon: {
    type: Type.Item,
  },
  locomotive: {
    type: Type.Item,
  },

  light_armor: {
    type: Type.Item,
  },
  heavy_armor: {
    type: Type.Item,
  },
  modular_armor: {
    type: Type.Item,
  },
  grenade: {
    type: Type.Item,
  },
  cluster_grenade: {
    type: Type.Item,
  },
  flamethrower: {
    type: Type.Item,
  },
  flamethrower_ammo: {
    type: Type.Item,
  },
  rocket_launcher: {
    type: Type.Item,
  },
  rocket: {
    type: Type.Item,
  },
  explosive_rocket: {
    type: Type.Item,
  },
  atomic_bomb: {
    type: Type.Item,
  },
  combat_shotgun: {
    type: Type.Item,
  },
  shotgun: {
    type: Type.Item,
  },
  shotgun_shell: {
    type: Type.Item,
  },
  piercing_shotgun_shell: {
    type: Type.Item,
  },
  submachine_gun: {
    type: Type.Item,
  },
  pistol: {
    type: Type.Item,
  },
  firearm_magazine: {
    type: Type.Item,
  },
  piercing_rounds_magazine: {
    type: Type.Item,
  },
  uranium_rounds_magazine: {
    type: Type.Item,
  },
  cannon_shell: {
    type: Type.Item,
  },
  explosive_cannon_shell: {
    type: Type.Item,
  },
  uranium_cannon_shell: {
    type: Type.Item,
  },
  explosive_uranium_cannon_shell: {
    type: Type.Item,
  },

  power_armor: {
    type: Type.Item,
  },
  power_armor_mk2: {
    type: Type.Item,
  },
  energy_shield_equipment: {
    type: Type.Item,
  },
  energy_shield_mk2_equipment: {
    type: Type.Item,
  },
  solar_panel_equipment: {
    type: Type.Item,
  },
  fusion_reactor_equipment: {
    type: Type.Item,
  },
  battery_equipment: {
    type: Type.Item,
  },
  battery_mk2_equipment: {
    type: Type.Item,
  },
  personal_laser_defense_equipment: {
    type: Type.Item,
  },
  discharge_defense_equipment: {
    type: Type.Item,
  },
  exoskeleton_equipment: {
    type: Type.Item,
  },
  personal_roboport_equipment: {
    type: Type.Item,
  },
  personal_roboport_mk2_equipment: {
    type: Type.Item,
  },
  night_vision_equipment: {
    type: Type.Item,
  },

  discharge_defense_remote: {
    type: Type.Item,
  },
  destroyer_capsule: {
    type: Type.Item,
  },
  distractor_capsule: {
    type: Type.Item,
  },
  defender_capsule: {
    type: Type.Item,
  },
  slowdown_capsule: {
    type: Type.Item,
  },
  poison_capsule: {
    type: Type.Item,
  },

  stone: {
    type: Type.Item,
  },

  solid_fuel: {
    type: Type.Item,
  },

  stone_brick: {
    type: Type.Item,
  },

  stone_path: {
    type: Type.Tile,
  },
  landfill: {
    type: Type.Tile,
  },
  concrete: {
    type: Type.Tile,
  },
  hazard_concrete: {
    type: Type.Item,
  },
  hazard_concrete_left: {
    type: Type.Tile,
  },
  hazard_concrete_right: {
    type: Type.Tile,
  },
  refined_concrete: {
    type: Type.Tile,
  },
  refined_hazard_concrete: {
    type: Type.Item,
  },
  refined_hazard_concrete_left: {
    type: Type.Tile,
  },
  refined_hazard_concrete_right: {
    type: Type.Tile,
  },

  iron_axe: {
    type: Type.Item,
  },
  steel_axe: {
    type: Type.Item,
  },
  repair_pack: {
    type: Type.Item,
  },
  blueprint: {
    type: Type.Item,
  },
  deconstruction_planner: {
    type: Type.Item,
  },
  blueprint_book: {
    type: Type.Item,
  },

  copper_cable: {
    type: Type.Item,
  },
  red_wire: {
    type: Type.Item,
  },
  green_wire: {
    type: Type.Item,
  },

  beacon: {
    type: Type.Item,
    width: 3,
    height: 3,

    modules: 2,
  },
  small_electric_pole: {
    type: Type.Item,
    width: 1,
    height: 1,
    maxElectricReach: 7.5,
  },
  medium_electric_pole: {
    type: Type.Item,
    width: 1,
    height: 1,
    maxElectricReach: 9,
  },
  substation: {
    type: Type.Item,
    width: 2,
    height: 2,
    maxElectricReach: 18,
  },
  big_electric_pole: {
    type: Type.Item,
    width: 2,
    height: 2,
    maxElectricReach: 30,
  },
  offshore_pump: {
    type: Type.Item,
    width: 2,
    height: 2,
  },
  small_lamp: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  solar_panel: {
    type: Type.Item,
    width: 3,
    height: 3,
  },
  arithmetic_combinator: {
    type: Type.Item,
    width: 1,
    height: 2,
  },
  decider_combinator: {
    type: Type.Item,
    width: 1,
    height: 2,
  },
  constant_combinator: {
    type: Type.Item,
    width: 1,
    height: 1,
  },

  splitter: {
    // Default position is facing north, 2 wide and 1 high for all splitters.
    type: Type.Item,
    width: 2,
    height: 1,
  },
  fast_splitter: {
    type: Type.Item,
    width: 2,
    height: 1,
  },
  express_splitter: {
    type: Type.Item,
    width: 2,
    height: 1,
  },
  transport_belt: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  fast_transport_belt: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  express_transport_belt: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  underground_belt: {
    type: Type.Item,
    width: 1,
    height: 1,
    directionType: true,
  },
  fast_underground_belt: {
    type: Type.Item,
    width: 1,
    height: 1,
    directionType: true,
  },
  express_underground_belt: {
    type: Type.Item,
    width: 1,
    height: 1,
    directionType: true,
  },
  assembling_machine_1: {
    type: Type.Item,
    width: 3,
    height: 3,
    recipe: true,
  },
  assembling_machine_2: {
    type: Type.Item,
    width: 3,
    height: 3,

    recipe: true,
    modules: 2,
  },
  assembling_machine_3: {
    type: Type.Item,
    width: 3,
    height: 3,

    recipe: true,
    modules: 4,
  },
  wooden_chest: {
    type: Type.Item,
    width: 1,
    height: 1,

    inventorySize: 16,
  },
  iron_chest: {
    type: Type.Item,
    width: 1,
    height: 1,

    inventorySize: 32,
  },
  steel_chest: {
    type: Type.Item,
    width: 1,
    height: 1,
    inventorySize: 48,
  },
  logistic_chest_passive_provider: {
    type: Type.Item,
    width: 1,
    height: 1,
    inventorySize: 48,
  },
  logistic_chest_active_provider: {
    type: Type.Item,
    width: 1,
    height: 1,
    inventorySize: 48,
  },
  logistic_chest_storage: {
    type: Type.Item,
    width: 1,
    height: 1,
    inventorySize: 48,
  },
  logistic_chest_requester: {
    type: Type.Item,
    width: 1,
    height: 1,
    inventorySize: 48,
  },
  logistic_chest_buffer: {
    type: Type.Item,
    width: 1,
    height: 1,
    inventorySize: 48,
  },
  storage_tank: {
    type: Type.Item,
    width: 3,
    height: 3,
  },
  burner_inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  long_handed_inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  fast_inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  filter_inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
    filterAmount: false,
  },
  stack_inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  stack_filter_inserter: {
    type: Type.Item,
    width: 1,
    height: 1,
    filterAmount: false,
  },
  gate: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  stone_wall: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  radar: {
    type: Type.Item,
    width: 3,
    height: 3,
  },
  rail: {
    type: Type.Item,
  },
  straight_rail: {
    type: Type.Item,
    width: 2,
    height: 2,
  },
  curved_rail: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  // Lets figure out curved rails later. (1 curved rail deconstructs to 4 straight rails)
  land_mine: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  train_stop: {
    // pretty sure this is a 1.2x1.2 centered in a 2x2 square.
    type: Type.Item,
    width: 2,
    height: 2,
  },
  rail_signal: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  rail_chain_signal: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  lab: {
    type: Type.Item,
    width: 3,
    height: 3,

    modules: 2,
  },
  rocket_silo: {
    type: Type.Item,
    width: 9,
    height: 10, //unsure about these values, got them from code only (never counted it in game, but 10 sounds right.)

    modules: 4,
  },
  chemical_plant: {
    type: Type.Item,
    width: 3,
    height: 3,

    modules: 3,
  },
  oil_refinery: {
    type: Type.Item,
    width: 5,
    height: 5,

    modules: 3,
  },
  stone_furnace: {
    type: Type.Item,
    width: 2,
    height: 2,
  },
  steel_furnace: {
    type: Type.Item,
    width: 2,
    height: 2,
  },
  electric_furnace: {
    type: Type.Item,
    width: 3,
    height: 3,

    modules: 2,
  },
  pumpjack: {
    type: Type.Item,
    width: 3,
    height: 3,
  },
  burner_mining_drill: {
    type: Type.Item,
    width: 2,
    height: 2,
  },

  electric_mining_drill: {
    type: Type.Item,
    width: 3,
    height: 3,

    modules: 3,
  },
  pump: {
    type: Type.Item,
    width: 1,
    height: 2,
  },
  pipe: {
    type: Type.Item,
    width: 1,
    height: 1,
  },
  pipe_to_ground: {
    type: Type.Item,
    width: 1,
    height: 1,
  },

  electronic_circuit: {
    type: Type.Item,
  },
  advanced_circuit: {
    type: Type.Item,
  },

  boiler: {
    type: Type.Item,
    width: 3,
    height: 2,
  },
  steam_engine: {
    type: Type.Item,
    width: 5,
    height: 3,
  },
  accumulator: {
    type: Type.Item,
    width: 2,
    height: 2,
  },

  roboport: {
    type: Type.Item,
    width: 4,
    height: 4,
  },
  construction_robot: {
    type: Type.Item,
  },
  logistic_robot: {
    type: Type.Item,
  },
  power_switch: {
    type: Type.Item,
    width: 3,
    height: 3,
  },

  gun_turret: {
    type: Type.Item,
    width: 2,
    height: 2,
  },
  artillery_turret: {
    type: Type.Item,
    width: 3,
    height: 3,
  },
  laser_turret: {
    type: Type.Item,
    width: 2,
    height: 2,
  },
  flamethrower_turret: {
    type: Type.Item,
    width: 2,
    height: 3,
  },

  productivity_module: {
    type: Type.Item,
  },
  productivity_module_2: {
    type: Type.Item,
  },
  productivity_module_3: {
    type: Type.Item,
  },
  effectivity_module: {
    type: Type.Item,
  },
  effectivity_module_2: {
    type: Type.Item,
  },
  effectivity_module_3: {
    type: Type.Item,
  },
  speed_module: {
    type: Type.Item,
  },
  speed_module_2: {
    type: Type.Item,
  },
  speed_module_3: {
    type: Type.Item,
  },

  water: {
    type: Type.Fluid,
  },
  crude_oil: {
    type: Type.Fluid,
  },
  petroleum_gas: {
    type: Type.Fluid,
  },
  heavy_oil: {
    type: Type.Fluid,
  },
  light_oil: {
    type: Type.Fluid,
  },
  sulfuric_acid: {
    type: Type.Fluid,
  },
  lubricant: {
    type: Type.Fluid,
  },
  steam: {
    type: Type.Fluid,
  },

  basic_oil_processing: {
    type: Type.Recipe,
  },
  advanced_oil_processing: {
    type: Type.Recipe,
  },
  heavy_oil_cracking: {
    type: Type.Recipe,
  },
  light_oil_cracking: {
    type: Type.Recipe,
  },
  coal_liquefaction: {
    type: Type.Recipe,
  },

  raw_fish: {
    type: Type.Item,
  },
  wood: {
    type: Type.Item,
  },
  raw_wood: {
    type: Type.Item,
  },
  iron_ore: {
    type: Type.Item,
  },
  iron_plate: {
    type: Type.Item,
  },
  copper_ore: {
    type: Type.Item,
  },
  copper_plate: {
    type: Type.Item,
  },
  steel_plate: {
    type: Type.Item,
  },
  coal: {
    type: Type.Item,
  },
  uranium_ore: {
    type: Type.Item,
  },
  plastic_bar: {
    type: Type.Item,
  },
  sulfur: {
    type: Type.Item,
  },

  crude_oil_barrel: {
    type: Type.Item,
  },
  heavy_oil_barrel: {
    type: Type.Item,
  },
  light_oil_barrel: {
    type: Type.Item,
  },
  lubricant_barrel: {
    type: Type.Item,
  },
  petroleum_gas_barrel: {
    type: Type.Item,
  },
  sulfuric_acid_barrel: {
    type: Type.Item,
  },
  water_barrel: {
    type: Type.Item,
  },
  empty_barrel: {
    type: Type.Item,
  },

  processing_unit: {
    type: Type.Item,
  },

  engine_unit: {
    type: Type.Item,
  },

  electric_engine_unit: {
    type: Type.Item,
  },

  battery: {
    type: Type.Item,
  },

  explosives: {
    type: Type.Item,
  },
  flying_robot_frame: {
    type: Type.Item,
  },
  low_density_structure: {
    type: Type.Item,
  },
  rocket_fuel: {
    type: Type.Item,
  },
  rocket_control_unit: {
    type: Type.Item,
  },
  satellite: {
    type: Type.Item,
  },
  uranium_235: {
    type: Type.Item,
  },
  uranium_238: {
    type: Type.Item,
  },

  uranium_fuel_cell: {
    type: Type.Item,
  },
  used_up_uranium_fuel_cell: {
    type: Type.Item,
  },
  science_pack_1: {
    type: Type.Item,
  },
  science_pack_2: {
    type: Type.Item,
  },
  science_pack_3: {
    type: Type.Item,
  },
  military_science_pack: {
    type: Type.Item,
  },
  production_science_pack: {
    type: Type.Item,
  },
  high_tech_science_pack: {
    type: Type.Item,
  },
  space_science_pack: {
    type: Type.Item,
  },

  iron_stick: {
    type: Type.Item,
  },
  iron_gear_wheel: {
    type: Type.Item,
  },

  signal_anything: {
    type: Type.Virtual,
    combinator: true,
  },
  signal_each: {
    type: Type.Virtual,
    combinator: true,
  },
  signal_everything: {
    type: Type.Virtual,
    combinator: true,
  },
  signal_0: {
    type: Type.Virtual,
  },
  signal_1: {
    type: Type.Virtual,
  },
  signal_2: {
    type: Type.Virtual,
  },
  signal_3: {
    type: Type.Virtual,
  },
  signal_4: {
    type: Type.Virtual,
  },
  signal_5: {
    type: Type.Virtual,
  },
  signal_6: {
    type: Type.Virtual,
  },
  signal_7: {
    type: Type.Virtual,
  },
  signal_8: {
    type: Type.Virtual,
  },
  signal_9: {
    type: Type.Virtual,
  },
  signal_A: {
    type: Type.Virtual,
  },
  signal_B: {
    type: Type.Virtual,
  },
  signal_C: {
    type: Type.Virtual,
  },
  signal_D: {
    type: Type.Virtual,
  },
  signal_E: {
    type: Type.Virtual,
  },
  signal_F: {
    type: Type.Virtual,
  },
  signal_G: {
    type: Type.Virtual,
  },
  signal_H: {
    type: Type.Virtual,
  },
  signal_I: {
    type: Type.Virtual,
  },
  signal_J: {
    type: Type.Virtual,
  },
  signal_K: {
    type: Type.Virtual,
  },
  signal_L: {
    type: Type.Virtual,
  },
  signal_M: {
    type: Type.Virtual,
  },
  signal_N: {
    type: Type.Virtual,
  },
  signal_O: {
    type: Type.Virtual,
  },
  signal_P: {
    type: Type.Virtual,
  },
  signal_Q: {
    type: Type.Virtual,
  },
  signal_R: {
    type: Type.Virtual,
  },
  signal_S: {
    type: Type.Virtual,
  },
  signal_T: {
    type: Type.Virtual,
  },
  signal_U: {
    type: Type.Virtual,
  },
  signal_V: {
    type: Type.Virtual,
  },
  signal_W: {
    type: Type.Virtual,
  },
  signal_X: {
    type: Type.Virtual,
  },
  signal_Y: {
    type: Type.Virtual,
  },
  signal_Z: {
    type: Type.Virtual,
  },

  signal_blue: {
    type: Type.Virtual,
  },
  signal_red: {
    type: Type.Virtual,
  },
  signal_green: {
    type: Type.Virtual,
  },
  signal_yellow: {
    type: Type.Virtual,
  },
  signal_cyan: {
    type: Type.Virtual,
  },
  signal_pink: {
    type: Type.Virtual,
  },
  signal_white: {
    type: Type.Virtual,
  },
  signal_grey: {
    type: Type.Virtual,
  },
  signal_black: {
    type: Type.Virtual,
  },
};

export default DEFAULT_ENTITIES;
