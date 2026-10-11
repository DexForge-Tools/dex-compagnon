/* Dex Compagnon — bilingual UI foundation (V2.0 beta 1).
 * French remains the source language in index.html.
 * Dynamic result templates and proper-name translations will follow in later steps.
 */
(() => {
  "use strict";
  const KEY = "dexCompagnonLanguageV1";
  const fr = {
    "language.label": "Langue",
    "ev.requested": "EV recherchés",
    "pins.heading": "Pokémon épinglés",
  };
  const en = {
  "brand.eyebrow": "INDEPENDENT TOOL",
  "section.region": "Map / region",
  "common.all": "All",
  "section.search": "Search",
  "mode.trainers": "Trainers",
  "mode.ev": "EV search",
  "pokemon.search": "Search for a Pokémon",
  "pokemon.help": "Search by French name, English name, or Pokédex number.",
  "trainer.search": "Search for a notable trainer",
  "trainer.help": "Gym Leaders, Elite Four, Champions, rivals and special trainers.",
  "ev.title": "EV TRAINING",
  "ev.heading": "Where should I train EVs?",
  "ev.intro": "Choose up to 3 EV stats. Areas are grouped to help you find locations with the most useful battles.",
  "ev.max": "max 3",
  "stat.hp": "HP",
  "stat.attack": "Attack",
  "stat.defense": "Defense",
  "stat.spattack": "Sp. Atk",
  "stat.spdefense": "Sp. Def",
  "stat.speed": "Speed",
  "ev.avoid": "Avoid unselected EVs",
  "ev.avoidHelp": "Strongly penalizes Pokémon that also grant unwanted EVs.",
  "common.region": "Region",
  "ev.regionHelp": "Filter for EV search only",
  "ev.methods": "Displayed encounter methods",
  "common.allShort": "All",
  "common.none": "None",
  "ev.oldRodOnly": "Old Rod only",
  "method.grass": "Grass",
  "method.darkGrass": "Dark grass",
  "method.cave": "Cave",
  "method.oldRod": "Old Rod",
  "method.goodRod": "Good Rod",
  "method.superRod": "Super Rod",
  "method.lure": "Lure",
  "method.headbutt": "Headbutt",
  "method.honey": "Honey tree",
  "method.rocks": "Rocks",
  "method.dust": "Dust cloud",
  "method.shadow": "Shadow",
  "common.other": "Other",
  "ev.periodSeason": "Time of day and season",
  "ev.generalHelp": "General encounters also apply alongside morning, day, night, or seasonal encounters.",
  "ev.period": "Time of day",
  "ev.morning": "Morning",
  "ev.day": "Day",
  "ev.night": "Night",
  "ev.periodHelp": "Your device time is not used to filter encounters: choose the time of day manually.",
  "ev.season": "Season",
  "ev.spring": "Spring",
  "ev.summer": "Summer",
  "ev.autumn": "Autumn",
  "ev.winter": "Winter",
  "ev.autoHelp": "Automatic season is calculated from the local date on your device.",
  "ev.chooseRegion": "Choose a specific region to configure your unlocked areas.",
  "ev.unlocked": "Only my unlocked areas",
  "ev.progressHelp": "Progress is saved separately for each region.",
  "ev.routes": "Choose my accessible routes / locations",
  "ev.selectAll": "Select all",
  "ev.clearAll": "Deselect all",
  "ev.savedHelp": "Your choices are saved on this device. They do not change pokemon-data.js.",
  "ev.prompt": "Select at least one EV stat to start the analysis.",
  "pokemon.choose": "Choose a Pokémon",
  "pokemon.chooseHelp": "Start typing its name. You can also open a pinned Pokémon.",
  "trainer.choose": "Choose a trainer",
  "trainer.chooseHelp": "Search for a Gym Leader, Elite Four member, Champion, rival, or special trainer.",
  "trainer.position": "Position",
  "trainer.teams": "Recorded teams",
  "trainer.battles": "Battles",
  "pokemon.weakness": "Weaknesses",
  "pokemon.resistance": "Resistances",
  "pokemon.immunity": "Immunities",
  "pokemon.evYield": "EV yields from battles",
  "common.noData": "Not available",
  "pokemon.details": "Details",
  "pokemon.locations": "Locations",
  "pokemon.locationsAvailable": "Available locations",
  "common.allRegions": "All regions",
  "pins.eyebrow": "SHORTCUTS",
  "pins.heading": "Pinned Pokémon",
  "pins.help": "Click a Pokémon to open its entry.",
  "pins.clear": "Clear pins",
  "footer.rights": "All rights reserved for the original elements of this website.",
  "footer.disclaimer": "Independent, unofficial project. Third-party trademarks, names, and artwork belong to their respective owners.",
  "language.label": "Language",
  "ev.requested": "EV stats",
  "pokemon.placeholder": "E.g. Magikarp, Pikachu, 25 or #025...",
  "trainer.placeholder": "E.g. Brock, Cynthia, Lance...",
  "ev.zonePlaceholder": "Search for a route, city, cave...",
  "footer.aria": "Legal information",
  "region.unys": "Unova"
};
  let language = "fr";
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "en" || stored === "fr") language = stored;
  } catch { /* Private browsing may block localStorage. */ }

  function translate(key) {
    if (language === "en" && Object.prototype.hasOwnProperty.call(en, key)) return en[key];
    if (Object.prototype.hasOwnProperty.call(fr, key)) return fr[key];
    const node = document.querySelector(`[data-i18n="${key}"]`);
    return node?.dataset.frOriginal || node?.textContent?.trim() || key;
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    for (const element of document.querySelectorAll("[data-i18n]")) {
      if (!Object.prototype.hasOwnProperty.call(element.dataset, "frOriginal")) {
        element.dataset.frOriginal = element.textContent.trim();
      }
      element.textContent = language === "en" ? (en[element.dataset.i18n] || element.dataset.frOriginal) : element.dataset.frOriginal;
    }
    for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
      if (!Object.prototype.hasOwnProperty.call(element.dataset, "frPlaceholder")) {
        element.dataset.frPlaceholder = element.getAttribute("placeholder") || "";
      }
      element.setAttribute("placeholder", language === "en" ? (en[element.dataset.i18nPlaceholder] || element.dataset.frPlaceholder) : element.dataset.frPlaceholder);
    }
    for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
      if (!Object.prototype.hasOwnProperty.call(element.dataset, "frAriaLabel")) {
        element.dataset.frAriaLabel = element.getAttribute("aria-label") || "";
      }
      element.setAttribute("aria-label", language === "en" ? (en[element.dataset.i18nAriaLabel] || element.dataset.frAriaLabel) : element.dataset.frAriaLabel);
    }
    document.title = language === "en" ? "Dex Compagnon — Independent guide" : "Dex Compagnon — Guide indépendant";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = language === "en"
        ? "Dex Compagnon: an independent, unofficial guide to Pokémon information and community data."
        : "Dex Compagnon : guide indépendant et non officiel pour consulter des fiches de Pokémon et des données communautaires.";
    }
    const select = document.querySelector("#languageSelect");
    if (select) select.value = language;
  }

  function setLanguage(next) {
    if (next !== "en" && next !== "fr") return;
    language = next;
    try { localStorage.setItem(KEY, next); } catch { /* Optional persistence. */ }
    applyLanguage();
    document.dispatchEvent(new CustomEvent("dex:languagechange", { detail: { language } }));
  }


  // Translations for Pokémon entry data. Original dataset remains untouched.
  const pokemonTerms = {
  "type": {
    "Normal": "Normal",
    "Feu": "Fire",
    "Eau": "Water",
    "Électrik": "Electric",
    "Plante": "Grass",
    "Glace": "Ice",
    "Combat": "Fighting",
    "Poison": "Poison",
    "Sol": "Ground",
    "Vol": "Flying",
    "Psy": "Psychic",
    "Insecte": "Bug",
    "Roche": "Rock",
    "Spectre": "Ghost",
    "Dragon": "Dragon",
    "Ténèbres": "Dark",
    "Acier": "Steel"
  },
  "egg": {
    "Terrestre": "Field",
    "Aquatique 1": "Water 1",
    "Aquatique 2": "Water 2",
    "Aquatique 3": "Water 3",
    "Monstrueux": "Monster",
    "Non reproductible": "Undiscovered",
    "Insectoïde": "Bug",
    "Végétal": "Grass",
    "Humanoïde": "Human-Like",
    "Aérien": "Flying",
    "Amorphe": "Amorphous",
    "Dragon": "Dragon",
    "Féerique": "Fairy",
    "Asexué": "Genderless",
    "Minéral": "Mineral",
    "Métamorph": "Ditto"
  },
  "ability": {
    "Absentéisme": "Truant",
    "Absorbe-Eau": "Water Absorb",
    "Absorbe-Volt": "Volt Absorb",
    "Acharné": "Defiant",
    "Adaptabilité": "Adaptability",
    "Agitation": "Hustle",
    "Air Lock": "Air Lock",
    "Alerte Neige": "Snow Warning",
    "Analyste": "Analytic",
    "Annule Garde": "No Guard",
    "Colérique": "Anger Point",
    "Fermeté": "Sturdy",
    "Phobique": "Rattled",
    "Anti-Bruit": "Soundproof",
    "Anticipation": "Anticipation",
    "Armumagma": "Magma Armor",
    "Armurbaston": "Battle Armor",
    "Armurouillée": "Weak Armor",
    "Attention": "Inner Focus",
    "Baigne Sable": "Sand Rush",
    "Benêt": "Oblivious",
    "Boom Final": "Aftermath",
    "Brasier": "Blaze",
    "Brise Moule": "Mold Breaker",
    "Calque": "Trace",
    "Chanceux": "Super Luck",
    "Cherche Miel": "Honey Gather",
    "Chlorophylle": "Chlorophyll",
    "Ciel Gris": "Cloud Nine",
    "Coloforce": "Huge Power",
    "Competitive": "Competitive",
    "Contestation": "Contrary",
    "Coque Armure": "Shell Armor",
    "Corps Ardent": "Flame Body",
    "Corps Gel": "Ice Body",
    "Corps Maudit": "Cursed Body",
    "Corps Sain": "Clear Body",
    "Cœur de Coq": "Big Pecks",
    "Cœur Noble": "Justified",
    "Cœur Soin": "Healer",
    "Crachin": "Drizzle",
    "Cran": "Guts",
    "Cuvette": "Rain Dish",
    "Début Calme": "Slow Start",
    "Défaitiste": "Defeatist",
    "Délestage": "Unburden",
    "Don Floral": "Flower Gift",
    "Écaille Spéciale": "Marvel Scale",
    "Échauffement": "Limber",
    "Écran Fumée": "White Smoke",
    "Écran Poudre": "Shield Dust",
    "Engrais": "Overgrow",
    "Envelocape": "Overcoat",
    "Épine de Fer": "Iron Barbs",
    "Esprit Vital": "Vital Spirit",
    "Essaim": "Swarm",
    "Farceur": "Prankster",
    "Feuille Garde": "Leaf Guard",
    "Filtre": "Filter",
    "Force Pure": "Pure Power",
    "Force Sable": "Sand Force",
    "Force Soleil": "Solar Power",
    "Fouille": "Frisk",
    "Frein": "Stall",
    "Fuite": "Run Away",
    "Garde-Ami": "Friend Guard",
    "Garde Magik": "Magic Guard",
    "Garde Mystik": "Wonder Guard",
    "Glissade": "Swift Swim",
    "Gloutonnerie": "Gluttony",
    "Glu": "Sticky Hold",
    "Heavy Metal": "Heavy Metal",
    "Herbivore": "Sap Sipper",
    "Homochromie": "Color Change",
    "Hydratation": "Hydration",
    "Hyper Cutter": "Hyper Cutter",
    "Ignifugé": "Heatproof",
    "Ignifu-Voile": "Water Veil",
    "Illusion": "Illusion",
    "Impassible": "Steadfast",
    "Imposteur": "Imposter",
    "Impudence": "Moxie",
    "Inconscient": "Unaware",
    "Infiltration": "Infiltrator",
    "Insomnia": "Insomnia",
    "Intimidation": "Intimidate",
    "Isograisse": "Thick Fat",
    "Joli Sourire": "Cute Charm",
    "Lavabo": "Storm Drain",
    "Lentiteintée": "Tinted Lens",
    "Lévitation": "Levitate",
    "Light Metal": "Light Metal",
    "Lumiattirance": "Illuminate",
    "Lunatique": "Moody",
    "Maladresse": "Klutz",
    "Magnépiège": "Magnet Pull",
    "Marque Ombre": "Shadow Tag",
    "Matinal": "Early Bird",
    "Mauvais Rêve": "Bad Dreams",
    "Médic Nature": "Natural Cure",
    "Météo": "Forecast",
    "Miroir Magik": "Magic Bounce",
    "Mode Transe": "Zen Mode",
    "Moins": "Minus",
    "Moiteur": "Damp",
    "Momie": "Mummy",
    "Motorisé": "Motor Drive",
    "Mue": "Shed Skin",
    "Multi-Coups": "Skill Link",
    "Multi-Type": "Multitype",
    "Multiécaille": "Multiscale",
    "Normalise": "Normalize",
    "Œil Composé": "Compound Eyes",
    "Paratonnerre": "Lightning Rod",
    "Peau Dure": "Rough Skin",
    "Peau Miracle": "Wonder Skin",
    "Peau Sèche": "Dry Skin",
    "Pied Véloce": "Quick Feet",
    "Pieds Confus": "Tangled Feet",
    "Piège Sable": "Arena Trap",
    "Pickpocket": "Pickpocket",
    "Plus": "Plus",
    "Poing de Fer": "Iron Fist",
    "Point Poison": "Poison Point",
    "Pose Spore": "Effect Spore",
    "Prédiction": "Forewarn",
    "Pression": "Pressure",
    "Protean": "Protean",
    "Puanteur": "Stench",
    "Querelleur": "Scrappy",
    "Rage Brûlure": "Flare Boost",
    "Rage Poison": "Toxic Boost",
    "Ramassage": "Pickup",
    "Reactive Gas": "Reactive Gas",
    "Récolte": "Harvest",
    "Regard Vif": "Keen Eye",
    "Régé-Force": "Regenerator",
    "Rivalité": "Rivalry",
    "Rideau Neige": "Snow Cloak",
    "Sable Volant": "Sand Stream",
    "Sans Limite": "Sheer Force",
    "Sécheresse": "Drought",
    "Sérénité": "Serene Grace",
    "Sharpness": "Sharpness",
    "Simple": "Simple",
    "Sniper": "Sniper",
    "Snow Plow": "Snow Plow",
    "Soin Poison": "Poison Heal",
    "Solide Roc": "Solid Rock",
    "Statik": "Static",
    "Suintement": "Liquid Ooze",
    "Synchro": "Synchronize",
    "Technicien": "Technician",
    "Télécharge": "Download",
    "Télépathe": "Telepathy",
    "Tempo Perso": "Own Tempo",
    "Tension": "Unnerve",
    "Téméraire": "Reckless",
    "Téra-Voltage": "Teravolt",
    "Tête de Roc": "Rock Head",
    "Torche": "Flash Fire",
    "Torrent": "Torrent",
    "Toxitouche": "Poison Touch",
    "Turbo": "Speed Boost",
    "Turbo Brasier": "Turboblaze",
    "Vaccin": "Immunity",
    "Ventouse": "Suction Cups",
    "Victorieux": "Victory Star",
    "Voile Sable": "Sand Veil"
  },
  "stat": {
    "pv": "HP",
    "attaque": "Attack",
    "defense": "Defense",
    "attaque_spe": "Sp. Atk",
    "defense_spe": "Sp. Def",
    "vitesse": "Speed"
  },
  "ev": {
    "PV": "HP",
    "Attaque": "Attack",
    "Défense": "Defense",
    "Attaque Spéciale": "Sp. Atk",
    "Défense Spéciale": "Sp. Def",
    "Vitesse": "Speed"
  }
};
  const evolutionItems = {
  "Pierre Lune": "Moon Stone",
  "Pierre Eau": "Water Stone",
  "Pierreplante": "Leaf Stone",
  "Pierre Feu": "Fire Stone",
  "Pierresoleil": "Sun Stone",
  "Pierrefoudre": "Thunder Stone",
  "Pierre Eclat": "Shiny Stone",
  "Pierre Nuit": "Dusk Stone",
  "Pierre Aube": "Dawn Stone",
  "Roche Royale": "King’s Rock",
  "Peau Métal": "Metal Coat",
  "Protecteur": "Protector",
  "Ecailledraco": "Dragon Scale",
  "Electiriseur": "Electirizer",
  "Magmariseur": "Magmarizer",
  "Améliorator": "Up-Grade",
  "CD Douteux": "Dubious Disc",
  "Tissu Fauche": "Reaper Cloth",
  "Dent Océan": "Deep Sea Tooth",
  "Ecailleocéan": "Deep Sea Scale",
  "Croc Rasoir": "Razor Fang",
  "Grif. Rasoir": "Razor Claw",
  "Pierre Ovale": "Oval Stone"
};
  const evolutionMoves = {
  "Pouvoir Antique": "Ancient Power",
  "Copie": "Mimic",
  "Roulade": "Rollout",
  "Coup Double": "Double Hit"
};
  const cardTextFr = {
    "common.noData": "Non renseigné",
  "pokemon.englishName": "Nom anglais",
  "pokemon.frenchName": "Nom français",
  "pokemon.noWeakness": "Aucune faiblesse enregistrée",
  "pokemon.noResistance": "Aucune résistance enregistrée",
  "pokemon.noImmunity": "Aucune immunité",
  "pokemon.unknownZone": "Zone inconnue",
  "pokemon.unknownMethod": "Méthode inconnue",
  "pokemon.unknownLevel": "Niveau ?",
  "pokemon.noLocation": "Aucune localisation n'est renseignée dans la base pour ce Pokémon et cette région.",
  "pokemon.abilities": "Talent(s)",
  "pokemon.baseStats": "Stats de base",
  "pokemon.evolution": "Évolution",
  "pokemon.eggGroups": "Groupes d'œuf",
  "pokemon.noEv": "Aucun EV renseigné",
  "pokemon.noEvolution": "Pas d'évolution suivante enregistrée",
  "pokemon.level": "Niveau",
  "pokemon.noResult": "Aucun Pokémon trouvé dans la base actuelle.",
  "pokemon.didYouMean": "Tu cherchais peut-être :",
  "pokemon.freeSlot": "Emplacement libre",
  "pokemon.remove": "Retirer",
  "pokemon.pinned": "✓ Épinglé",
  "pokemon.pin": "📌 Épingler",
  "pokemon.fullPins": "Les 10 emplacements sont déjà utilisés. Retire d'abord un Pokémon.",
  "pokemon.clearConfirm": "Vider les 10 emplacements épinglés ?",
  "status.mythical": "Fabuleux",
  "status.legendary": "Légendaire",
  "status.pseudo": "Pseudo-légendaire",
  "status.pseudoLine": "Lignée pseudo-légendaire",
  "status.starter": "Starter",
  "status.fossil": "Fossile",
  "status.standard": "Standard",
  "status.unavailable": "Non obtenable normalement",
  "status.unavailableDesc": "Les données utilisées signalent ce Pokémon comme non obtenable normalement.",
  "status.wild": "Sauvage",
  "status.special": "Obtention spéciale",
  "status.specialDesc": "Aucune rencontre sauvage n'est enregistrée dans les données disponibles.",
  "status.category": "Catégorie",
  "status.availability": "Disponibilité"
};
  const cardTextEn = {
    "common.noData": "Not available",
  "pokemon.englishName": "English name",
  "pokemon.frenchName": "French name",
  "pokemon.noWeakness": "No recorded weaknesses",
  "pokemon.noResistance": "No recorded resistances",
  "pokemon.noImmunity": "No immunities",
  "pokemon.unknownZone": "Unknown area",
  "pokemon.unknownMethod": "Unknown method",
  "pokemon.unknownLevel": "Level ?",
  "pokemon.noLocation": "No locations recorded for this Pokémon in this region.",
  "pokemon.abilities": "Abilities",
  "pokemon.baseStats": "Base stats",
  "pokemon.evolution": "Evolution",
  "pokemon.eggGroups": "Egg groups",
  "pokemon.noEv": "No EV data",
  "pokemon.noEvolution": "No further evolutions recorded",
  "pokemon.level": "Level",
  "pokemon.noResult": "No Pokémon found in the current database.",
  "pokemon.didYouMean": "Did you mean:",
  "pokemon.freeSlot": "Empty slot",
  "pokemon.remove": "Remove",
  "pokemon.pinned": "✓ Pinned",
  "pokemon.pin": "📌 Pin",
  "pokemon.fullPins": "All 10 slots are occupied. Remove a Pokémon first.",
  "pokemon.clearConfirm": "Clear all 10 pinned slots?",
  "status.mythical": "Mythical",
  "status.legendary": "Legendary",
  "status.pseudo": "Pseudo-legendary",
  "status.pseudoLine": "Pseudo-legendary line",
  "status.starter": "Starter",
  "status.fossil": "Fossil",
  "status.standard": "Standard",
  "status.unavailable": "Not normally obtainable",
  "status.unavailableDesc": "Available data indicates this Pokémon is not normally obtainable.",
  "status.wild": "Wild",
  "status.special": "Special acquisition",
  "status.specialDesc": "No wild encounters are recorded in the available data.",
  "status.category": "Category",
  "status.availability": "Availability"
};

  function cardText(key) {
    return (language === "en" ? cardTextEn : cardTextFr)[key] || key;
  }

  function pokemonName(pokemon) {
    if (!pokemon) return "";
    return language === "en" ? (pokemon.nom_en || pokemon.nom) : pokemon.nom;
  }

  function pokemonTerm(category, value, forceEnglish = false) {
    const text = String(value ?? "");
    if (language !== "en" && !forceEnglish) return text;
    return pokemonTerms[category]?.[text] || text;
  }

  function evolutionMethod(method) {
    const text = String(method ?? "");
    if (language !== "en" || !text) return text;
    const level = text.match(/^Niveau (\d+)$/);
    if (level) return `Level ${level[1]}`;
    const levelCompare = text.match(/^Niveau (\d+), Attaque ([<>=]) Défense$/);
    if (levelCompare) return `Level ${levelCompare[1]}, Attack ${levelCompare[2]} Defense`;
    const useItem = text.match(/^Utiliser (.+)$/);
    if (useItem && evolutionItems[useItem[1]]) return `Use ${evolutionItems[useItem[1]]}`;
    const tradeItem = text.match(/^Échange avec (.+)$/);
    if (tradeItem && evolutionItems[tradeItem[1]]) return `Trade holding ${evolutionItems[tradeItem[1]]}`;
    const move = text.match(/^Monter de niveau en connaissant (.+)$/);
    if (move && evolutionMoves[move[1]]) return `Level up knowing ${evolutionMoves[move[1]]}`;
    const special = {
      "Échange":"Trade", "Bonheur élevé":"High friendship", "Bonheur élevé de jour":"High friendship during daytime", "Bonheur élevé de nuit":"High friendship at night",
      "Monter de niveau dans une zone à champ magnétique spécial":"Level up in a special magnetic field",
      "Monter de niveau près de la Roche Mousse":"Level up near a Moss Rock",
      "Monter de niveau près de la Roche Glace":"Level up near an Ice Rock",
      "Monter de niveau la nuit avec Croc Rasoir":"Level up at night holding Razor Fang",
      "Monter de niveau la nuit avec Grif. Rasoir":"Level up at night holding Razor Claw",
      "Niveau 7, évolution déterminée aléatoirement":"Level 7, random evolution",
      "Échange contre le Pokémon partenaire correspondant":"Trade for the corresponding partner Pokémon",
      "Mâle + Pierre Aube":"Male + Dawn Stone", "Femelle + Pierre Aube":"Female + Dawn Stone",
      "Beauté suffisamment élevée":"High enough Beauty stat",
      "Niveau 20, condition spéciale de création de Munja":"Level 20, special Shedinja evolution requirement",
      "Monter de niveau le jour avec Pierre Ovale":"Level up during the day holding an Oval Stone",
      "Monter de niveau avec Rémoraid dans l'équipe":"Level up with Remoraid in the party"
    };
    if (special[text]) return special[text];
    const genderLevel = text.match(/^(Mâle|Femelle), niveau (\d+)$/);
    if (genderLevel) return `${genderLevel[1] === "Mâle" ? "Male" : "Female"}, level ${genderLevel[2]}`;
    // Fall back to the original text when an evolution condition is uncertain.
    return text;
  }

  const locationNames = {
  "shared": {
    "Route Victoire": "Victory Road",
    "Parc Safari": "Safari Zone",
    "Grotte Métamo": "Altering Cave",
    "Grotte": "Cave",
    "Île 1": "One Island",
    "Île 4": "Four Island",
    "Île 5": "Five Island",
    "Ligue Pokémon": "Pokémon League"
  },
  "kanto": {
    "Azuria": "Cerulean City",
    "Bois Baies": "Berry Forest",
    "Bourg Palette": "Pallet Town",
    "Camp de Vacances": "Resort Gorgeous",
    "Canyon Sesor": "Sevault Canyon",
    "Cap Falaise": "Cape Brink",
    "Carmin sur Mer": "Vermilion City",
    "Cave Taupiqueur": "Diglett’s Cave",
    "Caverne Azurée": "Cerulean Cave",
    "Centrale": "Power Plant",
    "Chemin Vert": "Green Path",
    "Cramois'île": "Cinnabar Island",
    "Céladopole": "Celadon City",
    "Entrée Canyon": "Canyon Entrance",
    "Entrée du Canyon": "Canyon Entrance",
    "Forbuissons": "Pattern Bush",
    "Forêt de Jade": "Viridian Forest",
    "Grotte Azurée": "Cerulean Cave",
    "Grotte Perdue": "Lost Cave",
    "Grotte de Glace": "Icefall Cave",
    "Jadielle": "Viridian City",
    "L'Océane": "S.S. Anne",
    "Labyrinthe D'O": "Water Labyrinth",
    "Labyrinthe d'O": "Water Labyrinth",
    "Manoir Pokémon": "Pokémon Mansion",
    "Mont Braise": "Mt. Ember",
    "Mont Sélénite": "Mt. Moon",
    "Mémorial": "Memorial Pillar",
    "Parmanie": "Fuchsia City",
    "Plage Trésor": "Treasure Beach",
    "Pont du Lien": "Bond Bridge",
    "Port Île 3": "Three Island Port",
    "Pré Île 5": "Five Isle Meadow",
    "Route Tison": "Kindle Road",
    "Ruines Tanoby": "Tanoby Ruins",
    "Tour Dresseurs": "Trainer Tower",
    "Tour Pokémon": "Pokémon Tower",
    "Vallée Ruine": "Ruin Valley",
    "Îles Écume": "Seafoam Islands",
    "Île du Lointain": "Faraway Island"
  },
  "hoenn": {
    "Algatia": "Mossdeep City",
    "Atalanopolis": "Sootopolis City",
    "Bois Clémenti": "Petalburg Woods",
    "Caverne Fondmer": "Seafloor Cavern",
    "Chemin Ardent": "Fiery Path",
    "Clémenti-Ville": "Petalburg City",
    "Clémenti-ville": "Petalburg City",
    "Fond marin": "Underwater",
    "Grotte Atelier": "Artisan Cave",
    "Grotte Granite": "Granite Cave",
    "Grotte Origine": "Cave of Origin",
    "Grotte Tréfonds": "Shoal Cave",
    "Mont Mémoria": "Mt. Pyre",
    "Myokara": "Dewford Town",
    "New Lavandia": "New Mauville",
    "Nénucrique": "Lilycove City",
    "Pacifiville": "Pacifidlog Town",
    "Pilier Céleste": "Sky Pillar",
    "Planque Aqua": "Aqua Hideout",
    "Planque Magma": "Magma Hideout",
    "Poivressel": "Slateport City",
    "Sentier Sinuroc": "Jagged Pass",
    "Site Météore": "Meteor Falls",
    "Tour Mirage": "Mirage Tower",
    "Tunnel Mérazon": "Rusturf Tunnel",
    "Voie du Désert": "Desert Underpass",
    "Zone de Combat": "Battle Frontier",
    "Épave": "Abandoned Ship",
    "Éternara": "Ever Grande City"
  },
  "sinnoh": {
    "Aire de Détente": "Resort Area",
    "Arbre à Miel": "Honey Tree",
    "Bonaugure": "Twinleaf Town",
    "Celestia": "Celestic Town",
    "Chemin Rocheux": "Ravaged Path",
    "Entrée Charbourg": "Oreburgh Gate",
    "Forge Fuego": "Fuego Ironworks",
    "Forêt Vestigion": "Eterna Forest",
    "Grand Marais": "Great Marsh",
    "Grotte Retour": "Turnback Cave",
    "Grotte Revêche": "Wayward Cave",
    "Grotte Ruineman.": "Ruin Maniac Cave",
    "Jardin Trophée": "Trophy Garden",
    "Joliberges": "Canalave City",
    "Lac Courage": "Lake Valor",
    "Lac Savoir": "Lake Acuity",
    "Lac Vérité": "Lake Verity",
    "Les Éoliennes": "Valley Windworks",
    "Mine Charbourg": "Oreburgh Mine",
    "Mont Abrupt": "Stark Mountain",
    "Mont Couronné": "Mt. Coronet",
    "Rivamar": "Sunyshore City",
    "Rive Lac Courage": "Valor Lakefront",
    "Rive Lac Savoir": "Acuity Lakefront",
    "Ruines Bonville": "Solaceon Ruins",
    "Source Adieu": "Sendoff Spring",
    "Temple Frimapic": "Snowpoint Temple",
    "Tunnel Ruineman.": "Ruin Maniac Tunnel",
    "Verchamps": "Pastoria City",
    "Vestigion": "Eterna City",
    "Vieux Château": "Old Chateau",
    "Île de Fer": "Iron Island"
  },
  "unys": {
    "Antre d'Entraînement": "Challenger’s Cave",
    "Autel Abondance": "Abundant Shrine",
    "Baie Vaguelone": "Undella Bay",
    "Bois des Illusions": "Lostlorn Forest",
    "Château Enfoui": "Relic Castle",
    "Désert Délassant": "Desert Resort",
    "Espace Guide": "Guidance Chamber",
    "Flocombe": "Icirrus City",
    "Forêt d'Empoigne": "Pinwheel Forest",
    "Grotte Cyclopéenne": "Giant Chasm",
    "Grotte Parsemille": "Mistralton Cave",
    "Grotte Électrolithe": "Chargestone Cave",
    "Hangar Frigorifique": "Cold Storage",
    "Labo P2": "P2 Laboratory",
    "Mont Foré": "Twist Mountain",
    "Ogoesse": "Striaton City",
    "Pont Yoneuve": "Driftveil Drawbridge",
    "Pont de l'Inconnu": "Marvelous Bridge",
    "Pont du Hameau": "Village Bridge",
    "Port Yoneuve": "Driftveil City",
    "Salle Épreuve": "Trial Chamber",
    "Tour Dragospire": "Dragonspiral Tower",
    "Tour des Cieux": "Celestial Tower",
    "Tourbière Flocombe": "Moor of Icirrus",
    "Vaguelone": "Undella Town",
    "Veine Souterraine": "Wellspring Cave",
    "Vestiges du Rêve": "Dreamyard"
  },
  "johto": {
    "Acajou": "Mahogany Town",
    "Antre Noir": "Dark Cave",
    "Antre du Dragon": "Dragon’s Den",
    "Bois aux Chênes": "Ilex Forest",
    "Bourg Geon": "New Bark Town",
    "Caves Jumelles": "Union Cave",
    "Chutes Tohjo": "Tohjo Falls",
    "Dôme Pokéathlon": "Pokéathlon Dome",
    "Ecorcia": "Azalea Town",
    "Grotte Argentée": "Mt. Silver Cave",
    "Grotte Falaise": "Cliff Cave",
    "Irisia": "Cianwood City",
    "Lac Colère": "Lake of Rage",
    "Mauville": "Violet City",
    "Mont Argenté": "Mt. Silver",
    "Mont Creuset": "Mt. Mortar",
    "Oliville": "Olivine City",
    "Parc Naturel": "National Park",
    "Portail Falaise": "Cliff Edge Gate",
    "Portail Safari": "Safari Zone Gate",
    "Puits Ramoloss": "Slowpoke Well",
    "Repaire Rocket": "Team Rocket HQ",
    "Rosalia": "Ecruteak City",
    "Route de Glace": "Ice Path",
    "Ruines d'Alpha": "Ruins of Alph",
    "Tour Carillon": "Bell Tower",
    "Tour Cendrée": "Burned Tower",
    "Tour Chétiflor": "Sprout Tower",
    "Tourb'Îles": "Whirl Islands",
    "Ville Griotte": "Cherrygrove City",
    "Ébènelle": "Blackthorn City"
  }
};

  // Display-only localization. Never translate location IDs in the dataset or saved EV progress.
  const encounterMethods = {
    "Herbes": "Grass", "Herbes sombres": "Dark grass", "Grotte": "Cave",
    "Surf": "Surf", "Canne": "Old Rod", "Super Canne": "Good Rod",
    "Méga Canne": "Super Rod", "Pêche": "Fishing", "Intérieur": "Indoors",
    "Arbre à Miel": "Honey tree", "Coup de Boule": "Headbutt", "Rochers": "Rocks",
    "Nuage de poussière": "Dust cloud", "Ombre": "Shadow", "Horde": "Horde",
    "Leurre": "Lure", "Méthode inconnue": "Unknown method"
  };
  const encounterRarities = {
    "Très commun": "Very common", "Commun": "Common", "Peu commun": "Uncommon",
    "Rare": "Rare", "Très rare": "Very rare", "Horde": "Horde",
    "Leurre": "Lure", "Spécial": "Special"
  };
  const conditionNames = {
    "Jour": "Day", "Matin": "Morning", "Nuit": "Night",
    "Printemps": "Spring", "Été": "Summer", "Automne": "Autumn", "Hiver": "Winter"
  };
  const displayRegions = { all: "All regions", kanto: "Kanto", hoenn: "Hoenn", sinnoh: "Sinnoh", unys: "Unova", johto: "Johto" };

  function regionLabel(region) {
    if (language !== "en") return ({ all: "Toutes les régions", unys: "Unys" })[region] || region.charAt(0).toUpperCase() + region.slice(1);
    return displayRegions[region] || region;
  }
  function locationName(region, value) {
    const source = String(value ?? "");
    if (language !== "en" || !source) return source;
    // Extract only trailing time/season conditions, while keeping the complete raw value for filtering.
    const match = source.match(/^(.*?)(?:\s+\(([^()]*)\))?$/);
    const base = match?.[1] || source;
    const conditional = match?.[2];
    const name = locationNames[region]?.[base] || locationNames.shared[base] || base;
    const suffix = conditional
      ? ` (${conditional.split("/").map((token) => conditionNames[token.trim()] || token.trim()).join("/")})`
      : "";
    return name + suffix;
  }
  function locationMethod(value) {
    const source = String(value ?? "");
    return language === "en" ? (encounterMethods[source] || source) : source;
  }
  function locationRarity(value) {
    const source = String(value ?? "");
    return language === "en" ? (encounterRarities[source] || source) : source;
  }
  function locationLevel(value) {
    const source = String(value ?? "");
    return language === "en" ? source.replace(/^Niveau\b/i, "Level") : source;
  }


  // Trainer display translations. The original trainer-data.js values remain unchanged.
  const trainerCategories = {
    "Champion d'Arène": "Gym Leader", "Conseil 4": "Elite Four",
    "Maître": "Champion", "Rival": "Rival", "Dresseur spécial": "Special Trainer",
    "Team Rocket": "Team Rocket"
  };
  const trainerLocations = {
    shared: { "Plusieurs lieux": "Multiple locations", "Plateau Indigo": "Indigo Plateau" },
    kanto: { "Argenta": "Pewter City", "Safrania": "Saffron City", "Parmanie": "Fuchsia City",
      "Cramois'Île": "Cinnabar Island" },
    johto: { "Mauville": "Violet City", "Écorcia": "Azalea Town", "Doublonville": "Goldenrod City",
      "Rosalia": "Ecruteak City", "Irisia": "Cianwood City", "Oliville": "Olivine City",
      "Acajou": "Mahogany Town", "Ébènelle": "Blackthorn City", "Mont Argenté": "Mt. Silver" },
    hoenn: { "Mérouville": "Rustboro City", "Myokara": "Dewford Town", "Lavandia": "Mauville City",
      "Vermilava": "Lavaridge Town", "Cimetronelle": "Fortree City" },
    sinnoh: { "Charbourg": "Oreburgh City", "Voilaroc": "Veilstone City",
      "Unionpolis": "Hearthome City", "Frimapic": "Snowpoint City" },
    unys: { "Maillard": "Nacrene City", "Volucité": "Castelia City", "Méanville": "Nimbasa City",
      "Parsemille": "Mistralton City", "Janusia": "Opelucid City", "Vaguelone": "Undella Town" }
  };
  const trainerBattles = {
    "Normal": "Normal", "Premier combat": "First battle", "Deuxieme combat": "Second battle",
    "Troisieme combat": "Third battle", "Quatrieme combat": "Fourth battle",
    "Cinquieme combat": "Fifth battle", "Sixieme combat": "Sixth battle",
    "Septieme combat": "Seventh battle", "Deuxieme combat (Optionnel)": "Second battle (optional)",
    "Equipe 1": "Team 1", "Equipe 2": "Team 2", "Revanche": "Rematch",
    "Postgame": "Postgame", "Post Game": "Postgame", "Championne Gladys": "Gym Leader Candice",
    "Vaguelone": "Undella Town"
  };
  const trainerBadges = {
    "Badge Roche": "Boulder Badge", "Badge Cascade": "Cascade Badge",
    "Badge Foudre": "Thunder Badge", "Badge Prisme": "Rainbow Badge",
    "Badge Marais": "Marsh Badge", "Badge Ame": "Soul Badge",
    "Badge Volcan": "Volcano Badge", "Badge Terre": "Earth Badge",
    "Badge Pierre": "Stone Badge", "Badge Mine": "Mine Badge",
    "Badge Legende": "Legend Badge"
  };
  const trainerMoves = {
    "Séisme":"Earthquake", "Laser Glace":"Ice Beam", "Tonnerre":"Thunderbolt",
    "Ball’Ombre":"Shadow Ball", "Mâchouille":"Crunch", "Psyko":"Psychic", "Force":"Strength",
    "Lance-Flammes":"Flamethrower", "Vive-Attaque":"Quick Attack", "Charge":"Tackle",
    "Lame de Roc":"Stone Edge", "Demi-Tour":"U-turn", "Toxik":"Toxic",
    "Casse-Brique":"Brick Break", "Repos":"Rest", "Onde de Choc":"Shock Wave",
    "Giga-Sangsue":"Giga Drain", "Soin":"Recover", "Ébullition":"Scald",
    "Morsure":"Bite", "Vibraqua":"Water Pulse", "Aéropique":"Aerial Ace",
    "Atterrissage":"Roost", "Draco-Griffe":"Dragon Claw", "Cascade":"Waterfall",
    "Éboulement":"Rock Slide", "Draco-Choc":"Dragon Pulse", "Puissance Cachée":"Hidden Power",
    "Bombe Beurk":"Sludge Bomb", "Nœud Herbe":"Grass Knot", "Exploforce":"Focus Blast",
    "Vengeance":"Retaliate", "Cage Éclair":"Thunder Wave", "Déflagration":"Fire Blast",
    "Feu Follet":"Will-O-Wisp", "Poing Glace":"Ice Punch", "Rugissement":"Growl",
    "Tornade":"Gust", "Éco-Sphère":"Energy Ball", "Surpuissance":"Superpower",
    "Poing Éclair":"Thunder Punch", "Choc Psy":"Psyshock", "Poudre Dodo":"Sleep Powder",
    "Bluff":"Fake Out", "Lame d’Air":"Air Slash", "Piétisol":"Bulldoze",
    "Tunnelier":"Dig", "Luminocanon":"Flash Cannon", "Rafale Psy":"Psybeam",
    "Telluriforce":"Earth Power", "Griffe Ombre":"Shadow Claw", "Rapace":"Brave Bird",
    "Psykoud’Boul":"Zen Headbutt", "Éclair Fou":"Wild Charge", "Boule Roc":"Rock Blast",
    "Vent Violent":"Hurricane", "Coup Bas":"Sucker Punch", "Poing Feu":"Fire Punch",
    "Crocs Givre":"Ice Fang", "Plaquage":"Body Slam", "Tricherie":"Foul Play",
    "Cru-Ailes":"Wing Attack", "Double Pied":"Double Kick", "Hydro-Queue":"Aqua Tail",
    "Gyroballe":"Gyro Ball", "Façade":"Facade", "Acrobatie":"Acrobatics",
    "Change Éclair":"Volt Switch", "Crocs Feu":"Fire Fang", "Marto-Poing":"Hammer Arm",
    "Météores":"Swift", "Choc Venin":"Venoshock", "Vitesse Extrême":"Extreme Speed",
    "Piège de Roc":"Stealth Rock", "Mégacorne":"Megahorn", "Blabla Dodo":"Sleep Talk",
    "Tempête Verte":"Leaf Storm", "Bélier":"Take Down", "Boutefeu":"Flare Blitz",
    "Châtiment":"Hex", "Tomberoche":"Rock Tomb", "Rayon Signal":"Signal Beam",
    "Vibrobscur":"Dark Pulse", "Canicule":"Heat Wave", "Balayage":"Low Kick",
    "Pied Voltige":"High Jump Kick", "Griffe":"Scratch", "Ombre Nocturne":"Night Shade",
    "Blizzard":"Blizzard", "Queue de Fer":"Iron Tail", "Martobois":"Wood Hammer",
    "Vampi-Poing":"Drain Punch", "Direct Toxik":"Poison Jab", "Mimi-Queue":"Tail Whip",
    "Ouragan":"Twister", "Éclate-Roc":"Rock Smash", "Crocs Éclair":"Thunder Fang",
    "Pisto-Poing":"Bullet Punch", "Exuviation":"Shell Smash", "Abri":"Protect",
    "Frappe Atlas":"Seismic Toss", "Miroi-Tir":"Mirror Shot", "Choc Mental":"Confusion",
    "Picpic":"Peck", "Koud’Korne":"Horn Attack", "Vague Psy":"Psywave",
    "Onde Folie":"Confuse Ray", "Draco-Souffle":"Dragon Breath"
  };
  const trainerItems = {
    "Orbe Vie":"Life Orb", "Baie Sitrus":"Sitrus Berry", "Restes":"Leftovers",
    "Herbeblanche":"White Herb", "Baie Maron":"Chesto Berry", "Baie Oran":"Oran Berry",
    "Baie Jouca":"Shuca Berry", "Casque Brut":"Rocky Helmet",
    "Ballon":"Air Balloon", "Ceinture Pro":"Expert Belt", "Orbe Flamme":"Flame Orb",
    "Orbe Toxique":"Toxic Orb", "Boue Noire":"Black Sludge", "Carton Rouge":"Red Card",
    "Bouton Fuite":"Eject Button", "Eau Mystique":"Mystic Water", "Aimant":"Magnet",
    "Loupe":"Wide Lens", "Ballelumière":"Light Ball", "Baie Prine":"Lum Berry",
    "Herbe Pouv.":"Power Herb", "Baie Lichii":"Liechi Berry"
  };
  // V2.0 beta 6: additional verified FR → EN display terms for trainer teams.
  // The imported data and search IDs remain in their original language.
  Object.assign(trainerMoves, {
    "Aboiement": "Snarl",
    "Aiguisage": "Hone Claws",
    "Ailes d’Acier": "Steel Wing",
    "Ampleur": "Magnitude",
    "Anti-Air": "Smack Down",
    "Appel Attaque": "Attack Order",
    "Appel Soins": "Heal Order",
    "Aqua-Jet": "Aqua Jet",
    "Armure": "Harden",
    "Assurance": "Assurance",
    "Attraction": "Attract",
    "Attrition": "Chip Away",
    "Aurasphère": "Aura Sphere",
    "Aurore": "Morning Sun",
    "Avalanche": "Avalanche",
    "Balance": "Pain Split",
    "Balayette": "Low Sweep",
    "Ball’Météo": "Weather Ball",
    "Baston": "Beat Up",
    "Bec Vrille": "Drill Peck",
    "Berceuse": "Sing",
    "Bombe Acide": "Acid Spray",
    "Bombe Aimant": "Magnet Bomb",
    "Bourdon": "Bug Buzz",
    "Bulles d’O": "Bubble Beam",
    "Buée Noire": "Haze",
    "Bâillement": "Yawn",
    "Calcination": "Incinerate",
    "Canon Graine": "Seed Bomb",
    "Chute Glace": "Icicle Crash",
    "Close Combat": "Close Combat",
    "Colère": "Outrage",
    "Contre": "Reversal",
    "Coqui-Lame": "Razor Shell",
    "Cotogarde": "Cotton Guard",
    "Coud’Boue": "Mud-Slap",
    "Coud’Krâne": "Skull Bash",
    "Coup Croix": "Cross Chop",
    "Coup Double": "Double Hit",
    "Coup d’Boule": "Headbutt",
    "Coup d’Jus": "Discharge",
    "Coup d’Main": "Helping Hand",
    "Coupe Psycho": "Psycho Cut",
    "Cradovague": "Sludge Wave",
    "Croc Fatal": "Super Fang",
    "Croc de Mort": "Hyper Fang",
    "Damoclès": "Double-Edge",
    "Danse Draco": "Dragon Dance",
    "Danse Fleurs": "Petal Dance",
    "Danse Folle": "Teeter Dance",
    "Danse Lames": "Swords Dance",
    "Danse Pluie": "Rain Dance",
    "Danse Plumes": "Feather Dance",
    "Dard-Nuée": "Pin Missile",
    "Destruction": "Self-Destruct",
    "Don Naturel": "Natural Gift",
    "Double Baffe": "Double Slap",
    "Doux Baiser": "Sweet Kiss",
    "Draco-Charge": "Dragon Rush",
    "Draco-Météore": "Draco Meteor",
    "Draco-Queue": "Dragon Tail",
    "Dynamo-Poing": "Dynamic Punch",
    "Dégommage": "Fling",
    "Dévorêve": "Dream Eater",
    "Effort": "Endeavor",
    "Explosion": "Explosion",
    "Extrasenseur": "Extrasensory",
    "Fatal-Foudre": "Thunder",
    "Feinte": "Feint Attack",
    "Feu Sacré": "Sacred Fire",
    "Feuille Magik": "Magical Leaf",
    "Flammèche": "Ember",
    "Force Cachée": "Secret Power",
    "Forte-Paume": "Force Palm",
    "Fouet Lianes": "Vine Whip",
    "Fulmifer": "Metal Burst",
    "Furie": "Fury Attack",
    "Gaz Toxik": "Poison Gas",
    "Giclédo": "Water Spout",
    "Gonflette": "Bulk Up",
    "Griffe Acier": "Metal Claw",
    "Grobisou": "Lovely Kiss",
    "Groz’Yeux": "Leer",
    "Hurlement": "Roar",
    "Hydroblast": "Hydro Cannon",
    "Hydrocanon": "Hydro Pump",
    "Hypnose": "Hypnosis",
    "Implore": "Covet",
    "Lame Feuille": "Leaf Blade",
    "Lame Sainte": "Sacred Sword",
    "Lance-Soleil": "Solar Beam",
    "Larcin": "Thief",
    "Lien du Destin": "Destiny Bond",
    "Mach Punch": "Mach Punch",
    "Machination": "Nasty Plot",
    "Mitra-Poing": "Focus Punch",
    "Mur Lumière": "Light Screen",
    "Méga-Sangsue": "Mega Drain",
    "Mégafouet": "Power Whip",
    "Nitrocharge": "Flame Charge",
    "Ocroupi": "Muddy Water",
    "Ombre Portée": "Shadow Sneak",
    "Onde Boréale": "Aurora Beam",
    "Para-Spore": "Stun Spore",
    "Paresse": "Slack Off",
    "Picore": "Pluck",
    "Picots": "Spikes",
    "Pied Sauté": "Jump Kick",
    "Pince-Masse": "Crabhammer",
    "Piqué": "Sky Attack",
    "Piqûre": "Bug Bite",
    "Pistolet à O": "Water Gun",
    "Plénitude": "Calm Mind",
    "Poing Météore": "Meteor Mash",
    "Poing Ombre": "Shadow Punch",
    "Poison Croix": "Cross Poison",
    "Poursuite": "Pursuit",
    "Pouvoir Antique": "Ancient Power",
    "Prescience": "Future Sight",
    "Protection": "Reflect",
    "Provoc": "Taunt",
    "Queue-Poison": "Poison Tail",
    "Rafale Feu": "Blast Burn",
    "Rayon Chargé": "Charge Beam",
    "Rayon Gemme": "Power Gem",
    "Regard Médusant": "Glare",
    "Regard Noir": "Mean Look",
    "Repli": "Withdraw",
    "Représailles": "Payback",
    "Requiem": "Perish Song",
    "Riposte": "Counter",
    "Roc-Boulet": "Rock Wrecker",
    "Roue de Feu": "Flame Wheel",
    "Roulade": "Rollout",
    "Ruse": "Feint",
    "Régénération": "Refresh",
    "Sabotage": "Knock Off",
    "Sacrifice": "Submission",
    "Saumure": "Brine",
    "Siffl’Herbe": "Grass Whistle",
    "Souffle Glacé": "Frost Breath",
    "Spore": "Spore",
    "Stalactite": "Icicle Spear",
    "Surchauffe": "Overheat",
    "Surf": "Surf",
    "Survinsecte": "Struggle Bug",
    "Synthèse": "Synthesis",
    "Tacle Feu": "Heat Crash",
    "Tour Rapide": "Rapid Spin",
    "Tout ou Rien": "Final Gambit",
    "Tranche": "Slash",
    "Tranche-Nuit": "Night Slash",
    "Tranch’Herbe": "Razor Leaf",
    "Triplattaque": "Tri Attack",
    "Tunnel": "Dig",
    "Téléport": "Teleport",
    "Tête de Fer": "Iron Head",
    "Ultimawashi": "Mega Kick",
    "Ultralaser": "Hyper Beam",
    "Vampigraine": "Leech Seed",
    "Vampirisme": "Leech Life",
    "Vantardise": "Swagger",
    "Vendetta": "Revenge",
    "Vent Glace": "Icy Wind",
    "Voile Miroir": "Mirror Coat",
    "Vol Magnétik": "Magnet Rise",
    "Végé-Attaque": "Frenzy Plant",
    "Yama Arashi": "Storm Throw",
    "Zénith": "Sunny Day",
    "Ébullilave": "Lava Plume",
    "Écho": "Echoed Voice",
    "Éclair": "Thunder Shock",
    "Éclats Glace": "Ice Shard",
    "Écrasement": "Stomp",
    "Écras’Face": "Pound",
    "Écume": "Bubble",
    "Électacle": "Volt Tackle",
    "Éruption": "Eruption",
  });
  Object.assign(trainerItems, {
    "Baie Babiri": "Babiri Berry",
    "Baie Charti": "Charti Berry",
    "Baie Chocco": "Occa Berry",
    "Baie Chérim": "Custap Berry",
    "Baie Cobaba": "Coba Berry",
    "Baie Fraigo": "Haban Berry",
    "Baie Lampou": "Colbur Berry",
    "Baie Nanone": "Yache Berry",
    "Baie Parma": "Wacan Berry",
    "Baie Pocpoc": "Passho Berry",
    "Baie Pomroz": "Chople Berry",
    "Baie Ratam": "Rindo Berry",
    "Baie Sailak": "Salac Berry",
    "Baie Yapap": "Payapa Berry",
    "CT - Toxik": "TM - Toxic",
    "Joyau Acier": "Steel Gem",
    "Joyau Eau": "Water Gem",
    "Joyau Feu": "Fire Gem",
    "Joyau Glace": "Ice Gem",
    "Joyau Normal": "Normal Gem",
    "Joyau Plante": "Grass Gem",
    "Joyau Psy": "Psychic Gem",
    "Joyau Sol": "Ground Gem",
    "Joyau Spectr": "Ghost Gem",
    "Joyau Ténèbr": "Dark Gem",
    "Joyau Vol": "Flying Gem",
    "Vitesse +": "X Speed",
  });

  const trainerTextFr = {
    "trainer.englishName": "Nom anglais", "trainer.frenchName": "Nom français",
    "trainer.important": "Dresseur important", "trainer.varied": "Varié",
    "trainer.noPosition": "Non renseignée", "trainer.badge": "Badge",
    "trainer.gym": "Arène", "trainer.order": "Ordre", "trainer.type": "Type",
    "trainer.noMatch": "Aucun dresseur ne correspond à cette recherche et ces filtres.",
    "trainer.noTeamTitle": "Équipe non synchronisée",
    "trainer.noTeamBody": "Aucune équipe détaillée n'est disponible pour ce dresseur dans les données publiées.",
    "trainer.noBattleTeam": "Aucune équipe détaillée disponible.",
    "trainer.battle": "Combat", "trainer.level": "Niv.",
    "trainer.moves": "Attaques", "trainer.ability": "Talent", "trainer.item": "Objet"
  };
  const trainerTextEn = {
    "trainer.englishName": "English name", "trainer.frenchName": "French name",
    "trainer.important": "Notable Trainer", "trainer.varied": "Various",
    "trainer.noPosition": "Not available", "trainer.badge": "Badge",
    "trainer.gym": "Gym", "trainer.order": "Order", "trainer.type": "Type",
    "trainer.noMatch": "No trainer matches this search and the selected filters.",
    "trainer.noTeamTitle": "Team not synchronized",
    "trainer.noTeamBody": "No detailed team is available for this trainer in the published data.",
    "trainer.noBattleTeam": "No detailed team available.",
    "trainer.battle": "Battle", "trainer.level": "Lv.",
    "trainer.moves": "Moves", "trainer.ability": "Ability", "trainer.item": "Item"
  };
  function trainerText(key) {
    return (language === "en" ? trainerTextEn : trainerTextFr)[key] || key;
  }
  function trainerCategory(value, forceEnglish = false) {
    const raw = String(value ?? "");
    return language === "en" || forceEnglish ? raw.split(" / ").map(part => trainerCategories[part] || part).join(" / ") : raw;
  }
  function trainerLocation(region, value, forceEnglish = false) {
    const raw = String(value ?? "");
    if ((!forceEnglish && language !== "en") || !raw) return raw;
    return raw.split(" / ").map(part =>
      trainerLocations[region]?.[part] || trainerLocations.shared[part] ||
      locationNames[region]?.[part] || locationNames.shared[part] || part
    ).join(" / ");
  }
  function trainerBattle(value) {
    const raw = String(value ?? "");
    return language === "en" ? (trainerBattles[raw] || raw) : raw;
  }
  function trainerBadge(value) {
    const raw = String(value ?? "");
    return language === "en" ? (trainerBadges[raw] || raw) : raw;
  }
  function trainerMove(value) {
    const raw = String(value ?? "");
    return language === "en" ? (trainerMoves[raw] || raw) : raw;
  }
  function trainerItem(value) {
    const raw = String(value ?? "");
    return language === "en" ? (trainerItems[raw] || raw) : raw;
  }

  window.DexI18n = Object.freeze({
    get language() { return language; },
    t: translate,
    cardText,
    pokemonName,
    pokemonTerm,
    evolutionMethod,
    regionLabel,
    locationName,
    locationMethod,
    locationRarity,
    locationLevel,
    trainerText, trainerCategory, trainerLocation, trainerBattle, trainerBadge, trainerMove, trainerItem,
    setLanguage,
    applyLanguage
  });
  const select = document.querySelector("#languageSelect");
  if (select) select.addEventListener("change", (event) => setLanguage(event.target.value));
  applyLanguage();
})();
