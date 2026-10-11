/*
  Recherche EV par zone — Dex Compagnon V1.9.4
  Analyse POKEMONS déjà chargé depuis pokemon-data.js.
  Aucune donnée Pokémon n'est modifiée.
*/

(() => {
  const evSection = document.querySelector("#evSearchSection");
  const evCheckboxGrid = document.querySelector("#evCheckboxGrid");
  const avoidUnwantedEv = document.querySelector("#avoidUnwantedEv");
  const evResults = document.querySelector("#evResults");
  const evSummary = document.querySelector("#evSearchSummary");

  const evRegionFilters = document.querySelector("#evRegionFilters");
  const evMethodFilters = document.querySelector("#evMethodFilters");
  const evMethodsAll = document.querySelector("#evMethodsAll");
  const evMethodsNone = document.querySelector("#evMethodsNone");
  const evOldRodOnly = document.querySelector("#evOldRodOnly");
  const evProgressPlaceholder = document.querySelector("#evProgressPlaceholder");
  const evProgressContent = document.querySelector("#evProgressContent");
  const evUnlockedOnly = document.querySelector("#evUnlockedOnly");
  const evUnlockedRegionLabel = document.querySelector("#evUnlockedRegionLabel");
  const evProgressCount = document.querySelector("#evProgressCount");
  const evZoneSearch = document.querySelector("#evZoneSearch");
  const evZoneSelectList = document.querySelector("#evZoneSelectList");
  const evZonesAll = document.querySelector("#evZonesAll");
  const evZonesNone = document.querySelector("#evZonesNone");
  const evPeriodFilters = document.querySelector("#evPeriodFilters");
  const evSeasonFilters = document.querySelector("#evSeasonFilters");
  const evSeasonAuto = document.querySelector("#evSeasonAuto");
  const evSeasonAutoHelp = document.querySelector("#evSeasonAutoHelp");

  if (!evSection || !evCheckboxGrid || !evResults || !evSummary) return;

  const EV_STATS = [
    "PV",
    "Attaque",
    "Défense",
    "Attaque Spéciale",
    "Défense Spéciale",
    "Vitesse"
  ];

  const REGION_LABELS = {
    kanto: "Kanto",
    hoenn: "Hoenn",
    sinnoh: "Sinnoh",
    unys: "Unys",
    johto: "Johto"
  };

  const RARITY_WEIGHT = {
    "Très commun": 5,
    "Commun": 4,
    "Peu commun": 3,
    "Rare": 2,
    "Très rare": 1,
    "Horde": 4,
    "Leurre": 2.5,
    "Spécial": 2
  };


  // EV result labels are translated only for display. Stat keys, method values,
  // region IDs, saved progress and ranking calculations remain unchanged.
  const EV_TEXT_FR = {
    noStat: "Sélectionne au moins un EV pour lancer l'analyse.",
    noMethod: "Sélectionne au moins une méthode de rencontre.",
    noUnlocked: "Le filtre « zones débloquées » est activé, mais aucune zone n'est cochée.",
    selectZones: "Coche d'abord tes zones",
    zone: "zone", zones: "zones", unlocked: "débloquée", unlockedPlural: "débloquées",
    savedRegion: "tes choix sont mémorisés pour cette région.",
    regionAll: "toutes les régions", progression: "Filtre progression",
    period: "Période", season: "Saison", automatic: "Auto",
    resultsFor: "pour", resultsIn: "dans", displayed: "affichée", displayedPlural: "affichées",
    unlimited: "Aucune limite de résultats.",
    percentageNote: "Le pourcentage représente la part d'espèces utiles, pas un taux de rencontre exact.",
    empty: "Aucune zone correspondante avec ces filtres.",
    usefulOrMixed: "espèces utiles ou mixtes", speciesMatch: "des espèces correspondent",
    score: "score", pure: "utiles propres", mixed: "mixtes", parasites: "parasites",
    species: "des espèces", usefulWeight: "poids utile",
    good: "✓ Utile", mixedState: "⚠ Mixte", parasiteState: "✕ Parasite",
    excellent: "Excellent", veryGood: "Très bon", goodScore: "Bon", fair: "Moyen",
    poor: "Mauvais", veryPoor: "Très mauvais"
  };
  const EV_TEXT_EN = {
    noStat: "Select at least one EV stat to start the analysis.",
    noMethod: "Select at least one encounter method.",
    noUnlocked: "The unlocked-area filter is enabled, but no areas are selected.",
    selectZones: "Select your unlocked areas first",
    zone: "area", zones: "areas", unlocked: "unlocked", unlockedPlural: "unlocked",
    savedRegion: "your choices are saved for this region.",
    regionAll: "all regions", progression: "Progress filter",
    period: "Time of day", season: "Season", automatic: "Auto",
    resultsFor: "for", resultsIn: "in", displayed: "shown", displayedPlural: "shown",
    unlimited: "No result limit.",
    percentageNote: "The percentage represents the share of useful species, not an exact encounter rate.",
    empty: "No matching areas with these filters.",
    usefulOrMixed: "useful or mixed species", speciesMatch: "of species match",
    score: "score", pure: "pure useful", mixed: "mixed", parasites: "unwanted",
    species: "of species", usefulWeight: "useful weight",
    good: "✓ Useful", mixedState: "⚠ Mixed", parasiteState: "✕ Unwanted",
    excellent: "Excellent", veryGood: "Very good", goodScore: "Good", fair: "Fair",
    poor: "Poor", veryPoor: "Very poor"
  };
  const EN_METHODS = {
    "Herbes": "Grass", "Herbes sombres": "Dark grass", "Grotte": "Cave",
    "Surf": "Surf", "Canne": "Old Rod", "Super Canne": "Good Rod",
    "Méga Canne": "Super Rod", "Horde": "Horde", "Leurre": "Lure",
    "Coup de Boule": "Headbutt", "Arbre à Miel": "Honey tree",
    "Rochers": "Rocks", "Nuage de poussière": "Dust cloud",
    "Ombre": "Shadow", "Méthode inconnue": "Other"
  };
  const EN_RARITY = {
    "Très commun": "Very common", "Commun": "Common", "Peu commun": "Uncommon",
    "Rare": "Rare", "Très rare": "Very rare", "Horde": "Horde",
    "Leurre": "Lure", "Spécial": "Special"
  };
  function evEnglish() { return window.DexI18n?.language === "en"; }
  function evText(key) { return (evEnglish() ? EV_TEXT_EN : EV_TEXT_FR)[key] || key; }
  function evStatLabel(stat) {
    return evEnglish() ? (window.DexI18n?.pokemonTerm("ev", stat) || stat) : stat;
  }
  function evPokemonName(pokemon) {
    return window.DexI18n?.pokemonName(pokemon) || pokemon.nom;
  }
  function evMethodLabel(method) { return evEnglish() ? (EN_METHODS[method] || method) : method; }
  function evRarityLabel(rarity) { return evEnglish() ? (EN_RARITY[rarity] || rarity) : rarity; }
  function countLabel(count) { return evText(count === 1 ? "zone" : "zones"); }
  function evLocationName(region, zone) {
    return window.DexI18n?.locationName?.(region, zone) ?? zone;
  }

  let evRegion = "all";

  const EV_PERIOD_STORAGE_KEY = "pokemmoDexEvPeriodV1";
  const EV_SEASON_STORAGE_KEY = "pokemmoDexEvSeasonV1";

  let evPeriod = readStoredValue(EV_PERIOD_STORAGE_KEY) || "all";
  let evSeasonMode = readStoredValue(EV_SEASON_STORAGE_KEY) || "auto";

  const UNLOCKED_ZONES_STORAGE_KEY = "pokemmoDexUnlockedZonesV1";
  const UNLOCKED_FILTER_STORAGE_KEY = "pokemmoDexUnlockedZonesFilterV1";

  let unlockedZonesByRegion = loadStoredObject(UNLOCKED_ZONES_STORAGE_KEY);
  let unlockedFilterByRegion = loadStoredObject(UNLOCKED_FILTER_STORAGE_KEY);

  const allEvInputs = [...evCheckboxGrid.querySelectorAll('input[type="checkbox"]')];
  const methodInputs = evMethodFilters
    ? [...evMethodFilters.querySelectorAll('input[type="checkbox"]')]
    : [];

  function readStoredValue(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function saveStoredValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Le site fonctionne aussi lorsque le stockage local est désactivé.
    }
  }

  function loadStoredObject(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveStoredObject(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Le Dex reste utilisable même si le navigateur bloque localStorage.
    }
  }

  function normalizeForSearch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  /*
    Les conditions Matin/Jour/Nuit et saisons sont actuellement encodées
    dans certains noms de lieux issus des sources communautaires.
    On les extrait sans modifier pokemon-data.js.
  */
  function parseEncounterConditions(zone) {
    const rawZone = String(zone || "Zone inconnue").trim();

    const periods = new Set();
    const seasons = new Set();

    const periodMatchers = [
      { key: "morning", regex: /\b(matin|morning)\b/i },
      { key: "day", regex: /\b(jour|day)\b/i },
      { key: "night", regex: /\b(nuit|night)\b/i }
    ];

    const seasonMatchers = [
      { key: "spring", regex: /\b(printemps|spring|season0)\b/i },
      { key: "summer", regex: /\b(été|ete|summer|season1)\b/i },
      { key: "autumn", regex: /\b(automne|autumn|fall|season2)\b/i },
      { key: "winter", regex: /\b(hiver|winter|season3)\b/i }
    ];

    periodMatchers.forEach(({ key, regex }) => {
      if (regex.test(rawZone)) periods.add(key);
    });

    seasonMatchers.forEach(({ key, regex }) => {
      if (regex.test(rawZone)) seasons.add(key);
    });

    const hasConditions = periods.size > 0 || seasons.size > 0;

    let baseZone = rawZone;

    if (hasConditions) {
      baseZone = rawZone
        .replace(
          /\s*\((?:[^)]*(?:matin|morning|jour|day|nuit|night|printemps|spring|été|ete|summer|automne|autumn|fall|hiver|winter|season[0-3])[^)]*)\)\s*$/i,
          ""
        )
        .trim();
    }

    return {
      rawZone,
      baseZone: baseZone || rawZone,
      periods,
      seasons,
      hasConditions
    };
  }

  function progressionZoneKey(zone) {
    return parseEncounterConditions(zone).baseZone;
  }

  function currentPokeSeasonFromBrowserDate() {
    const monthIndex = new Date().getMonth();

    // Cycle saisonnier des données communautaires :
    // Jan/Mai/Sep = Printemps, Fév/Juin/Oct = Été,
    // Mar/Juil/Nov = Automne, Avr/Août/Déc = Hiver.
    return ["spring", "summer", "autumn", "winter"][monthIndex % 4];
  }

  function seasonLabel(season) {
    const labels = evEnglish()
      ? { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter", all: "All" }
      : { spring: "Printemps", summer: "Été", autumn: "Automne", winter: "Hiver", all: "Toutes" };
    return labels[season] || season;
  }

  function periodLabel(period) {
    const labels = evEnglish()
      ? { morning: "Morning", day: "Day", night: "Night", all: "All" }
      : { morning: "Matin", day: "Jour", night: "Nuit", all: "Toutes" };
    return labels[period] || period;
  }

  function effectiveSeason() {
    return evSeasonMode === "auto"
      ? currentPokeSeasonFromBrowserDate()
      : evSeasonMode;
  }

  function conditionMatches(parsed) {
    if (
      evPeriod !== "all" &&
      parsed.periods.size > 0 &&
      !parsed.periods.has(evPeriod)
    ) {
      return false;
    }

    const season = effectiveSeason();

    if (
      season !== "all" &&
      parsed.seasons.size > 0 &&
      !parsed.seasons.has(season)
    ) {
      return false;
    }

    return true;
  }

  function updateConditionControls() {
    evPeriodFilters?.querySelectorAll("[data-ev-period]").forEach((button) => {
      button.classList.toggle("active", button.dataset.evPeriod === evPeriod);
    });

    evSeasonFilters?.querySelectorAll("[data-ev-season]").forEach((button) => {
      button.classList.toggle("active", button.dataset.evSeason === evSeasonMode);
    });

    const autoSeason = currentPokeSeasonFromBrowserDate();
    const monthName = new Intl.DateTimeFormat(evEnglish() ? "en-GB" : "fr-FR", { month: "long" })
      .format(new Date());

    if (evSeasonAuto) {
      evSeasonAuto.textContent = `${evText("automatic")} : ${seasonLabel(autoSeason)}`;
    }

    if (evSeasonAutoHelp) {
      evSeasonAutoHelp.textContent = evEnglish()
        ? `Device date: ${monthName} → estimated season according to the encounter-data calendar: ${seasonLabel(autoSeason)}.`
        : `Date du PC : ${monthName} → saison estimée selon le calendrier des données : ${seasonLabel(autoSeason)}.`;
    }
  }


  function naturalZoneSort(a, b) {
    return String(a).localeCompare(String(b), "fr", {
      numeric: true,
      sensitivity: "base"
    });
  }

  function regionZones(region) {
    return zonesByRegion.get(region) || [];
  }

  function currentUnlockedSet() {
    if (evRegion === "all") return new Set();

    const saved = unlockedZonesByRegion[evRegion];
    return new Set(Array.isArray(saved) ? saved : []);
  }

  function saveUnlockedSet(region, values) {
    unlockedZonesByRegion[region] = [...new Set(values)].sort(naturalZoneSort);
    saveStoredObject(UNLOCKED_ZONES_STORAGE_KEY, unlockedZonesByRegion);
  }

  function isUnlockedFilterEnabled() {
    if (evRegion === "all") return false;
    return Boolean(unlockedFilterByRegion[evRegion]);
  }

  function saveUnlockedFilter(region, enabled) {
    unlockedFilterByRegion[region] = Boolean(enabled);
    saveStoredObject(UNLOCKED_FILTER_STORAGE_KEY, unlockedFilterByRegion);
  }

  function updateProgressCount() {
    if (!evProgressCount || evRegion === "all") return;

    const allZones = regionZones(evRegion);
    const unlocked = currentUnlockedSet();
    const validCount = allZones.filter((zone) => unlocked.has(zone)).length;

    evProgressCount.textContent = `${validCount}/${allZones.length} ${countLabel(allZones.length)}`;
  }

  function filterZoneChoices() {
    if (!evZoneSearch || !evZoneSelectList) return;

    const query = normalizeForSearch(evZoneSearch.value);

    evZoneSelectList.querySelectorAll(".ev-zone-choice").forEach((label) => {
      const originalName = normalizeForSearch(label.dataset.zone);
      const localizedName = normalizeForSearch(evLocationName(evRegion, label.dataset.zone));
      label.classList.toggle(
        "hidden-by-search",
        Boolean(query) && !originalName.includes(query) && !localizedName.includes(query)
      );
    });
  }

  function renderProgressionSelector() {
    if (
      !evProgressPlaceholder ||
      !evProgressContent ||
      !evZoneSelectList ||
      !evUnlockedOnly
    ) return;

    if (evRegion === "all") {
      evProgressPlaceholder.classList.remove("hidden");
      evProgressContent.classList.add("hidden");
      evUnlockedOnly.checked = false;
      evZoneSelectList.innerHTML = "";
      return;
    }

    evProgressPlaceholder.classList.add("hidden");
    evProgressContent.classList.remove("hidden");

    const zones = regionZones(evRegion);
    const unlocked = currentUnlockedSet();

    evUnlockedOnly.checked = isUnlockedFilterEnabled();

    if (evUnlockedRegionLabel) {
      evUnlockedRegionLabel.textContent =
        `${regionLabel(evRegion)} — ${evText("savedRegion")}`;
    }

    evZoneSelectList.innerHTML = "";

    zones.forEach((zone) => {
      const label = document.createElement("label");
      label.className = "ev-zone-choice";
      label.dataset.zone = zone;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = zone;
      input.checked = unlocked.has(zone);

      const text = document.createElement("span");
      text.textContent = evLocationName(evRegion, zone);
      text.title = text.textContent;

      input.addEventListener("change", () => {
        const next = currentUnlockedSet();

        if (input.checked) next.add(zone);
        else next.delete(zone);

        saveUnlockedSet(evRegion, [...next]);
        updateProgressCount();

        if (isUnlockedFilterEnabled()) renderEvSearch();
      });

      label.appendChild(input);
      label.appendChild(text);
      evZoneSelectList.appendChild(label);
    });

    if (evZoneSearch) evZoneSearch.value = "";
    updateProgressCount();
  }

  function selectedUnlockedZonesForFiltering() {
    if (!isUnlockedFilterEnabled() || evRegion === "all") return null;
    return currentUnlockedSet();
  }

  function selectedEvs() {
    return allEvInputs.filter((input) => input.checked).map((input) => input.value);
  }

  function selectedMethods() {
    return new Set(
      methodInputs.filter((input) => input.checked).map((input) => input.value)
    );
  }

  function enforceSelectionLimit() {
    const selected = selectedEvs();
    const reachedLimit = selected.length >= 3;

    allEvInputs.forEach((input) => {
      input.disabled = reachedLimit && !input.checked;
    });
  }

  function encounterChannel(location) {
    const rarity = location?.rarete || "";

    if (rarity === "Horde") return "Horde";
    if (rarity === "Leurre") return "Leurre";

    const method = location?.methode || "Méthode inconnue";

    // La source possède parfois un type générique "Fishing".
    // On ne le présente pas comme une 4e canne ambiguë.
    if (method === "Pêche") return "Méthode inconnue";

    return method;
  }

  // Index créé une fois au chargement : les données de rencontre sont statiques.
  const encounterIndex = [];
  const zonesByRegion = new Map();

  POKEMONS.forEach((pokemon) => {
    Object.entries(pokemon.locations || {}).forEach(([region, locations]) => {
      if (!Array.isArray(locations)) return;

      if (!zonesByRegion.has(region)) zonesByRegion.set(region, new Set());

      locations.forEach((location) => {
        const parsed = parseEncounterConditions(location.zone || "Zone inconnue");
        const method = encounterChannel(location);
        encounterIndex.push({ pokemon, region, location, parsed, method });
        zonesByRegion.get(region).add(parsed.baseZone);
      });
    });
  });

  for (const [region, zones] of zonesByRegion) {
    zonesByRegion.set(region, [...zones].filter(Boolean).sort(naturalZoneSort));
  }

  function rarityWeight(rarity) {
    return RARITY_WEIGHT[rarity] ?? 2.5;
  }

  function maxRarityWeight(encounters) {
    if (!encounters.length) return 2.5;
    return Math.max(...encounters.map((entry) => rarityWeight(entry.rarete)));
  }

  function bestRarity(encounters) {
    if (!encounters.length) return "—";
    return [...encounters].sort(
      (a, b) => rarityWeight(b.rarete) - rarityWeight(a.rarete)
    )[0].rarete || "—";
  }

  function yieldInfo(pokemon, wanted) {
    const yields = pokemon.ev || {};
    let wantedPoints = 0;
    let unwantedPoints = 0;
    const wantedBreakdown = {};
    const unwantedBreakdown = {};

    EV_STATS.forEach((stat) => {
      const value = Number(yields[stat] || 0);
      if (!value) return;

      if (wanted.includes(stat)) {
        wantedPoints += value;
        wantedBreakdown[stat] = value;
      } else {
        unwantedPoints += value;
        unwantedBreakdown[stat] = value;
      }
    });

    let state = "parasite";
    if (wantedPoints > 0 && unwantedPoints === 0) state = "useful";
    if (wantedPoints > 0 && unwantedPoints > 0) state = "mixed";

    return {
      wantedPoints,
      unwantedPoints,
      wantedBreakdown,
      unwantedBreakdown,
      state
    };
  }

  function buildZoneIndex(regionFilter, wanted, allowedMethods, allowedZones = null) {
    const groups = new Map();

    encounterIndex.forEach(({ pokemon, region, location, parsed, method }) => {
      if (regionFilter !== "all" && region !== regionFilter) return;
      if (!conditionMatches(parsed) || !allowedMethods.has(method)) return;

      const zone = parsed.baseZone;
      if (allowedZones && !allowedZones.has(zone)) return;

      const key = `${region}|||${zone}|||${method}`;
      if (!groups.has(key)) {
        groups.set(key, { region, zone, method, species: new Map() });
      }

      const group = groups.get(key);
      if (!group.species.has(pokemon.id)) {
        group.species.set(pokemon.id, { pokemon, encounters: [] });
      }
      group.species.get(pokemon.id).encounters.push({
        ...location,
        _conditionInfo: parsed
      });
    });

    return [...groups.values()].map((group) => analyzeGroup(group, wanted));
  }

  function analyzeGroup(group, wanted) {
    const species = [...group.species.values()].map((entry) => {
      const info = yieldInfo(entry.pokemon, wanted);

      return {
        ...entry,
        ...info,
        rarityWeight: maxRarityWeight(entry.encounters),
        rarity: bestRarity(entry.encounters)
      };
    });

    const useful = species.filter((entry) => entry.state === "useful");
    const mixed = species.filter((entry) => entry.state === "mixed");
    const parasites = species.filter((entry) => entry.state === "parasite");
    const relevant = species.filter((entry) => entry.wantedPoints > 0);

    const totalSpecies = species.length;
    const usefulSpeciesRatio = totalSpecies ? relevant.length / totalSpecies : 0;

    const totalWeight = species.reduce((sum, entry) => sum + entry.rarityWeight, 0);
    const avoid = avoidUnwantedEv.checked;

    const weightedUtility = totalWeight
      ? species.reduce((sum, entry) => {
          if (entry.state === "useful") {
            return sum + entry.rarityWeight * (1 + Math.min(entry.wantedPoints - 1, 2) * 0.18);
          }

          if (entry.state === "mixed") {
            return sum + entry.rarityWeight * (avoid ? 0.18 : 0.65);
          }

          return sum;
        }, 0) / totalWeight
      : 0;

    const coverage = {};
    wanted.forEach((ev) => coverage[ev] = 0);

    relevant.forEach((entry) => {
      Object.entries(entry.wantedBreakdown).forEach(([ev, value]) => {
        coverage[ev] += value * entry.rarityWeight;
      });
    });

    const represented = wanted.filter((ev) => coverage[ev] > 0).length;
    const coverageRatio = wanted.length ? represented / wanted.length : 0;

    let balance = 1;
    const positive = wanted.map((ev) => coverage[ev]).filter((value) => value > 0);

    if (wanted.length > 1) {
      if (positive.length !== wanted.length) {
        balance = 0.35;
      } else {
        const min = Math.min(...positive);
        const max = Math.max(...positive);
        balance = max ? min / max : 0;
      }
    }

    const parasiteRatio = totalSpecies
      ? (
          parasites.length +
          (avoid ? mixed.length * 0.8 : mixed.length * 0.35)
        ) / totalSpecies
      : 1;

    let score =
      weightedUtility * 52 +
      usefulSpeciesRatio * 20 +
      coverageRatio * 16 +
      balance * 12 -
      parasiteRatio * 12;

    score = Math.max(0, Math.min(100, score));

    return {
      ...group,
      species,
      useful,
      mixed,
      parasites,
      relevant,
      totalSpecies,
      usefulSpeciesRatio,
      coverage,
      coverageRatio,
      balance,
      score
    };
  }

  function starsFromUsefulRatio(ratio) {
    const percent = Math.round(ratio * 100);

    let count = 0;
    if (percent >= 90) count = 5;
    else if (percent >= 75) count = 4;
    else if (percent >= 60) count = 3;
    else if (percent >= 40) count = 2;
    else if (percent >= 20) count = 1;

    return "★".repeat(count) + "☆".repeat(5 - count);
  }

  function usefulRatioLabel(ratio) {
    const percent = Math.round(ratio * 100);

    if (percent >= 90) return evText("excellent");
    if (percent >= 75) return evText("veryGood");
    if (percent >= 60) return evText("goodScore");
    if (percent >= 45) return evText("fair");
    if (percent >= 25) return evText("poor");
    return evText("veryPoor");
  }

  function regionLabel(region) {
    return window.DexI18n?.regionLabel?.(region) || REGION_LABELS[region] || region;
  }

  function createYieldBadges(entry) {
    const all = { ...(entry.pokemon.ev || {}) };

    return Object.entries(all)
      .filter(([, value]) => Number(value) > 0)
      .map(([stat, value]) => {
        const wanted = selectedEvs().includes(stat);
        return `<span${wanted ? ' class="wanted-ev"' : ""}>+${escapeHtml(value)} ${escapeHtml(evStatLabel(stat))}</span>`;
      })
      .join("");
  }

  function stateLabel(state) {
    if (state === "useful") return evText("good");
    if (state === "mixed") return evText("mixedState");
    return evText("parasiteState");
  }

  function createZoneCard(group, rank) {
    const details = document.createElement("details");
    details.className = "ev-zone-card";

    if (rank < 3) details.classList.add("recommended");
    if (rank === 0) details.open = true;

    const relevantPercent = Math.round(group.usefulSpeciesRatio * 100);

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="ev-zone-title">
        <div class="ev-zone-title-row">
          <h3>${rank + 1}. ${escapeHtml(evLocationName(group.region, group.zone))}</h3>
          <span class="ev-zone-region">${escapeHtml(regionLabel(group.region))}</span>
          <span class="ev-zone-method">${escapeHtml(evMethodLabel(group.method))}</span>
        </div>

        <div class="ev-zone-meta">
          <span>${group.relevant.length}/${group.totalSpecies} ${evText("usefulOrMixed")}</span>
          <span>•</span>
          <span>${relevantPercent}% ${evText("speciesMatch")}</span>
        </div>
      </div>

      <div class="ev-score-box">
        <span class="ev-stars">${starsFromUsefulRatio(group.usefulSpeciesRatio)}</span>
        <span class="ev-score-label">${usefulRatioLabel(group.usefulSpeciesRatio)} · ${evText("score")} ${Math.round(group.score)}</span>
      </div>
    `;

    details.appendChild(summary);

    // Une fiche fermée n'a pas besoin de ses lignes Pokémon dans le DOM.
    // On construit son contenu lors de la première ouverture seulement.
    function populateBody() {
      const body = document.createElement("div");
      body.className = "ev-zone-body";

      body.innerHTML = `
        <div class="ev-zone-stats">
          <div class="ev-stat-box good">
            <strong>${group.useful.length}</strong>
            <span>${evText("pure")}</span>
          </div>
          <div class="ev-stat-box warn">
            <strong>${group.mixed.length}</strong>
            <span>${evText("mixed")}</span>
          </div>
          <div class="ev-stat-box bad">
            <strong>${group.parasites.length}</strong>
            <span>${evText("parasites")}</span>
          </div>
          <div class="ev-stat-box">
            <strong>${relevantPercent}%</strong>
            <span>${evText("species")}</span>
          </div>
        </div>

        <div class="ev-breakdown">
          ${selectedEvs().map((ev) => `
            <span class="ev-breakdown-badge">
              <strong>${escapeHtml(evStatLabel(ev))}</strong>
              <span>${evText("usefulWeight")} ${group.coverage[ev] ? group.coverage[ev].toFixed(1) : "0"}</span>
            </span>
          `).join("")}
        </div>

        <div class="ev-pokemon-list"></div>
      `;

      const list = body.querySelector(".ev-pokemon-list");

      const ordered = [...group.species].sort((a, b) => {
        const order = { useful: 0, mixed: 1, parasite: 2 };

        return (
          order[a.state] - order[b.state] ||
          b.rarityWeight - a.rarityWeight ||
          b.wantedPoints - a.wantedPoints ||
          a.pokemon.nom.localeCompare(b.pokemon.nom, "fr")
        );
      });

      ordered.forEach((entry) => {
        const row = document.createElement("div");
        row.className = `ev-pokemon-row ${entry.state}`;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "ev-pokemon-link";
        button.textContent = evPokemonName(entry.pokemon);

        button.addEventListener("click", () => {
          switchSearchMode("pokemon");
          selectPokemon(entry.pokemon);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        const yields = document.createElement("div");
        yields.className = "ev-yield-inline";
        yields.innerHTML = createYieldBadges(entry);

        const rarity = document.createElement("span");
        rarity.className = "ev-rarity";
        rarity.textContent = evRarityLabel(entry.rarity || "—");

        const state = document.createElement("span");
        state.className = `ev-row-state ${entry.state}`;
        state.textContent = stateLabel(entry.state);

        row.appendChild(button);
        row.appendChild(yields);
        row.appendChild(rarity);
        row.appendChild(state);
        list.appendChild(row);
      });

      details.appendChild(body);
    }

    if (details.open) {
      populateBody();
    } else {
      details.addEventListener("toggle", () => {
        if (details.open) populateBody();
      }, { once: true });
    }
    return details;
  }

  function renderEvSearch() {
    enforceSelectionLimit();

    const wanted = selectedEvs();

    if (!wanted.length) {
      evSummary.textContent = evText("noStat");
      evResults.innerHTML = "";
      return;
    }

    const methods = selectedMethods();

    if (!methods.size) {
      evSummary.textContent = evText("noMethod");
      evResults.innerHTML = "";
      return;
    }

    const allowedZones = selectedUnlockedZonesForFiltering();

    if (allowedZones && allowedZones.size === 0) {
      evSummary.innerHTML = `
        <span class="ev-progress-warning">
          ${evText("noUnlocked")}
        </span>
      `;
      evResults.innerHTML = "";
      return;
    }

    const groups = buildZoneIndex(evRegion, wanted, methods, allowedZones)
      .filter((group) => group.relevant.length > 0)
      .sort((a, b) =>
        b.score - a.score ||
        b.usefulSpeciesRatio - a.usefulSpeciesRatio ||
        b.relevant.length - a.relevant.length ||
        a.zone.localeCompare(b.zone, "fr")
      );

    const regionText = evRegion === "all"
      ? evText("regionAll")
      : regionLabel(evRegion);

    const progressionText = allowedZones
      ? ` ${evText("progression")} : <strong>${allowedZones.size} ${countLabel(allowedZones.size)} ${evText(allowedZones.size === 1 ? "unlocked" : "unlockedPlural")}</strong>.`
      : "";

    const seasonText = evSeasonMode === "auto"
      ? `${evText("automatic")} (${seasonLabel(effectiveSeason())})`
      : seasonLabel(effectiveSeason());

    const displayed = evText(groups.length === 1 ? "displayed" : "displayedPlural");
    evSummary.innerHTML = `
      <strong>${groups.length}</strong> ${countLabel(groups.length)} ${displayed} ${evText("resultsFor")}
      <strong>${wanted.map((ev) => escapeHtml(evStatLabel(ev))).join(" + ")}</strong>
      ${evText("resultsIn")} <strong>${escapeHtml(regionText)}</strong>.
      ${evText("period")} : <strong>${periodLabel(evPeriod)}</strong>.
      ${evText("season")} : <strong>${seasonText}</strong>.
      ${progressionText}
      <strong>${evText("unlimited")}</strong>
      ${evText("percentageNote")}
    `;

    evResults.innerHTML = "";

    if (!groups.length) {
      evResults.innerHTML = `
        <div class="ev-empty-results">
          ${evText("empty")}
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    groups.forEach((group, index) => {
      fragment.appendChild(createZoneCard(group, index));
    });
    evResults.appendChild(fragment);
  }

  function setEvRegion(region) {
    evRegion = region;

    if (evRegionFilters) {
      evRegionFilters.querySelectorAll("[data-ev-region]").forEach((button) => {
        button.classList.toggle("active", button.dataset.evRegion === region);
      });
    }

    renderProgressionSelector();
    renderEvSearch();
  }

  function setAllMethods(checked) {
    methodInputs.forEach((input) => {
      input.checked = checked;
    });

    renderEvSearch();
  }

  function selectOnlyMethod(method) {
    methodInputs.forEach((input) => {
      input.checked = input.value === method;
    });

    renderEvSearch();
  }

  allEvInputs.forEach((input) => {
    input.addEventListener("change", renderEvSearch);
  });

  avoidUnwantedEv.addEventListener("change", renderEvSearch);

  methodInputs.forEach((input) => {
    input.addEventListener("change", renderEvSearch);
  });

  evRegionFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ev-region]");
    if (!button) return;
    setEvRegion(button.dataset.evRegion);
  });

  evMethodsAll?.addEventListener("click", () => setAllMethods(true));
  evMethodsNone?.addEventListener("click", () => setAllMethods(false));
  evOldRodOnly?.addEventListener("click", () => selectOnlyMethod("Canne"));

  evPeriodFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ev-period]");
    if (!button) return;

    evPeriod = button.dataset.evPeriod;
    saveStoredValue(EV_PERIOD_STORAGE_KEY, evPeriod);
    updateConditionControls();
    renderEvSearch();
  });

  evSeasonFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ev-season]");
    if (!button) return;

    evSeasonMode = button.dataset.evSeason;
    saveStoredValue(EV_SEASON_STORAGE_KEY, evSeasonMode);
    updateConditionControls();
    renderEvSearch();
  });

  evUnlockedOnly?.addEventListener("change", () => {
    if (evRegion === "all") return;

    const checked = evUnlockedOnly.checked;
    const unlocked = currentUnlockedSet();

    if (checked && unlocked.size === 0) {
      evUnlockedOnly.checked = false;

      if (evProgressCount) {
        evProgressCount.textContent = evText("selectZones");
        evProgressCount.classList.add("ev-progress-warning");
      }

      return;
    }

    evProgressCount?.classList.remove("ev-progress-warning");
    saveUnlockedFilter(evRegion, checked);
    renderEvSearch();
  });

  evZoneSearch?.addEventListener("input", filterZoneChoices);

  evZonesAll?.addEventListener("click", () => {
    if (evRegion === "all") return;

    const zones = regionZones(evRegion);
    saveUnlockedSet(evRegion, zones);
    renderProgressionSelector();

    if (isUnlockedFilterEnabled()) renderEvSearch();
  });

  evZonesNone?.addEventListener("click", () => {
    if (evRegion === "all") return;

    saveUnlockedSet(evRegion, []);
    saveUnlockedFilter(evRegion, false);
    renderProgressionSelector();
    renderEvSearch();
  });

  /*
    trainer-app.js gère déjà Pokémon/Dresseurs.
    On étend simplement son changement de mode.
  */
  const previousSwitchSearchMode = switchSearchMode;

  switchSearchMode = function(mode) {
    if (mode !== "ev") {
      appShell.classList.remove("ev-mode");
      evSection.classList.add("hidden");
      previousSwitchSearchMode(mode);
      return;
    }

    currentSearchMode = "ev";

    appShell.classList.remove("trainer-mode");
    appShell.classList.add("ev-mode");

    modeTabs.querySelectorAll(".mode-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === "ev");
    });

    pokemonSearchSection.classList.add("hidden");
    trainerSearchSection.classList.add("hidden");
    evSection.classList.remove("hidden");

    pokemonCard.classList.add("hidden");
    emptyState.classList.add("hidden");
    trainerCard.classList.add("hidden");
    trainerEmptyState.classList.add("hidden");

    renderEvSearch();
  };

  // Choix utile par défaut : Attaque + Vitesse.
  const attack = allEvInputs.find((input) => input.value === "Attaque");
  const speed = allEvInputs.find((input) => input.value === "Vitesse");

  if (attack) attack.checked = true;
  if (speed) speed.checked = true;

  /*
    Si une région était déjà choisie dans le Pokédex au moment du chargement,
    on l'utilise comme valeur initiale pour la Recherche EV.
  */
  const currentGlobalRegion =
    document.querySelector(".region-btn.active")?.dataset.region || "all";

  evRegion = currentGlobalRegion;
  updateConditionControls();
  setEvRegion(evRegion);
  enforceSelectionLimit();

  // Refresh existing EV cards when the visitor switches language.
  // Recomputing the display does not alter selected filters or saved progress.
  document.addEventListener("dex:languagechange", () => {
    updateConditionControls();
    if (evRegion !== "all") {
      if (evUnlockedRegionLabel) {
        evUnlockedRegionLabel.textContent =
          `${regionLabel(evRegion)} — ${evText("savedRegion")}`;
      }
      updateProgressCount();
    }
    // Keep the original checkbox values and data-zone attributes for saved progress.
    evZoneSelectList?.querySelectorAll(".ev-zone-choice").forEach((label) => {
      const span = label.querySelector("span");
      if (span) {
        span.textContent = evLocationName(evRegion, label.dataset.zone);
        span.title = span.textContent;
      }
    });
    filterZoneChoices();
    renderEvSearch();
  });
})();
