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
  "footer.aria": "Legal information"
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

  function pokemonTerm(category, value) {
    const text = String(value ?? "");
    if (language !== "en") return text;
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

  window.DexI18n = Object.freeze({
    get language() { return language; },
    t: translate,
    cardText,
    pokemonName,
    pokemonTerm,
    evolutionMethod,
    setLanguage,
    applyLanguage
  });
  const select = document.querySelector("#languageSelect");
  if (select) select.addEventListener("change", (event) => setLanguage(event.target.value));
  applyLanguage();
})();
