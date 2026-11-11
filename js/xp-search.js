/* Recherche XP — Dex Compagnon V2.1
 * Exploite les données locales sans les modifier. Les efficacités supposent
 * une attaque STAB du type choisi ; les dangers sont POTENTIELS.
 */
(() => {
  "use strict";

  const section = document.querySelector("#xpSearchSection");
  if (!section || typeof POKEMONS === "undefined") return;
  const input = document.querySelector("#xpPokemonSearch");
  const suggestions = document.querySelector("#xpSuggestions");
  const levelInput = document.querySelector("#xpLevel");
  const attackSelect = document.querySelector("#xpAttackType");
  const assumption = document.querySelector("#xpAssumption");
  const summary = document.querySelector("#xpSearchSummary");
  const results = document.querySelector("#xpResults");
  const more = document.querySelector("#xpShowMore");
  const regionFilters = document.querySelector("#xpRegionFilters");
  const methodFilters = document.querySelector("#xpMethodFilters");
  const periodInput = document.querySelector("#xpPeriod");
  const seasonInput = document.querySelector("#xpSeason");
  const suitableOnly = document.querySelector("#xpSuitableOnly");
  const evFilters = document.querySelector("#xpEvFilters");
  const evSelectionCount = document.querySelector("#xpEvSelectionCount");
  const zoneRegionRow = document.querySelector("#xpZoneRegionRow");
  const zoneRegionSelect = document.querySelector("#xpZoneRegionSelect");
  const unlockedOnly = document.querySelector("#xpUnlockedOnly");
  const unlockedHelp = document.querySelector("#xpUnlockedHelp");
  const progressPlaceholder = document.querySelector("#xpProgressPlaceholder");
  const progressContent = document.querySelector("#xpProgressContent");
  const progressCount = document.querySelector("#xpProgressCount");
  const zoneSearch = document.querySelector("#xpZoneSearch");
  const zoneChoices = document.querySelector("#xpZoneSelectList");
  const zonesAll = document.querySelector("#xpZonesAll");
  const zonesNone = document.querySelector("#xpZonesNone");
  const zonePicker = window.DexZoneProgress.createPicker({
    list: zoneChoices,
    normalButton: document.querySelector("#xpZoneViewNormal"),
    simpleButton: document.querySelector("#xpZoneViewSimple"),
    storageKey: "dexCompagnonXpZoneViewV1",
    getSelected: () => new Set(unlockedList()),
    getLabel: (region, zone) => zoneLabel(region, zone),
    onSelectionChange: zones => saveZones(zones)
  });
  // Clés XP distinctes : aucune lecture ni écriture du stockage de Recherche EV.
  const XP_ZONES_STORAGE_KEY = "dexCompagnonXpUnlockedZonesV1";
  const XP_FILTER_STORAGE_KEY = "dexCompagnonXpUnlockedFilterV1";
  const XP_EV_STORAGE_KEY = "dexCompagnonXpEvFilterV1"; // Lecture de l'ancien choix unique, écriture d'un tableau.
  const XP_REGIONS_STORAGE_KEY = "dexCompagnonXpRegionsV2";
  const XP_UNLOCKED_ACTIVE_KEY = "dexCompagnonXpUnlockedOnlyV2";
  const EV_STATS = ["PV", "Attaque", "Défense", "Attaque Spéciale", "Défense Spéciale", "Vitesse"];
  const EV_SHORT_FR = { "PV": "PV", "Attaque": "Attaque", "Défense": "Défense", "Attaque Spéciale": "Att. Spé.", "Défense Spéciale": "Déf. Spé.", "Vitesse": "Vitesse" };
  const EV_SHORT_EN = { "PV": "HP", "Attaque": "Attack", "Défense": "Defense", "Attaque Spéciale": "Sp. Atk", "Défense Spéciale": "Sp. Def", "Vitesse": "Speed" };
  const t = () => window.DexI18n?.language === "en" ? EN : FR;
  const txt = (key) => t()[key] || key;
  const label = (p) => window.DexI18n?.pokemonName(p) || p.nom;
  const typeLabel = (type) => window.DexI18n?.pokemonTerm?.("type", type) || type;
  const zoneLabel = (region, zone) => window.DexI18n?.locationName?.(region, zone) || zone;
  const regionLabel = (region) => window.DexI18n?.regionLabel?.(region) || region;
  const evShortLabel = stat => (window.DexI18n?.language === "en" ? EV_SHORT_EN : EV_SHORT_FR)[stat] || stat;
  const evValue = (pokemon, stat) => Math.max(0, Number(pokemon.ev?.[stat] || 0));
  function refreshEvChips() {
    evFilters.querySelectorAll("[data-xp-ev]").forEach(btn => {
      const active = btn.dataset.xpEv === "all" ? !evTargets.length : evTargets.includes(btn.dataset.xpEv);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.disabled = evTargets.length === 2 && btn.dataset.xpEv !== "all" && !active;
    });
    evSelectionCount.textContent = `${evTargets.length}/2 EV`;
  }
  const targetingEvs = () => evTargets.length > 0;
  const evMatch = p => evTargets.some(stat => evValue(p, stat) > 0);
  const evMatchCount = p => evTargets.filter(stat => evValue(p, stat) > 0).length;
  const evMatchAmount = p => evTargets.reduce((sum, stat) => sum + evValue(p, stat), 0);
  const methodLabel = (method) => {
    const translated = window.DexI18n?.locationMethod?.(method);
    return window.DexI18n?.language === "en" && (!translated || translated === method)
      ? (METHOD_EN[method] || method) : (translated || method);
  };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  const fmt = (n) => new Intl.NumberFormat(window.DexI18n?.language === "en" ? "en" : "fr", { maximumFractionDigits: 1 }).format(n);
  const FR = {
    select: "Choisis un Pokémon dans les suggestions pour lancer la recherche.",
    level: "Saisis un niveau entier entre 1 et 100.",
    noMethod: "Sélectionne au moins une méthode de rencontre.",
    noZones: "Aucune zone XP cochée dans les régions sélectionnées. Configure leurs routes ci-dessus.",
    noResults: "Aucune zone compatible avec ces filtres. Essaie une autre région, méthode ou désactive le filtre de niveau.",
    regions: "toutes les régions", zones: "zones", zone: "zone", found: "trouvées", for: "pour", levelName: "niveau",
    favorable: "favorables", species: "espèces", score: "Score XP", average: "EXP de base moy.",
    types: "Types", levelRange: "Niveaux sauvages", encounters: "Espèces de la zone", suitable: "adaptées au niveau",
    more: "Afficher plus de zones", shown: "affichées", good: "Favorable", neutral: "Neutre", hard: "Résiste", immune: "Immunisé",
    unknown: "Niveau non renseigné", tooHigh: "Niveau élevé", tooLow: "Niveau faible", risk: "Danger potentiel", riskStrong: "Danger important",
    warning: "Un adversaire de type {types} pourrait utiliser une attaque super efficace sur ton Pokémon (×{multiplier}). Ses attaques réelles ne sont pas vérifiées.",
    levelWarning: "Certains niveaux sauvages dépassent celui de ton Pokémon.",
    usedType: "Types STAB supposés", auto: "Auto (meilleur des types)",
    all: "Toutes", approx: "Classement indicatif basé sur la couverture des faiblesses, les niveaux et l'EXP de base, pas l'EXP/heure.",
    progress: "Zones XP enregistrées", progressHelp: "Tes zones XP sont indépendantes des zones EV.",
    progressHelpMulti: "Filtre sur toutes les régions cochées ; zones XP indépendantes des zones EV.",
    filterUnavailable: "Aucune zone XP cochée dans cette région.",
    before: "L'attaque", after: "est supposée disponible : nous ne vérifions pas les capacités apprises.",
    allTypes: "Attaque STAB", noSuitable: "Hors tranche", dangerType: "Type menaçant", percent: "des espèces vulnérables",
    evScore: "Score XP + EV", evTarget: "EV visé", evTargets: "EV visés", evSpecies: "espèces donnent cet EV",
    evIdeal: "favorables et adaptées", evNone: "EV non renseignés",
    evFilterNoResults: "Aucune zone ne correspond à cet EV avec les autres filtres. Essaie une autre région, une autre méthode ou désactive le filtre de niveau.",
    evFiltered: "Classement XP + EV : zones favorisées selon les EV choisis, les faiblesses et les niveaux. Les autres espèces restent visibles.",
    pin: "Épingler cette zone en haut", unpin: "Retirer cette zone des épingles"
  };
  const EN = {
    select: "Choose a Pokémon from the suggestions to start searching.",
    level: "Enter a whole number from 1 to 100.",
    noMethod: "Select at least one encounter method.",
    noZones: "No XP areas selected in the chosen regions. Configure their routes above.",
    noResults: "No matching area with these filters. Try another region or method, or turn off the level filter.",
    regions: "all regions", zones: "areas", zone: "area", found: "found", for: "for", levelName: "level",
    favorable: "favorable", species: "species", score: "XP score", average: "Avg. base EXP",
    types: "Types", levelRange: "Wild levels", encounters: "Area species", suitable: "at suitable levels",
    more: "Show more areas", shown: "displayed", good: "Favorable", neutral: "Neutral", hard: "Resists", immune: "Immune",
    unknown: "Unknown level", tooHigh: "High level", tooLow: "Low level", risk: "Potential danger", riskStrong: "Serious danger",
    warning: "A {types}-type opponent might have a super-effective move against your Pokémon (×{multiplier}). Actual moves have not been checked.",
    levelWarning: "Some wild levels are higher than your Pokémon's level.",
    usedType: "Assumed STAB types", auto: "Auto (best matching type)",
    all: "All", approx: "Indicative ranking based on type advantage, levels and base EXP, not EXP/hour.",
    progress: "Saved XP areas", progressHelp: "Your XP areas are independent of EV areas.",
    progressHelpMulti: "Filters every selected region; XP areas remain separate from EV areas.",
    filterUnavailable: "No XP areas selected in this region.",
    before: "A", after: "attack is assumed to be available; learned moves are not checked.",
    allTypes: "STAB attack", noSuitable: "Out of range", dangerType: "Threatening type", percent: "of wild species vulnerable",
    evScore: "XP + EV score", evTarget: "Target EV", evTargets: "Target EVs", evSpecies: "species yield this EV",
    evIdeal: "favorable and level-suitable", evNone: "No EV data",
    evFilterNoResults: "No areas match this EV and the other filters. Try another region or method, or turn off the level filter.",
    evFiltered: "XP + EV ranking: areas favor the selected EVs, type matchup and levels. Other species remain visible.",
    pin: "Pin this area to the top", unpin: "Unpin this area"
  };
  const METHOD_EN = {
    "Herbes":"Grass", "Herbes sombres":"Dark grass", "Grotte":"Cave", "Canne":"Old Rod",
    "Super Canne":"Good Rod", "Méga Canne":"Super Rod", "Intérieur":"Indoors", "Rochers":"Rocks",
    "Coup de Boule":"Headbutt", "Nuage de poussière":"Dust cloud", "Ombre":"Shadow",
    "Arbre à Miel":"Honey tree", "Méthode inconnue":"Other", "Horde":"Horde", "Leurre":"Lure"
  };
  const METHOD_ORDER = ["Herbes", "Herbes sombres", "Grotte", "Intérieur", "Surf", "Canne", "Super Canne", "Méga Canne", "Horde", "Leurre", "Coup de Boule", "Arbre à Miel", "Rochers", "Nuage de poussière", "Ombre", "Méthode inconnue"];
  const RARITY_PRIORITY = { "Très commun": 5, "Commun": 4, "Peu commun": 3, "Rare": 2, "Très rare": 1, "Horde": 3, "Leurre": 2, "Spécial": 2 };
  const REGION_NAMES = ["kanto", "hoenn", "sinnoh", "unys", "johto"];
  const BATCH = 25;
  let chosen = null;
  let evTargets = [];
  try {
    const saved = localStorage.getItem(XP_EV_STORAGE_KEY);
    // Compatibilité : la β6 enregistrait un seul nom d'EV, pas un tableau.
    let values;
    try { values = JSON.parse(saved); } catch { values = saved; }
    if (Array.isArray(values)) evTargets = [...new Set(values.filter(stat => EV_STATS.includes(stat)))].slice(0, 2);
    else if (EV_STATS.includes(values)) evTargets = [values];
  } catch { /* Le filtre reste disponible sans stockage local. */ }
  let selectedRegions = new Set(REGION_NAMES);
  try {
    const saved = JSON.parse(localStorage.getItem(XP_REGIONS_STORAGE_KEY) || "null");
    if (Array.isArray(saved)) {
      const valid = saved.filter(value => REGION_NAMES.includes(value));
      if (valid.length) selectedRegions = new Set(valid);
    }
  } catch { /* Par défaut : les cinq régions. */ }
  // Si l'utilisateur a coché les cinq régions une à une, un clic sur une
  // seule région la décoche ; « Toutes » sélectionne explicitement tout.
  let explicitAllRegions = selectedRegions.size === REGION_NAMES.length;
  let editorRegion = selectedRegions.has("sinnoh") ? "sinnoh" : [...selectedRegions][0];
  let allGroups = [];
  let visibleCount = BATCH;
  const xpOpenZoneKeys = new Set();
  let xpPinnedKey = null;
  let xpHasRendered = false;
  let xpReturnScrollY = null;
  const xpZoneKey = group => JSON.stringify([group.region, group.zone, group.method]);
  let focusIndex = -1;
  let possibleMatches = [];

  const normal = (value) => String(value ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  function getMethod(location) {
    if (location.rarete === "Horde") return "Horde";
    if (location.rarete === "Leurre") return "Leurre";
    return !location.methode || location.methode === "Pêche" ? "Méthode inconnue" : location.methode;
  }
  // Source strings sometimes store season/time restrictions at the end of the zone name.
  // Keep the same grouping as the EV tool, without editing encounter data.
  function parsePlace(value) {
    const raw = String(value || "Zone inconnue").trim();
    const periods = [
      [/\b(matin|morning)\b/i, "morning"], [/\b(jour|day)\b/i, "day"], [/\b(nuit|night)\b/i, "night"]
    ].filter(([re]) => re.test(raw)).map(([, id]) => id);
    const seasons = [
      [/\b(printemps|spring|season0)\b/i, "spring"], [/\b(été|ete|summer|season1)\b/i, "summer"],
      [/\b(automne|autumn|fall|season2)\b/i, "autumn"], [/\b(hiver|winter|season3)\b/i, "winter"]
    ].filter(([re]) => re.test(raw)).map(([, id]) => id);
    const name = periods.length || seasons.length
      ? raw.replace(/\s*\((?:[^)]*(?:matin|morning|jour|day|nuit|night|printemps|spring|été|ete|summer|automne|autumn|fall|hiver|winter|season[0-3])[^)]*)\)\s*$/i, "").trim()
      : raw;
    return { name: name || raw, periods, seasons };
  }
  function getLevelRange(value) {
    const found = String(value ?? "").match(/^(\d+)\s*(?:[-–]\s*(\d+))?$/);
    if (!found) return null;
    const a = Number(found[1]), b = Number(found[2] || found[1]);
    return [Math.min(a, b), Math.max(a, b)];
  }
  const encounters = [];
  const methods = new Set();
  POKEMONS.forEach(p => {
    REGION_NAMES.forEach(r => (p.locations?.[r] || []).forEach(location => {
      const place = parsePlace(location.zone);
      const method = getMethod(location);
      const levels = getLevelRange(location.niveau);
      methods.add(method);
      encounters.push({ p, region: r, zone: place.name, periods: place.periods, seasons: place.seasons,
        method, levels, rarity: location.rarete || "Spécial" });
    }));
  });

  METHOD_ORDER.filter(m => methods.has(m)).forEach(method => {
    const item = document.createElement("label");
    item.innerHTML = `<input type="checkbox" value="${esc(method)}" checked> <span></span>`;
    item.querySelector("span").textContent = methodLabel(method);
    methodFilters.appendChild(item);
  });
  function selectedMethods() {
    return new Set([...methodFilters.querySelectorAll("input:checked")].map(x => x.value));
  }
  function readXpSettings(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch { return {}; }
  }
  function saveXpSettings(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* Fonctionne également sans stockage local. */ }
  }
  const unlockedByRegion = readXpSettings(XP_ZONES_STORAGE_KEY);
  const oldFilterByRegion = readXpSettings(XP_FILTER_STORAGE_KEY);
  // Dans la β7, « mes zones débloquées » s'applique à chaque région choisie.
  // Reprend l'ancien état si une seule région était déjà utilisée.
  try {
    const saved = localStorage.getItem(XP_UNLOCKED_ACTIVE_KEY);
    unlockedOnly.checked = saved === null
      ? (selectedRegions.size === 1 && !!oldFilterByRegion[[...selectedRegions][0]])
      : saved === "true";
  } catch { unlockedOnly.checked = false; }
  const zonesByRegion = new Map(REGION_NAMES.map(r => [r, window.DexZoneProgress.sort(r,
    [...new Set(encounters.filter(e => e.region === r).map(e => e.zone))])]));

  function unlockedList(region = editorRegion) {
    return Array.isArray(unlockedByRegion[region]) ? unlockedByRegion[region] : [];
  }
  function filterZoneChoices() {
    zonePicker.filter(zoneSearch.value);
  }
  function refreshRegionChips() {
    regionFilters.querySelectorAll("[data-xp-region]").forEach(btn => {
      const active = btn.dataset.xpRegion === "all"
        ? selectedRegions.size === REGION_NAMES.length : selectedRegions.has(btn.dataset.xpRegion);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }
  function updateProgressCount() {
    const all = zonesByRegion.get(editorRegion) || [];
    const selected = new Set(unlockedList());
    const count = all.filter(zone => selected.has(zone)).length;
    progressCount.textContent = `${count}/${all.length} ${count === 1 ? txt("zone") : txt("zones")}`;
    unlockedHelp.textContent = selectedRegions.size > 1 ? txt("progressHelpMulti")
      : `${regionLabel(editorRegion)} — ${txt("progressHelp")}`;
  }
  function saveZones(zones) {
    unlockedByRegion[editorRegion] = [...new Set(zones)];
    saveXpSettings(XP_ZONES_STORAGE_KEY, unlockedByRegion);
    updateProgressCount();
    if (unlockedOnly.checked) render();
  }
  function refreshUnlocked() {
    progressPlaceholder.classList.add("hidden");
    progressContent.classList.remove("hidden");
    if (!selectedRegions.has(editorRegion)) editorRegion = [...selectedRegions][0];
    zoneRegionRow.classList.toggle("hidden", selectedRegions.size === 1);
    zoneRegionSelect.replaceChildren();
    REGION_NAMES.filter(r => selectedRegions.has(r)).forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = regionLabel(r);
      zoneRegionSelect.appendChild(opt);
    });
    zoneRegionSelect.value = editorRegion;
    zoneSearch.value = "";
    zonePicker.filter("");
    zonePicker.render(editorRegion, zonesByRegion.get(editorRegion) || []);
    updateProgressCount();
  }
  function currentSeason() { return ["spring", "summer", "autumn", "winter"][new Date().getMonth() % 4]; }
  function allowedCondition(entry) {
    const season = seasonInput.value === "auto" ? currentSeason() : seasonInput.value;
    return (periodInput.value === "all" || !entry.periods.length || entry.periods.includes(periodInput.value)) &&
      (season === "all" || !entry.seasons.length || entry.seasons.includes(season));
  }
  function matchup(target, type) {
    if ((target.immunites || []).includes(type)) return 0;
    return Number(target.faiblesses?.[type] ?? target.resistances?.[type] ?? 1);
  }
  function advantage(target) {
    const types = attackSelect.value === "auto" ? chosen.types : [attackSelect.value];
    const scored = types.map(type => ({ type, mult: matchup(target, type) }));
    return scored.sort((a, b) => b.mult - a.mult)[0];
  }
  function danger(target) {
    const threats = (target.types || []).map(type => ({ type, mult: Number(chosen.faiblesses?.[type] || 1) }))
      .filter(x => x.mult > 1).sort((a, b) => b.mult - a.mult);
    if (!threats.length) return null;
    return { mult: threats[0].mult, types: threats.filter(x => x.mult === threats[0].mult).map(x => x.type) };
  }
  function levelFit(range, ownLevel) {
    if (!range) return false;
    return range[1] >= Math.max(1, ownLevel - 14) && range[0] <= ownLevel + 2;
  }
  function groupZones(ownLevel) {
    const groups = new Map();
    const allowed = selectedMethods();
    const unlocked = unlockedOnly.checked ? new Map([...selectedRegions].map(r => [r, new Set(unlockedList(r))])) : null;
    encounters.forEach(e => {
      if (!selectedRegions.has(e.region)) return;
      if (!allowed.has(e.method) || !allowedCondition(e)) return;
      if (unlocked && !unlocked.get(e.region)?.has(e.zone)) return;
      const key = `${e.region}|${e.zone}|${e.method}`;
      if (!groups.has(key)) groups.set(key, { region: e.region, zone: e.zone, method: e.method, species: new Map() });
      const g = groups.get(key);
      const existing = g.species.get(e.p.id);
      if (existing) {
        existing.locations.push(e);
      } else {
        g.species.set(e.p.id, { p: e.p, locations: [e] });
      }
    });
    return [...groups.values()].map(g => {
      const species = [...g.species.values()].map(s => {
        const best = s.locations.reduce((acc, cur) => {
          const a = levelFit(acc.levels, ownLevel), b = levelFit(cur.levels, ownLevel);
          if (a !== b) return b ? cur : acc;
          return (RARITY_PRIORITY[cur.rarity] || 2) > (RARITY_PRIORITY[acc.rarity] || 2) ? cur : acc;
        });
        const allRanges = s.locations.map(x => x.levels).filter(Boolean);
        const low = allRanges.length ? Math.min(...allRanges.map(r => r[0])) : null;
        const high = allRanges.length ? Math.max(...allRanges.map(r => r[1])) : null;
        const atk = advantage(s.p);
        const fit = s.locations.some(e => levelFit(e.levels, ownLevel));
        const lvl = best.levels ? (best.levels[0] + best.levels[1]) / 2 : null;
        return { p: s.p, low, high, atk, fit, lvl, danger: danger(s.p), exp: Number(s.p.exp_donnee || 0), rarity: best.rarity };
      });
      const evMatching = targetingEvs() ? species.filter(s => evMatch(s.p)) : [];
      const evIdeal = evMatching.filter(s => s.atk.mult > 1 && s.fit);
      const evStats = evTargets.map(stat => {
        const matching = species.filter(s => evValue(s.p, stat) > 0);
        return { stat, count: matching.length, ideal: matching.filter(s => s.atk.mult > 1 && s.fit).length };
      });
      const favorable = species.filter(s => s.atk.mult > 1);
      const suitable = species.filter(s => s.fit);
      const suitableFavorable = favorable.filter(s => s.fit);
      // Indicative index only: base EXP * opponent level, not battle EXP.
      const xpCandidates = suitableFavorable.length ? suitableFavorable : favorable;
      const avgExp = xpCandidates.length ? xpCandidates.reduce((sum, s) => sum + s.exp, 0) / xpCandidates.length : 0;
      const xpIndex = xpCandidates.length ? xpCandidates.reduce((sum, s) => sum + s.exp * (s.lvl || ownLevel) / 7, 0) / xpCandidates.length : 0;
      const pct = species.length ? favorable.length / species.length : 0;
      const levelCoverage = species.length ? suitable.length / species.length : 0;
      const xpQuality = Math.min(1, xpIndex / Math.max(100, ownLevel * 9));
      // Dangers de type volontairement EXCLUS de ce score : avertissement visuel seulement.
      // Small-sample correction: a one-species lure zone should not automatically
      // outrank a diverse regular area just because 1/1 = 100%.
      const conservativeCoverage = (favorable.length + 1) / (species.length + 2);
      const xpScore = Math.round(100 * (0.56 * conservativeCoverage + 0.22 * levelCoverage + 0.22 * xpQuality));
      // Le filtre EV ne change pas le pourcentage de faiblesses de type affiché.
      // Il ajoute une pondération de l'EV voulu au classement XP, sans utiliser
      // de faux taux de rencontre : les espèces restent équiprobables ici.
      const evCoverage = species.length ? evStats.reduce((total, item) => total + item.count / species.length, 0) / (evStats.length || 1) : 0;
      const evIdealCoverage = species.length ? evStats.reduce((total, item) => total + item.ideal / species.length, 0) / (evStats.length || 1) : 0;
      const evBothCoverage = evStats.length === 2 && species.length
        ? Math.min(...evStats.map(item => item.count / species.length)) : 0;
      // Un EV : score de la β6 conservé. Deux EV : bonus si les DEUX sont représentés
      // dans la zone (pas nécessairement sur le même Pokémon sauvage).
      const score = !targetingEvs() ? xpScore : evStats.length === 1
        ? Math.round(100 * (0.40 * xpScore / 100 + 0.30 * evCoverage + 0.30 * evIdealCoverage))
        : Math.round(100 * (0.40 * xpScore / 100 + 0.22 * evCoverage + 0.22 * evIdealCoverage + 0.16 * evBothCoverage));
      return { ...g, species, favorable, suitableFavorable, pct, avgExp, score,
        evMatching, evIdeal, evStats, threats: species.filter(s => s.danger).length };
    }).filter(g => g.favorable.length && (!suitableOnly.checked || g.suitableFavorable.length) &&
      (!targetingEvs() || g.evMatching.length > 0))
      .sort((a, b) => b.score - a.score || b.pct - a.pct || b.avgExp - a.avgExp ||
        zoneLabel(a.region, a.zone).localeCompare(zoneLabel(b.region, b.zone)));
  }

  function closeWarnings() {
    results.querySelectorAll(".xp-warning-wrap.open").forEach(el => {
      el.classList.remove("open");
      el.querySelector(".xp-warning-btn")?.setAttribute("aria-expanded", "false");
    });
  }
  function warningMarkup(entry) {
    if (!entry.danger) return "";
    const threatTypes = entry.danger.types.map(typeLabel).join(" / ");
    const message = txt("warning").replace("{types}", threatTypes).replace("{multiplier}", fmt(entry.danger.mult));
    return `<span class="xp-warning-wrap">
      <button type="button" class="xp-warning-btn ${entry.danger.mult >= 4 ? "severe" : ""}"
        aria-label="${esc(txt("risk"))} : ${esc(threatTypes)} ×${esc(fmt(entry.danger.mult))}" aria-expanded="false">⚠ ×${esc(fmt(entry.danger.mult))}</button>
      <span class="xp-warning-popover" role="tooltip">${esc(message)}</span>
    </span>`;
  }
  function evMarkup(pokemon) {
    const yields = EV_STATS.filter(stat => evValue(pokemon, stat) > 0);
    if (!yields.length) return `<div class="xp-ev-yields xp-ev-missing">${esc(txt("evNone"))}</div>`;
    return `<div class="xp-ev-yields" aria-label="EV">${yields.map(stat => {
      const target = targetingEvs() && evTargets.includes(stat);
      const dimmed = targetingEvs() && !evTargets.includes(stat);
      return `<span class="xp-ev-badge${target ? " target" : ""}${dimmed ? " off-target" : ""}">EV ${esc(evShortLabel(stat))} +${evValue(pokemon, stat)}</span>`;
    }).join("")}</div>`;
  }
  function speciesMarkup(s, level) {
    const state = s.atk.mult > 1 ? "good" : s.atk.mult === 1 ? "neutral" : s.atk.mult === 0 ? "immune" : "hard";
    const levelText = s.low === null ? txt("unknown") : `${s.low}${s.high !== s.low ? `–${s.high}` : ""}`;
    const tooHigh = s.low !== null && s.high > level + 2;
    const tooLow = s.high !== null && s.high < level - 14;
    return `<div class="xp-species-row">
      <button type="button" class="xp-pokemon-link" data-pokemon-id="${s.p.id}" aria-label="${esc(label(s.p))}"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${s.p.id}.png" loading="lazy" alt="" width="39" height="39">
        <span><strong>${esc(label(s.p))}</strong><small>#${String(s.p.id).padStart(3, "0")} · ${s.p.types.map(typeLabel).map(esc).join(" / ")}</small></span></button>
      ${evMarkup(s.p)}
      <div class="xp-species-info"><span class="xp-match ${state}">${esc(typeLabel(s.atk.type))} ×${esc(fmt(s.atk.mult))}</span>
      <span class="xp-small-meta">${esc(txt("levelName"))} ${esc(levelText)} ${tooHigh ? `<span class="xp-level-alert" title="${esc(txt("levelWarning"))}">↑ ${esc(txt("tooHigh"))}</span>` : tooLow ? `<span class="xp-low-level">↓ ${esc(txt("tooLow"))}</span>` : ""}</span>
      <span class="xp-small-meta">EXP ${fmt(s.exp)}</span>${warningMarkup(s)}</div>
    </div>`;
  }
  function makeCard(g, index, ownLevel) {
    const card = document.createElement("details");
    card.className = "xp-zone-card" + (index < 3 ? " recommended" : "");
    const zoneKey = xpZoneKey(g);
    const pinned = zoneKey === xpPinnedKey;
    card.dataset.zoneKey = zoneKey;
    card.classList.toggle("zone-pinned", pinned);
    card.open = xpOpenZoneKeys.has(zoneKey);
    card.innerHTML = `<summary>
      <div class="xp-zone-info"><div class="xp-heading-row"><strong>${index + 1}. ${esc(zoneLabel(g.region, g.zone))}</strong>
      <button type="button" class="zone-pin-btn" aria-pressed="${pinned}" aria-label="${esc(txt(pinned ? "unpin" : "pin"))}" title="${esc(txt(pinned ? "unpin" : "pin"))}">📌</button>
      <span class="xp-compact-badge">${esc(regionLabel(g.region))}</span><span class="xp-compact-badge">${esc(methodLabel(g.method))}</span></div>
      <div class="xp-zone-track" aria-label="${Math.round(g.pct * 100)} %"><span style="width:${Math.round(g.pct * 100)}%"></span></div>
      <small><strong>${g.favorable.length}/${g.species.length}</strong> ${esc(txt("favorable"))} · <span>${g.suitableFavorable.length} ${esc(txt("suitable"))}</span>${g.threats ? ` · <span class="xp-threat-count">⚠ ${g.threats}</span>` : ""}</small>
      ${targetingEvs() ? `<small class="xp-ev-zone-count">${g.evStats.map(item => `EV ${esc(evShortLabel(item.stat))} : <strong>${item.count}/${g.species.length}</strong>`).join(" · ")} · ${g.evIdeal.length} ${esc(txt("evIdeal"))}</small>` : ""}</div>
      <div class="xp-score"><strong>${Math.round(g.pct * 100)} %</strong><span>${esc(txt("percent"))}</span><small>${esc(!targetingEvs() ? txt("score") : txt("evScore"))} ${g.score}/100</small></div>
    </summary><div class="xp-zone-body"><div class="xp-zone-metrics"><span>${esc(txt("average"))} : <strong>${fmt(g.avgExp)}</strong></span><span>${esc(txt("encounters"))} : <strong>${g.species.length}</strong></span></div><div class="xp-species-list"></div></div>`;
    card.querySelector(".zone-pin-btn").addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      xpPinnedKey = xpPinnedKey === zoneKey ? null : zoneKey;
      // Reorder without changing the XP ranking or losing open cards.
      render(true);
      if (xpPinnedKey) results.querySelector(".xp-zone-card.zone-pinned")?.scrollIntoView({ block: "start" });
    });
    const populate = () => {
      if (card.dataset.built) return;
      card.dataset.built = "true";
      const list = card.querySelector(".xp-species-list");
      [...g.species].sort((a, b) => (!targetingEvs() ? 0 :
        evMatchCount(b.p) - evMatchCount(a.p) || evMatchAmount(b.p) - evMatchAmount(a.p)) ||
        b.atk.mult - a.atk.mult || b.exp - a.exp || a.p.id - b.p.id)
        .forEach(s => list.insertAdjacentHTML("beforeend", speciesMarkup(s, ownLevel)));
    };
    if (card.open) populate();
    card.addEventListener("toggle", () => {
      if (card.open) { xpOpenZoneKeys.add(zoneKey); populate(); }
      else xpOpenZoneKeys.delete(zoneKey);
    });
    return card;
  }
  function renderSlice() {
    if (!allGroups.length) { more.classList.add("hidden"); return; }
    const ownLevel = Number(levelInput.value);
    const fragment = document.createDocumentFragment();
    allGroups.slice(results.children.length, visibleCount).forEach((g, i) => {
      fragment.appendChild(makeCard(g, g.originalRank, ownLevel));
    });
    results.appendChild(fragment);
    more.classList.toggle("hidden", results.children.length >= allGroups.length);
    more.textContent = `${txt("more")} (${results.children.length}/${allGroups.length})`;
  }
  function showMessage(value) {
    summary.textContent = value;
    results.replaceChildren();
    more.classList.add("hidden");
  }
  function updateAttackType() {
    const previous = attackSelect.value;
    attackSelect.replaceChildren();
    const auto = document.createElement("option");
    auto.value = "auto";
    auto.textContent = txt("auto");
    attackSelect.appendChild(auto);
    if (chosen) chosen.types.forEach(type => {
      const item = document.createElement("option");
      item.value = type;
      item.textContent = typeLabel(type);
      attackSelect.appendChild(item);
    });
    if (chosen?.types.includes(previous)) attackSelect.value = previous;
    attackSelect.disabled = !chosen || chosen.types.length < 2;
    assumption.textContent = chosen
      ? `${txt("usedType")} : ${chosen.types.map(typeLabel).join(" / ")}. ${txt("after")}`
      : txt("select");
  }
  function render(preserveLoadedCount = false) {
    closeWarnings();
    const ownLevel = Number(levelInput.value);
    if (!chosen) return showMessage(txt("select"));
    if (!Number.isInteger(ownLevel) || ownLevel < 1 || ownLevel > 100) return showMessage(txt("level"));
    if (!selectedMethods().size) return showMessage(txt("noMethod"));
    if (unlockedOnly.checked && ![...selectedRegions].some(r => unlockedList(r).length)) return showMessage(txt("noZones"));
    allGroups = groupZones(ownLevel).map((group, index) => ({ ...group, originalRank: index }));
    const pinIndex = allGroups.findIndex(group => xpZoneKey(group) === xpPinnedKey);
    if (pinIndex > 0) allGroups.unshift(allGroups.splice(pinIndex, 1)[0]);
    // Filters start from the first page; pinning keeps previously loaded batches.
    if (preserveLoadedCount !== true) visibleCount = BATCH;
    const areaWord = allGroups.length === 1 ? txt("zone") : txt("zones");
    const regionsText = selectedRegions.size === REGION_NAMES.length ? txt("regions")
      : REGION_NAMES.filter(r => selectedRegions.has(r)).map(regionLabel).join(" / ");
    summary.textContent = `${allGroups.length} ${areaWord} ${txt("found")} ${txt("for")} ${label(chosen)} (${txt("levelName")} ${ownLevel}), ${regionsText}. ${!targetingEvs() ? txt("approx") : `${txt(evTargets.length === 2 ? "evTargets" : "evTarget")} : ${evTargets.map(evShortLabel).join(" + ")}. ${txt("evFiltered")}`}`;
    results.replaceChildren();
    if (!allGroups.length) return showMessage(txt(!targetingEvs() ? "noResults" : "evFilterNoResults"));
    renderSlice();
  }

  function hideSuggestions() {
    suggestions.classList.add("hidden");
    input.setAttribute("aria-expanded", "false");
    focusIndex = -1;
  }
  function selectPokemon(p) {
    chosen = p;
    input.value = label(p);
    hideSuggestions();
    updateAttackType();
    render();
  }
  function drawSuggestions() {
    const query = input.value.trim();
    if (!query) { hideSuggestions(); return; }
    possibleMatches = typeof getMatchingPokemon === "function" ? getMatchingPokemon(query) :
      POKEMONS.filter(p => normal(p.nom).startsWith(normal(query)) || normal(p.nom_en).startsWith(normal(query))).slice(0, 10);
    if (possibleMatches.length === 0 && typeof getApproximatePokemon === "function") {
      possibleMatches = getApproximatePokemon(query);
    }
    focusIndex = -1;
    suggestions.replaceChildren();
    possibleMatches.forEach(p => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion-btn";
      button.setAttribute("role", "option");
      button.innerHTML = `<span>${esc(label(p))}</span><span class="suggestion-number">#${String(p.id).padStart(3, "0")}</span>`;
      button.addEventListener("click", () => selectPokemon(p));
      suggestions.appendChild(button);
    });
    if (!possibleMatches.length) suggestions.innerHTML = `<div class="no-suggestion">${esc(txt("select"))}</div>`;
    suggestions.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
  }
  input.addEventListener("input", () => {
    const exact = typeof getPokemonByExactSearch === "function" ? getPokemonByExactSearch(input.value) : null;
    if (chosen && input.value.trim() !== label(chosen)) {
      chosen = null;
      updateAttackType();
      showMessage(txt("select"));
    }
    if (exact) { selectPokemon(exact); return; }
    drawSuggestions();
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Escape") { hideSuggestions(); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (suggestions.classList.contains("hidden")) drawSuggestions();
      if (!possibleMatches.length) return;
      event.preventDefault();
      focusIndex = (focusIndex + (event.key === "ArrowDown" ? 1 : -1) + possibleMatches.length) % possibleMatches.length;
      suggestions.querySelectorAll(".suggestion-btn").forEach((button, i) => {
        button.classList.toggle("active", i === focusIndex);
        button.setAttribute("aria-selected", String(i === focusIndex));
      });
    }
    if (event.key === "Enter") {
      const choice = possibleMatches[focusIndex] || (typeof getPokemonByExactSearch === "function" ? getPokemonByExactSearch(input.value) : null);
      if (choice) { event.preventDefault(); selectPokemon(choice); }
    }
  });
  results.addEventListener("click", event => {
    const button = event.target.closest(".xp-pokemon-link");
    if (!button) return;
    const pokemon = POKEMONS.find(p => p.id === Number(button.dataset.pokemonId));
    if (!pokemon || typeof window.selectPokemon !== "function") return;
    switchSearchMode("pokemon");
    window.selectPokemon(pokemon);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".xp-picker")) hideSuggestions();
    const warning = event.target.closest(".xp-warning-btn");
    if (!warning) { if (!event.target.closest(".xp-warning-popover")) closeWarnings(); return; }
    const wrapper = warning.closest(".xp-warning-wrap");
    const wasOpen = wrapper.classList.contains("open");
    closeWarnings();
    if (!wasOpen) { wrapper.classList.add("open"); warning.setAttribute("aria-expanded", "true"); }
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeWarnings(); });
  evFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-xp-ev]");
    if (!button) return;
    const stat = button.dataset.xpEv;
    if (stat === "all") evTargets = [];
    else if (evTargets.includes(stat)) evTargets = evTargets.filter(item => item !== stat);
    else if (evTargets.length < 2) evTargets = [...evTargets, stat];
    try { localStorage.setItem(XP_EV_STORAGE_KEY, JSON.stringify(evTargets)); }
    catch { /* Le filtre reste actif dans cette session. */ }
    refreshEvChips();
    render();
  });
  attackSelect.addEventListener("change", render);
  levelInput.addEventListener("input", render);
  periodInput.addEventListener("change", render);
  seasonInput.addEventListener("change", render);
  suitableOnly.addEventListener("change", render);
  unlockedOnly.addEventListener("change", () => {
    try { localStorage.setItem(XP_UNLOCKED_ACTIVE_KEY, String(unlockedOnly.checked)); }
    catch { /* Filtre actif durant cette session. */ }
    render();
  });
  zoneSearch.addEventListener("input", filterZoneChoices);
  zonesAll.addEventListener("click", () => {
    saveZones(zonesByRegion.get(editorRegion) || []);
    zonePicker.refresh();
  });
  zonesNone.addEventListener("click", () => {
    saveZones([]);
    zonePicker.refresh();
  });
  zoneRegionSelect.addEventListener("change", () => {
    if (!selectedRegions.has(zoneRegionSelect.value)) return;
    editorRegion = zoneRegionSelect.value;
    refreshUnlocked();
  });
  regionFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-xp-region]");
    if (!button) return;
    const r = button.dataset.xpRegion;
    if (r === "all") { selectedRegions = new Set(REGION_NAMES); explicitAllRegions = true; }
    else if (explicitAllRegions) { selectedRegions = new Set([r]); explicitAllRegions = false; }
    else if (selectedRegions.has(r)) {
      if (selectedRegions.size > 1) selectedRegions.delete(r); // Toujours au moins une région.
    } else selectedRegions.add(r);
    if (r !== "all" && selectedRegions.has(r)) editorRegion = r;
    try { localStorage.setItem(XP_REGIONS_STORAGE_KEY, JSON.stringify([...selectedRegions])); }
    catch { /* Filtre actif durant cette session. */ }
    refreshRegionChips();
    refreshUnlocked();
    render();
  });
  methodFilters.addEventListener("change", render);
  document.querySelector("#xpMethodsAll").addEventListener("click", () => {
    methodFilters.querySelectorAll("input").forEach(x => { x.checked = true; }); render();
  });
  document.querySelector("#xpMethodsNone").addEventListener("click", () => {
    methodFilters.querySelectorAll("input").forEach(x => { x.checked = false; }); render();
  });
  more.addEventListener("click", () => { visibleCount += BATCH; renderSlice(); });

  // Wrap EV's mode switch, leaving the other three search modes untouched.
  const previousSwitchSearchMode = switchSearchMode;
  switchSearchMode = function (mode) {
    if (mode !== "xp") {
      if (currentSearchMode === "xp") xpReturnScrollY = window.scrollY;
      appShell.classList.remove("xp-mode");
      section.classList.add("hidden");
      previousSwitchSearchMode(mode);
      return;
    }
    currentSearchMode = "xp";
    appShell.classList.remove("trainer-mode", "ev-mode");
    appShell.classList.add("xp-mode");
    modeTabs.querySelectorAll(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
    pokemonSearchSection.classList.add("hidden");
    trainerSearchSection.classList.add("hidden");
    document.querySelector("#evSearchSection").classList.add("hidden");
    pokemonCard.classList.add("hidden");
    emptyState.classList.add("hidden");
    trainerCard.classList.add("hidden");
    trainerEmptyState.classList.add("hidden");
    section.classList.remove("hidden");
    refreshUnlocked();
    // Preserve expanded results, the loaded batches and their current scroll on return.
    if (chosen && !xpHasRendered) render();
    if (xpReturnScrollY !== null) {
      requestAnimationFrame(() => requestAnimationFrame(() =>
        window.scrollTo({ top: xpReturnScrollY, behavior: "instant" })
      ));
    }
  };

  document.addEventListener("dex:languagechange", () => {
    methodFilters.querySelectorAll("label").forEach(row => {
      const checkbox = row.querySelector("input");
      row.querySelector("span").textContent = methodLabel(checkbox.value);
    });
    if (chosen) input.value = label(chosen);
    updateAttackType();
    refreshEvChips();
    refreshUnlocked();
    render();
  });
  refreshEvChips();
  refreshRegionChips();
  refreshUnlocked();
  updateAttackType();
  showMessage(txt("select"));
})();
