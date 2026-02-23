// Blood & Crowns Force Builder - Game Data
// Based on Blood & Crowns rulebook

const BC_DATA = {

  // ============================================================
  // STANDARD LEADERS
  // ============================================================
  standardLeaders: {
    magnate: {
      id: "magnate",
      name: "Magnate",
      cost: 11,
      shoot: "-/5",
      melee: "5/5",
      resolve: 4,
      commandPoints: 2,
      commandRange: '8"',
      retinueSize: "3-6",
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      specialRules: ["Prize"],
      upgrades: [
        { id: "destriers", name: "Destriers or Coursers", type: "model", costPerModel: 5, description: "Retinue gains Mounted, Heavy Cavalry, and Impetuous" },
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "Armor upgrade" },
        { id: "full_harness", name: "Full Harness", type: "unit", cost: 10, description: "Armor upgrade" },
        { id: "poleaxes_leader", name: "Poleaxes", type: "unit", cost: 5, description: "Unit gains Poleaxes" },
      ]
    },
    noble: {
      id: "noble",
      name: "Noble",
      cost: 9,
      shoot: "-/5",
      melee: "5/5",
      resolve: 4,
      commandPoints: 2,
      commandRange: '6"',
      retinueSize: "3-6",
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      specialRules: ["Prize"],
      upgrades: [
        { id: "destriers", name: "Destriers or Coursers", type: "model", costPerModel: 5, description: "Retinue gains Mounted, Heavy Cavalry, and Impetuous" },
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "Armor upgrade" },
        { id: "full_harness", name: "Full Harness", type: "unit", cost: 10, description: "Armor upgrade" },
        { id: "poleaxes_leader", name: "Poleaxes", type: "unit", cost: 5, description: "Unit gains Poleaxes" },
      ]
    },
    knight_banneret: {
      id: "knight_banneret",
      name: "Knight Banneret",
      cost: 7,
      shoot: "-/5",
      melee: "5/5",
      resolve: 5,
      commandPoints: 1,
      commandRange: '6"',
      retinueSize: "3-6",
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      specialRules: ["Prize"],
      upgrades: [
        { id: "destriers", name: "Destriers or Coursers", type: "model", costPerModel: 5, description: "Retinue gains Mounted, Heavy Cavalry, and Impetuous" },
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "Armor upgrade" },
        { id: "full_harness", name: "Full Harness", type: "unit", cost: 10, description: "Armor upgrade" },
        { id: "poleaxes_leader", name: "Poleaxes", type: "unit", cost: 5, description: "Unit gains Poleaxes" },
      ]
    }
  },

  // ============================================================
  // LEGENDARY LEADERS
  // ============================================================
  legendaryLeaders: {
    edward_black_prince: {
      id: "edward_black_prince",
      name: "Edward The Black Prince",
      cost: 10,
      retinueType: "Magnate",
      specialRules: ["Prize, Great", "Commanding Presence", "Royal Banner", "Flower of Chivalry"],
      ability: "La Malheureuse Journée: When this Leader's unit is activated with The Black Prince's activation card, all enemy units must immediately take a Resolve Test.",
      factions: ["england_wales_ireland"],
      companylists: ["english_army_crecy"]
    },
    henry_v: {
      id: "henry_v",
      name: "Henry V, King of England and France",
      cost: 45,
      retinueType: "Magnate",
      specialRules: ["Prize, Great", "Royal Banner"],
      ability: "Into the Breach: Units that receive a Command Point from Henry V and perform a Charge gain Hard Chargers until the end of the action.",
      factions: ["england_wales_ireland"],
      companylists: ["english_army_agincourt"]
    },
    henry_hotspur: {
      id: "henry_hotspur",
      name: "Henry 'Hotspur' Percy",
      cost: 10,
      retinueType: "Noble",
      specialRules: ["Prize"],
      ability: "Hotspur: A Company led by Henry Percy's Company loses the faction ability 'For England and Saint George!', but his retinue and any Heavy Cavalry unit within his command range gain the Counter Charge special rule.",
      factions: ["england_wales_ireland"],
      companylists: ["english_army_scotland"]
    },
    geoffroi_de_charny: {
      id: "geoffroi_de_charny",
      name: "Geoffroi de Charny",
      cost: 20,
      retinueType: "Noble",
      specialRules: ["Prize, Great"],
      ability: "Bearer of the Oriflamme: A Company led by Geoffroi cannot include a Banner Bearer. Instead, Geoffroi may carry the Oriflamme with no additional cost, granting him Very Inspiring. Chevalier de l'Étoile: Has Stubborn and Stalwart special rules.",
      factions: ["france"],
      companylists: ["french_army_crecy"]
    },
    bertrand_du_guesclin: {
      id: "bertrand_du_guesclin",
      name: "Bertrand du Guesclin",
      cost: 15,
      retinueType: "Noble",
      specialRules: ["Prize"],
      ability: "Fabian Strategy: This Leader and friendly units within his command range may always Fall Back even if Shaken. The Eagle of Brittany: Once per game during setup he may designate one enemy unit as the target of his Hatred.",
      factions: ["france"],
      companylists: ["french_army_crecy"]
    },
    joan_of_arc: {
      id: "joan_of_arc",
      name: "Joan of Arc",
      cost: 30,
      retinueType: "Noble",
      specialRules: ["Prize", "Martyr", "Force of Will (Queen)"],
      ability: "Shed No Blood: Joan does not add a die when her retinue conducts a Melee Attack. Instead she has the Inspiring special rule.",
      factions: ["france"],
      companylists: ["french_army_orleans"]
    },
    james_douglas: {
      id: "james_douglas",
      name: "James Douglas, 2nd Earl of Douglas",
      cost: 15,
      retinueType: "Noble",
      specialRules: ["Prize", "Ruthless", "Chevauchée"],
      ability: "Black Douglas: Friendly units within command range and line of sight gain Hatred (English) for the duration of this activation.",
      factions: ["scotland"],
      companylists: ["scottish_wars_independence", "scottish_raiders", "scottish_1419"]
    },
    robert_the_bruce: {
      id: "robert_the_bruce",
      name: "Robert the Bruce, King of Scotland",
      cost: 25,
      retinueType: "Magnate",
      specialRules: ["Prize, Great", "Royal Banner"],
      ability: "Favored Axe: Roll separately with +1 (max 10). Natural 1 breaks the axe. 'The Scottis Fay': When activated with a King card, all friendly units gain War Cry until end of activation.",
      factions: ["scotland"],
      companylists: ["scottish_wars_independence"]
    },
    john_stewart_darnley: {
      id: "john_stewart_darnley",
      name: "John Stewart of Darnley",
      cost: 15,
      retinueType: "Noble",
      specialRules: ["Prize"],
      ability: "Avant Darnley!: His retinue may perform three Move actions during activation. Constable of the Scots: May replace one Vanguard unit with a Reserve unit.",
      factions: ["scotland"],
      companylists: ["scottish_1419"]
    },
    pedro_de_castilla: {
      id: "pedro_de_castilla",
      name: "Pedro de Castilla",
      cost: 10,
      retinueType: "Magnate",
      specialRules: ["Royal Banner"],
      ability: "Indebted: Once per game, after spending a Favor, may cancel all results and the Favor is returned. El Justo o El Cruel: When Pedro eliminates a Prize roll 1d10 to determine special effect.",
      factions: ["spanish_kingdoms"],
      companylists: ["forces_pedro"]
    },
    enrique_de_trastamara: {
      id: "enrique_de_trastamara",
      name: "Enrique de Trastámara",
      cost: 20,
      retinueType: "Magnate",
      specialRules: ["Royal Banner"],
      ability: "French Advisor: May replace one guard model with Bertrand du Guesclin for free (Fabian Strategy and Prize). Fratricida: If Pedro de Castilla is eliminated, he is not captured, earns 1 Renown.",
      factions: ["spanish_kingdoms"],
      companylists: ["forces_enrique"]
    },
    john_crabbe: {
      id: "john_crabbe",
      name: "John Crabbe",
      cost: 20,
      retinueType: "Knight Banneret",
      specialRules: ["Wanted"],
      ability: "Lord Upon the Sea: When used as Ship's Master, gains Inspiring and Master Seaman. Where the Winds Blow: For sea battles may lead any other faction. Born of the Sea: Mariners ignore Arrested.",
      factions: ["unaligned"],
      companylists: ["pirate_merchant_crew"]
    }
  },

  // ============================================================
  // UNIT PROFILES
  // ============================================================
  units: {
    // MEN-AT-ARMS
    men_at_arms_afoot: {
      id: "men_at_arms_afoot",
      name: "Men-at-Arms, Afoot",
      costPerModel: 7,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon",
      shoot: "-/6",
      melee: "6/6",
      resolve: 6,
      specialRules: [],
      upgrades: [
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "+6 pts unit upgrade" },
        { id: "poleaxes", name: "Poleaxes", type: "unit", cost: 5, description: "+5 pts, unit gains Poleaxes special rule" }
      ]
    },
    vet_men_at_arms_afoot: {
      id: "vet_men_at_arms_afoot",
      name: "Veteran Men-at-Arms, Afoot",
      costPerModel: 9,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      shoot: "-/5",
      melee: "5/5",
      resolve: 5,
      specialRules: [],
      upgrades: [
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "+6 pts unit upgrade" },
        { id: "full_harness", name: "Full Harness", type: "unit", cost: 10, description: "+10 pts unit upgrade" },
        { id: "poleaxes", name: "Poleaxes", type: "unit", cost: 5, description: "+5 pts, unit gains Poleaxes special rule" }
      ]
    },
    men_at_arms_mounted: {
      id: "men_at_arms_mounted",
      name: "Men-at-Arms, Mounted",
      costPerModel: 12,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon",
      shoot: "-/7",
      melee: "6/6",
      resolve: 6,
      specialRules: ["Heavy Cavalry", "Mounted", "Impetuous"],
      upgrades: [
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "+6 pts unit upgrade" }
      ]
    },
    vet_men_at_arms_mounted: {
      id: "vet_men_at_arms_mounted",
      name: "Veteran Men-at-Arms, Mounted",
      costPerModel: 14,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      shoot: "-/6",
      melee: "5/5",
      resolve: 5,
      specialRules: ["Heavy Cavalry", "Mounted", "Impetuous"],
      upgrades: [
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "+6 pts unit upgrade" },
        { id: "full_harness", name: "Full Harness", type: "unit", cost: 10, description: "+10 pts unit upgrade" }
      ]
    },
    esquires: {
      id: "esquires",
      name: "Esquires",
      costPerModel: 12,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Inexperienced",
      arms: "Standard Melee Weapon",
      shoot: "-/6",
      melee: "6/6",
      resolve: 5,
      specialRules: ["Heavy Cavalry", "Mounted", "Impetuous", "Glory Hounds"],
      upgrades: [
        { id: "plate_mail", name: "Plate & Mail", type: "unit", cost: 6, description: "+6 pts unit upgrade" }
      ]
    },
    // LIGHT CAVALRY
    hobelars: {
      id: "hobelars",
      name: "Hobelars",
      costPerModel: 5,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon",
      shoot: "7/8",
      melee: "7/7",
      resolve: 6,
      specialRules: ["Mounted", "Surefooted", "Defensive Reaction (Evade)", "Light Cavalry"],
      upgrades: [
        { id: "javelins", name: "Javelins", type: "unit", cost: 4, description: "+4 pts, entire unit armed with Javelins" }
      ]
    },
    jinetes: {
      id: "jinetes",
      name: "Jinetes",
      costPerModel: 6,
      minModels: 3,
      maxModels: 6,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon, Javelins",
      shoot: "7/8",
      melee: "7/8",
      resolve: 6,
      specialRules: ["Mounted", "Defensive Reaction (Evade)", "Light Cavalry", "Hit & Run"],
      upgrades: []
    },
    // ARCHERS - WAR BOW
    archers: {
      id: "archers",
      name: "Archers",
      costPerModel: 6,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon and Bow",
      shoot: "6/8",
      melee: "8/8",
      resolve: 6,
      specialRules: ["Defensive Reaction (Shoot)"],
      upgrades: []
    },
    archers_english: {
      id: "archers_english",
      name: "Archers, English",
      costPerModel: 10,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon and War Bow",
      shoot: "6/8",
      melee: "7/7",
      resolve: 6,
      specialRules: ["Arrow Storm (2)", "Defensive Reaction (Shoot)", "Ammunition (1)"],
      upgrades: [
        { id: "mounted_archers", name: "Mounted Archers", type: "model", costPerModel: 3, description: "+3 pts per model" }
      ]
    },
    archers_english_veteran: {
      id: "archers_english_veteran",
      name: "Archers, English Veteran",
      costPerModel: 12,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon and War Bow",
      shoot: "5/7",
      melee: "7/7",
      resolve: 5,
      specialRules: ["Arrow Storm (3)", "Defensive Reaction (Shoot)", "Ammunition (1)"],
      upgrades: [
        { id: "mounted_archers", name: "Mounted Archers", type: "model", costPerModel: 3, description: "+3 pts per model" }
      ]
    },
    archers_welsh: {
      id: "archers_welsh",
      name: "Archers, Welsh",
      costPerModel: 13,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon and War Bow",
      shoot: "5/8",
      melee: "7/7",
      resolve: 5,
      specialRules: ["Arrow Storm (3)", "Defensive Reaction (Shoot)", "Ammunition (1)", "Ambush"],
      upgrades: []
    },
    // CROSSBOWMEN
    crossbowmen_light: {
      id: "crossbowmen_light",
      name: "Crossbowmen, Light",
      costPerModel: 5,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon and Light Crossbow",
      shoot: "7/8",
      melee: "8/8",
      resolve: 6,
      specialRules: ["Reload (2)", "Defensive Reaction (Shoot)"],
      upgrades: [
        { id: "mounted_archers", name: "Mounted Archers", type: "model", costPerModel: 3, description: "+3 pts per model" }
      ]
    },
    crossbowmen_heavy: {
      id: "crossbowmen_heavy",
      name: "Crossbowmen, Heavy",
      costPerModel: 8,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon and Heavy Crossbow",
      shoot: "6/7",
      melee: "7/8",
      resolve: 6,
      specialRules: ["Penetrating Shot", "Reload (2)", "Defensive Reaction (Shoot)"],
      upgrades: [
        { id: "pavises", name: "Pavises", type: "unit", cost: 5, description: "+5 pts unit, gains Pavises special rule" },
        { id: "pavisiers", name: "Pavisiers", type: "special", cost: 0, description: "See Pavisiers special rule (replaces up to half models, +4 models max, 9pts each)" }
      ]
    },
    crossbowmen_genoese: {
      id: "crossbowmen_genoese",
      name: "Crossbowmen, Genoese",
      costPerModel: 9,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon and Heavy Crossbow",
      shoot: "5/7",
      melee: "7/8",
      resolve: 6,
      specialRules: ["Penetrating Shot", "Reload (2)", "Defensive Reaction (Shoot)"],
      upgrades: [
        { id: "pavises", name: "Pavises", type: "unit", cost: 5, description: "+5 pts unit, gains Pavises special rule" },
        { id: "pavisiers", name: "Pavisiers", type: "special", cost: 0, description: "See Pavisiers special rule" }
      ]
    },
    // FOOTMEN
    feudal_levy: {
      id: "feudal_levy",
      name: "Feudal Levy",
      costPerModel: 3,
      minModels: 6,
      maxModels: 12,
      experienceLevel: "Inexperienced",
      arms: "Standard Melee Weapon",
      shoot: "-/8",
      melee: "8/8",
      resolve: 7,
      specialRules: [],
      upgrades: []
    },
    footmen: {
      id: "footmen",
      name: "Footmen",
      costPerModel: 4,
      minModels: 3,
      maxModels: 12,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon",
      shoot: "-/7",
      melee: "7/7",
      resolve: 6,
      specialRules: [],
      upgrades: [
        { id: "polearms", name: "Polearms", type: "unit", cost: 5, description: "+5 pts, gain Polearms special rule" }
      ]
    },
    veteran_footmen: {
      id: "veteran_footmen",
      name: "Veteran Footmen",
      costPerModel: 6,
      minModels: 3,
      maxModels: 12,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      shoot: "-/6",
      melee: "6/6",
      resolve: 6,
      specialRules: [],
      upgrades: [
        { id: "polearms", name: "Polearms", type: "unit", cost: 5, description: "+5 pts, gain Polearms special rule" }
      ]
    },
    galloglass: {
      id: "galloglass",
      name: "Galloglass (Gallóglaigh)",
      costPerModel: 6,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      shoot: "-/7",
      melee: "5/6",
      resolve: 5,
      specialRules: ["Hard Chargers"],
      upgrades: []
    },
    kern: {
      id: "kern",
      name: "Kern (Ceithrenn)",
      costPerModel: 4,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon",
      shoot: "7/8",
      melee: "7/8",
      resolve: 6,
      specialRules: ["Defensive Reaction (Evade)", "Elusive"],
      upgrades: [
        { id: "javelin_skirmishers", name: "Javelin Skirmishers", type: "unit", cost: 4, description: "+4 pts, armed with Javelins, gains Hit & Run and Defensive Reaction (Shoot)" }
      ]
    },
    pikemen: {
      id: "pikemen",
      name: "Pikemen",
      costPerModel: 4,
      minModels: 3,
      maxModels: 12,
      experienceLevel: "Trained",
      arms: "Pike and Standard Melee Weapon",
      shoot: "-/8",
      melee: "7/7",
      resolve: 6,
      specialRules: ["Brace (2)"],
      upgrades: []
    },
    slingers: {
      id: "slingers",
      name: "Slingers",
      costPerModel: 3,
      minModels: 3,
      maxModels: 8,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon and Sling",
      shoot: "6/8",
      melee: "8/8",
      resolve: 7,
      specialRules: ["Defensive Reaction (Evade)", "Defensive Reaction (Shoot)"],
      upgrades: []
    },
    // NAVAL
    able_seamen: {
      id: "able_seamen",
      name: "Able Seamen",
      costPerModel: 4,
      minModels: 3,
      maxModels: 12,
      experienceLevel: "Veteran",
      arms: "Standard Melee Weapon",
      shoot: "7/8",
      melee: "6/7",
      resolve: 5,
      specialRules: ["Expert Sailors"],
      upgrades: [
        { id: "gads", name: "Gads", type: "unit", cost: 4, description: "+4 pts, unit armed with gads and gains Gads special rule" }
      ]
    },
    mariners: {
      id: "mariners",
      name: "Mariners",
      costPerModel: 3,
      minModels: 3,
      maxModels: 12,
      experienceLevel: "Trained",
      arms: "Standard Melee Weapon",
      shoot: "7/8",
      melee: "7/8",
      resolve: 5,
      specialRules: ["Sailors", "Arrested"],
      upgrades: [
        { id: "gads", name: "Gads", type: "unit", cost: 4, description: "+4 pts, unit armed with gads and gains Gads special rule" }
      ]
    },
    ships_boys: {
      id: "ships_boys",
      name: "Ship's Boys",
      costPerModel: 3,
      minModels: 3,
      maxModels: 12,
      experienceLevel: "Inexperienced",
      arms: "Standard Melee Weapon",
      shoot: "7/7",
      melee: "9/9",
      resolve: 6,
      specialRules: ["Sailors", "Arrested"],
      upgrades: [
        { id: "gads", name: "Gads", type: "unit", cost: 4, description: "+4 pts, unit armed with gads and gains Gads special rule" }
      ]
    }
  },

  // ============================================================
  // CHARACTERS
  // ============================================================
  characters: {
    banner_bearer: {
      id: "banner_bearer",
      name: "Banner Bearer",
      cost: 7,
      restrictions: "Retinues Only, Max 1 per Company",
      specialRules: ["Inspiring", "Banner"],
      commandPoints: 0,
      commandRange: null
    },
    grizzled_veteran: {
      id: "grizzled_veteran",
      name: "Grizzled Veteran",
      cost: 9,
      restrictions: "Max 1 per 100 Force Points",
      specialRules: ["Tough", "Battle Hardened"],
      commandPoints: 0,
      commandRange: null
    },
    knight_bachelor: {
      id: "knight_bachelor",
      name: "Knight Bachelor",
      cost: 5,
      restrictions: "May be added to any non-retinue unit, Max 1 per Company",
      specialRules: ["Prize", "Prowess"],
      commandPoints: 0,
      commandRange: null
    },
    musician: {
      id: "musician",
      name: "Musician",
      cost: 3,
      restrictions: "Retinues Only, Max 1 per Company",
      specialRules: ["Unit does not need LoS to Retinue to receive Command Points. Command Range doubled."],
      commandPoints: 0,
      commandRange: null
    },
    ships_constable: {
      id: "ships_constable",
      name: "Ship's Constable",
      cost: 3,
      restrictions: "Mariners and Able Seamen only, Sea Battles Only, Maximum 1 per each Ship in the Company",
      specialRules: ["Ship's Master"],
      commandPoints: 1,
      commandRange: '4"'
    },
    vintenar: {
      id: "vintenar",
      name: "Vintenar",
      cost: 5,
      restrictions: "May be added to any unit armed with bows, war bows, or crossbows. Max 1 per Company.",
      specialRules: ["Wanted", "Specialist (Archery)"],
      commandPoints: 1,
      commandRange: '6"'
    }
  },

  // ============================================================
  // FACTIONS
  // ============================================================
  factions: {
    england_wales_ireland: {
      id: "england_wales_ireland",
      name: "England, Wales, & Ireland",
      description: "The armies of England which included warriors from Wales and Ireland in all its major campaigns.",
      specialRules: [
        {
          name: "For England and Saint George!",
          description: "Units in this faction gain the Discipline special rule."
        },
        {
          name: "Order of the Garter",
          description: "(+5 points, Noble and Magnate Leaders Only): Leader gains the Patron (1) special rule.",
          cost: 5,
          restriction: "Noble and Magnate Leaders Only"
        }
      ],
      companyLists: ["english_army_crecy", "english_army_scotland", "english_army_agincourt"]
    },
    france: {
      id: "france",
      name: "France",
      description: "The 'most Christian kingdom' — covering a wide array of regional forces and allies.",
      specialRules: [
        {
          name: "Oriflamme",
          description: "Banner bearers in a French Company may carry the sacred Oriflamme. Doing so applies the No Quarter scenario rule."
        },
        {
          name: "Merely Peasants",
          description: "A unit with Heavy Cavalry may choose to Charge through any friendly unit that is not Engaged and is either Feudal Levy or has Mercenaries or Allies special rule."
        },
        {
          name: "Ordre de l'Étoile",
          description: "(+7 points, Standard Noble and Magnate Leaders Only): When the Leader's unit is activated, if not Engaged, it will not Fall Back if still Shaken at end of activation.",
          cost: 7,
          restriction: "Standard Noble and Magnate Leaders Only"
        }
      ],
      companyLists: ["french_army_crecy", "french_army_agincourt", "french_army_orleans"]
    },
    scotland: {
      id: "scotland",
      name: "Scotland",
      description: "The Scots played an important role in European affairs through their wars of independence and 'Auld Alliance' with France.",
      specialRules: [
        {
          name: "Schiltron",
          description: "Pikemen in Scottish companies may Brace for one fewer action. Pikemen charged by Heavy Cavalry while Braced reduce the Melee Save penalty by one (minimum zero)."
        },
        {
          name: "Guardian of Scotland",
          description: "A standard Leader may take this upgrade to gain the Inspiring special rule. If their retinue includes a Banner Bearer, the Banner gains Very Inspiring."
        }
      ],
      companyLists: ["scottish_wars_independence", "scottish_raiders", "scottish_1419"]
    },
    spanish_kingdoms: {
      id: "spanish_kingdoms",
      name: "Spanish Kingdoms",
      description: "The various kingdoms of the Iberian Peninsula, principally Castilla, Aragon, and Navarre.",
      specialRules: [
        {
          name: "Prized Mounts",
          description: "Units with the Mounted special rule add an additional 1\" to all Move actions taken as part of a Charge or while resolving a Defensive Reaction: Evade."
        },
        {
          name: "Orden de la Banda",
          description: "(+6 points): A standard Leader may take this upgrade to gain the Hard Chargers special rule.",
          cost: 6
        }
      ],
      companyLists: ["forces_pedro", "forces_enrique"]
    },
    unaligned: {
      id: "unaligned",
      name: "Unaligned",
      description: "Mercenaries, Free Companies, and pirates who fight for coin rather than crown.",
      specialRules: [
        {
          name: "No Allegiance",
          description: "The Leader's retinue in an Unaligned company may not take the Banner Bearer upgrade."
        }
      ],
      companyLists: ["free_company", "routiers", "pirate_merchant_crew"]
    }
  },

  // ============================================================
  // COMPANY LISTS
  // ============================================================
  companyLists: {
    english_army_crecy: {
      id: "english_army_crecy",
      name: "English Army in France, Crecy to Poitiers",
      subtitle: "1345-56",
      faction: "england_wales_ireland",
      availableLeaders: ["magnate", "noble", "knight_banneret", "edward_black_prince"],
      mainBattle: ["archers_english", "footmen"],
      vanguard: ["men_at_arms_afoot", "footmen_gascons", "veteran_footmen_gascons", "archers_welsh"],
      reserve: ["vet_men_at_arms_afoot", "vet_men_at_arms_mounted", "men_at_arms_mounted", "archers_english_veteran"],
      specialRules: [
        {
          name: "Chevauchée",
          description: "This Company may choose to add +2 to their roll when determining the attacker in a scenario."
        }
      ],
      notes: "*Spearmen (footmen) may not take the Polearms upgrade."
    },
    english_army_scotland: {
      id: "english_army_scotland",
      name: "English Army in Scotland",
      subtitle: "Bannockburn to Otterburn",
      faction: "england_wales_ireland",
      availableLeaders: ["magnate", "noble", "knight_banneret", "henry_hotspur"],
      mainBattle: ["footmen", "pikemen", "archers"],
      vanguard: ["men_at_arms_afoot", "men_at_arms_mounted", "archers_english", "archers_welsh", "hobelars"],
      reserve: ["vet_men_at_arms_afoot", "vet_men_at_arms_mounted"],
      specialRules: [
        {
          name: "Chevauchée",
          description: "This Company may choose to add +2 to their roll when determining the attacker in a scenario."
        },
        {
          name: "Hereditary Enemy",
          description: "Units in this Company have Hatred (Scottish)."
        }
      ],
      notes: "*Spearmen (footmen) may not take the Polearms upgrade."
    },
    english_army_agincourt: {
      id: "english_army_agincourt",
      name: "English Army in France, Agincourt to Orléans",
      subtitle: "1415-1444",
      faction: "england_wales_ireland",
      availableLeaders: ["magnate", "noble", "knight_banneret", "henry_v"],
      mainBattle: ["archers_english", "archers_welsh"],
      vanguard: ["men_at_arms_afoot", "archers_english_veteran", "veteran_footmen"],
      reserve: ["vet_men_at_arms_afoot", "men_at_arms_mounted", "vet_men_at_arms_mounted"],
      specialRules: [],
      notes: "**Burgundian units (Veteran Footmen Vanguard) have the Reluctant Allies special rule."
    },
    french_army_crecy: {
      id: "french_army_crecy",
      name: "French Army, Crecy to Poitiers",
      subtitle: "1345-56",
      faction: "france",
      availableLeaders: ["magnate", "noble", "knight_banneret", "bertrand_du_guesclin", "geoffroi_de_charny"],
      mainBattle: ["men_at_arms_mounted", "crossbowmen_genoese", "crossbowmen_light", "feudal_levy"],
      vanguard: ["men_at_arms_afoot", "esquires", "footmen", "veteran_footmen"],
      reserve: ["vet_men_at_arms_afoot", "vet_men_at_arms_mounted"],
      specialRules: [],
      notes: "*Genoese Crossbowmen have the Mercenaries special rule."
    },
    french_army_agincourt: {
      id: "french_army_agincourt",
      name: "French Army, Agincourt to Orléans",
      subtitle: "1415-1444",
      faction: "france",
      availableLeaders: ["magnate", "noble", "knight_banneret"],
      mainBattle: ["men_at_arms_afoot", "men_at_arms_mounted", "crossbowmen_light", "feudal_levy"],
      vanguard: ["vet_men_at_arms_afoot", "esquires", "footmen", "veteran_footmen", "crossbowmen_heavy"],
      reserve: ["vet_men_at_arms_mounted"],
      specialRules: [],
      notes: "*Burgundians (Veteran Men-at-Arms, Mounted as Vanguard) have the Reluctant Allies special rule."
    },
    french_army_orleans: {
      id: "french_army_orleans",
      name: "French Army, Orléans and Loire Campaign",
      subtitle: "1428-1429",
      faction: "france",
      availableLeaders: ["magnate", "noble", "knight_banneret", "joan_of_arc"],
      mainBattle: ["men_at_arms_afoot", "crossbowmen_heavy", "crossbowmen_light", "footmen", "feudal_levy"],
      vanguard: ["men_at_arms_mounted", "esquires", "galloglass", "archers", "vet_men_at_arms_mounted"],
      reserve: ["vet_men_at_arms_mounted", "vet_men_at_arms_afoot"],
      specialRules: [],
      notes: "*Burgundians (Veteran Men-at-Arms, Mounted as Vanguard) have the Reluctant Allies special rule."
    },
    scottish_wars_independence: {
      id: "scottish_wars_independence",
      name: "Scottish Army, Wars of Independence",
      subtitle: "",
      faction: "scotland",
      availableLeaders: ["magnate", "noble", "knight_banneret", "james_douglas", "robert_the_bruce"],
      mainBattle: ["pikemen", "galloglass", "archers"],
      vanguard: ["men_at_arms_mounted", "vet_men_at_arms_afoot", "men_at_arms_afoot"],
      reserve: ["vet_men_at_arms_mounted"],
      specialRules: [
        { name: "Hereditary Enemy", description: "Units in this Company have Hatred (English)." }
      ]
    },
    scottish_raiders: {
      id: "scottish_raiders",
      name: "Scottish Raiders",
      subtitle: "Bannockburn to Otterburn",
      faction: "scotland",
      availableLeaders: ["magnate", "noble", "knight_banneret", "james_douglas"],
      mainBattle: ["galloglass", "kern", "footmen", "archers", "pikemen"],
      vanguard: ["hobelars", "men_at_arms_mounted", "men_at_arms_afoot"],
      reserve: ["vet_men_at_arms_mounted", "vet_men_at_arms_afoot"],
      specialRules: [
        { name: "Hereditary Enemy", description: "Units in this Company have Hatred (English)." }
      ]
    },
    scottish_1419: {
      id: "scottish_1419",
      name: "Scottish Army, 1419 French Expedition",
      subtitle: "",
      faction: "scotland",
      availableLeaders: ["magnate", "noble", "knight_banneret", "james_douglas", "john_stewart_darnley"],
      mainBattle: ["galloglass", "archers", "pikemen"],
      vanguard: ["men_at_arms_mounted", "men_at_arms_afoot"],
      reserve: ["vet_men_at_arms_mounted", "vet_men_at_arms_afoot"],
      specialRules: [
        { name: "Hereditary Enemy", description: "Units in this Company have Hatred (English)." }
      ]
    },
    forces_pedro: {
      id: "forces_pedro",
      name: "Forces of Pedro de Castilla",
      subtitle: "Castilian Civil War, 1351-1369",
      faction: "spanish_kingdoms",
      availableLeaders: ["magnate", "noble", "knight_banneret", "pedro_de_castilla"],
      mainBattle: ["men_at_arms_afoot", "footmen", "crossbowmen_light"],
      vanguard: ["vet_men_at_arms_afoot", "men_at_arms_mounted", "veteran_footmen", "archers_english"],
      reserve: ["vet_men_at_arms_mounted", "archers_english_veteran"],
      specialRules: [],
      notes: "*Spearmen may not take the Polearms upgrade. **English units have the Mercenaries special rule."
    },
    forces_enrique: {
      id: "forces_enrique",
      name: "Forces of Enrique de Trastámara",
      subtitle: "Castilian Civil War, 1351-1369",
      faction: "spanish_kingdoms",
      availableLeaders: ["magnate", "noble", "knight_banneret", "enrique_de_trastamara"],
      mainBattle: ["men_at_arms_mounted", "jinetes", "footmen", "slingers", "crossbowmen_light"],
      vanguard: ["vet_men_at_arms_mounted", "men_at_arms_afoot", "veteran_footmen", "crossbowmen_heavy"],
      reserve: ["vet_men_at_arms_afoot", "men_at_arms_afoot"],
      specialRules: [],
      notes: "*Spearmen may not take Polearms upgrade. **French units have the Mercenaries special rule."
    },
    free_company: {
      id: "free_company",
      name: "Free Company",
      subtitle: "",
      faction: "unaligned",
      availableLeaders: ["noble", "knight_banneret"],
      mainBattle: ["footmen", "veteran_footmen", "crossbowmen_light"],
      vanguard: ["men_at_arms_mounted", "men_at_arms_afoot", "archers", "crossbowmen_heavy", "crossbowmen_genoese"],
      reserve: ["vet_men_at_arms_afoot", "vet_men_at_arms_mounted", "archers_english", "galloglass"],
      specialRules: [
        { name: "No Allegiance", description: "The Leader's retinue may not take the Banner Bearer upgrade." }
      ],
      notes: "*Free Companies may only include one of: Genoese Crossbowmen, English Archers, or Galloglass."
    },
    routiers: {
      id: "routiers",
      name: "Routiers",
      subtitle: "",
      faction: "unaligned",
      availableLeaders: ["knight_banneret"],
      mainBattle: ["footmen", "archers", "crossbowmen_light"],
      vanguard: ["veteran_footmen", "men_at_arms_mounted", "men_at_arms_afoot"],
      reserve: ["vet_men_at_arms_afoot", "vet_men_at_arms_mounted", "crossbowmen_heavy"],
      specialRules: [
        { name: "Profiteers", description: "All units in a Routier company have the Gold Not Glory special rule." },
        { name: "Outlaw", description: "The Leader of a Routier company gains the Wanted special rule." }
      ]
    },
    pirate_merchant_crew: {
      id: "pirate_merchant_crew",
      name: "Pirate/Merchant Crew",
      subtitle: "",
      faction: "unaligned",
      availableLeaders: ["noble", "knight_banneret", "john_crabbe"],
      mainBattle: ["mariners", "footmen", "crossbowmen_light"],
      vanguard: ["footmen", "able_seamen", "crossbowmen_heavy", "archers", "ships_boys"],
      reserve: ["men_at_arms_afoot", "vet_men_at_arms_afoot"],
      specialRules: [
        { name: "Bausans", description: "During setup, a player fielding this Company may choose to apply the Bausans special rule." }
      ]
    }
  }
};
