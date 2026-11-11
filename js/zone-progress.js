/* Ordre d'exploration indicatif des cinq régions de Dex Compagnon.
 * Les détours facultatifs sont placés près du premier moment où ils deviennent
 * généralement accessibles ; les zones d'après-Ligue figurent vers la fin.
 * Cet ordre est indépendant des listes de zones cochées en EV et en XP.
 * Garder les noms français tels qu'ils apparaissent dans pokemon-data.js.
 */
(() => {
  "use strict";

  const ITINERARIES = {
    kanto: [
      "Bourg Palette", "Route 1", "Jadielle", "Route 22", "Route 2",
      "Forêt de Jade", "Route 3", "Mont Sélénite", "Route 4", "Azuria",
      "Route 24", "Route 25", "Route 5", "Route 6", "Carmin sur Mer",
      "L'Océane", "Route 11", "Cave Taupiqueur", "Route 9", "Route 10",
      "Route 7", "Céladopole", "Route 8", "Tour Pokémon", "Route 12",
      "Route 16", "Route 17", "Route 18", "Parmanie", "Parc Safari",
      "Route 13", "Route 14", "Route 15", "Route 19", "Îles Écume",
      "Route 20", "Cramois'île", "Manoir Pokémon", "Route 21", "Centrale",
      "Île 1", "Mont Braise", "Route Tison", "Plage Trésor", "Pont du Lien",
      "Port Île 3", "Bois Baies", "Route 23", "Route Victoire",
      "Île 4", "Grotte de Glace", "Île 5", "Pré Île 5",
      "Mémorial", "Camp de Vacances", "Chemin Vert", "Forbuissons",
      "Agualcanal", "Canyon Sesor", "Entrée Canyon", "Entrée du Canyon",
      "Cap Falaise", "Labyrinthe d'O", "Vallée Ruine", "Grotte Perdue",
      "Ruines Tanoby", "Chambre Anémune", "Chambre Deulipe", "Chambre Hibicinq",
      "Chambre Irix", "Chambre Jonquatre", "Chambre Poinsept", "Chambre Prois",
      "Tour Dresseurs", "Grotte Métamo", "Caverne Azurée", "Grotte Azurée",
      "Grotte", "Île du Lointain"
    ],
    johto: [
      "Bourg Geon", "Route 29", "Ville Griotte", "Route 30", "Route 31",
      "Antre Noir", "Mauville", "Tour Chétiflor", "Route 32", "Ruines d'Alpha",
      "Caves Jumelles", "Route 33", "Ecorcia", "Puits Ramoloss", "Bois aux Chênes",
      "Route 34", "Route 35", "Parc Naturel", "Route 36", "Route 37",
      "Rosalia", "Tour Cendrée", "Route 38", "Route 39", "Oliville",
      "Route 40", "Route 41", "Irisia", "Route 47", "Route 48",
      "Portail Falaise", "Grotte Falaise", "Portail Safari", "Parc Safari",
      "Route 42", "Mont Creuset", "Acajou", "Route 43", "Lac Colère",
      "Repaire Rocket", "Route 44", "Route de Glace", "Ébènelle",
      "Antre du Dragon", "Route 45", "Route 46", "Tourb'Îles",
      "Tour Carillon", "Chutes Tohjo", "Route 27", "Route 26", "Route Victoire",
      "Dôme Pokéathlon", "Route 28", "Mont Argenté", "Grotte Argentée"
    ],
    hoenn: [
      "Route 101", "Route 103", "Route 102", "Clémenti-ville", "Route 104",
      "Bois Clémenti", "Route 116", "Tunnel Mérazon", "Route 106", "Myokara",
      "Grotte Granite", "Route 107", "Route 108", "Épave", "Route 109",
      "Poivressel", "Route 110", "Route 117", "Route 111", "Route 112",
      "Chemin Ardent", "Route 113", "Route 114", "Site Météore", "Route 115",
      "Voie du Désert", "Tour Mirage", "Route 118", "Route 119", "Route 120",
      "Route 121", "Parc Safari", "Nénucrique", "Mont Mémoria", "Route 122",
      "Route 123", "Planque Magma", "Planque Aqua", "Route 105", "New Lavandia",
      "Route 124", "Algatia", "Route 125", "Grotte Tréfonds", "Route 126",
      "Atalanopolis", "Grotte Origine", "Route 127", "Route 128", "Caverne Fondmer",
      "Fond marin", "Route 129", "Route 130", "Route 131", "Pacifiville",
      "Pilier Céleste", "Route 132", "Route 133", "Route 134", "Éternara",
      "Route Victoire", "Zone de Combat", "Grotte Atelier", "Grotte Métamo",
      "Grotte Zénith", "Sanctuaire", "Sentier Sinuroc"
    ],
    sinnoh: [
      "Bonaugure", "Route 201", "Lac Vérité", "Route 202", "Route 203",
      "Entrée Charbourg", "Mine Charbourg", "Route 207", "Route 204", "Chemin Rocheux",
      "Route 205", "Les Éoliennes", "Arbre à Miel", "Forêt Vestigion", "Vestigion",
      "Vieux Château", "Route 206", "Grotte Revêche", "Mont Couronné", "Route 208",
      "Route 209", "Ruines Bonville", "Route 210", "Route 215", "Route 214",
      "Rive Lac Courage", "Route 213", "Verchamps", "Grand Marais", "Route 212",
      "Jardin Trophée", "Route 211", "Celestia", "Route 218", "Joliberges",
      "Île de Fer", "Forge Fuego", "Route 219", "Route 220", "Route 221",
      "Lac Courage", "Route 216", "Route 217", "Rive Lac Savoir", "Lac Savoir",
      "Route 222", "Rivamar", "Route 223", "Route Victoire", "Ligue Pokémon",
      "Temple Frimapic", "Route 224", "Source Adieu", "Grotte Retour", "Tunnel Ruineman.",
      "Grotte Ruineman.", "Route 225", "Route 226", "Route 227", "Mont Abrupt",
      "Route 228", "Route 229", "Aire de Détente", "Route 230"
    ],
    unys: [
      "Route 1", "Route 2", "Ogoesse", "Vestiges du Rêve", "Route 3",
      "Veine Souterraine", "Forêt d'Empoigne", "Route 4", "Désert Délassant",
      "Château Enfoui", "Route 5", "Route 16", "Pont Yoneuve", "Port Yoneuve",
      "Hangar Frigorifique", "Route 6", "Grotte Électrolithe", "Grotte Parsemille",
      "Tour des Cieux", "Route 7", "Mont Foré", "Flocombe", "Tourbière Flocombe",
      "Tour Dragospire", "Route 8", "Pont de l'Inconnu", "Route 9", "Route 10",
      "Route Victoire", "Salle Épreuve", "Route 17", "Route 18", "Labo P2",
      "Route 11", "Pont du Hameau", "Route 12", "Route 13", "Vaguelone",
      "Baie Vaguelone", "Grotte Cyclopéenne", "Route 14", "Autel Abondance",
      "Route 15", "Antre d'Entraînement", "Bois des Illusions", "Espace Guide"
    ]
  };

  const key = (name) => String(name || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const ranks = Object.fromEntries(Object.entries(ITINERARIES).map(([region, itinerary]) => [
    region, new Map(itinerary.map((place, index) => [key(place), index]))
  ]));

  const alphabetical = (a, b) => String(a).localeCompare(String(b), "fr", {
    numeric: true, sensitivity: "base"
  });

  // Dernier lieu de chaque étape de l'aventure dans l'itinéraire ci-dessus.
  // Les lieux à accès multiple ou facultatif restent approximatifs : ce classement
  // est un outil de sélection, pas une validation de badges en jeu.
  const STAGE_ENDS = {
    kanto: ["Forêt de Jade", "Route 25", "Cave Taupiqueur", "Céladopole",
      "Parc Safari", "Route 15", "Manoir Pokémon", "Bois Baies", "Route Victoire"],
    johto: ["Tour Chétiflor", "Puits Ramoloss", "Parc Naturel", "Tour Cendrée",
      "Grotte Falaise", "Parc Safari", "Repaire Rocket", "Antre du Dragon", "Route Victoire"],
    hoenn: ["Tunnel Mérazon", "Grotte Granite", "Route 117", "Site Météore",
      "Tour Mirage", "Route 120", "Grotte Tréfonds", "Grotte Origine", "Route Victoire"],
    sinnoh: ["Mine Charbourg", "Vieux Château", "Route 208", "Route 215",
      "Grand Marais", "Île de Fer", "Lac Savoir", "Rivamar", "Ligue Pokémon"],
    unys: ["Vestiges du Rêve", "Veine Souterraine", "Château Enfoui", "Route 16",
      "Hangar Frigorifique", "Tour des Cieux", "Tour Dragospire", "Route 9", "Salle Épreuve"]
  };
  const COLORS = ["#d9b84b", "#50ac79", "#629bdc", "#a787d8", "#d88a57",
    "#42aeb0", "#df7998", "#b7a359", "#799dce", "#a5a6ac", "#bcb3a5"];

  function stages(region, zones) {
    const order = ranks[region] || new Map();
    const ends = (STAGE_ENDS[region] || []).map(place => order.get(key(place)));
    const result = Array.from({length:11}, (_, index) => ({ index, zones: [], color: COLORS[index] }));
    zones.forEach(zone => {
      const index = order.get(key(zone));
      const stage = index === undefined ? 10 : ends.findIndex(end => index <= end);
      result[stage < 0 ? 9 : stage].zones.push(zone);
    });
    return result.filter(stage => stage.zones.length);
  }

  // Composant partagé par EV et XP. Chaque onglet garde son propre stockage.
  function createPicker({ list, normalButton, simpleButton, storageKey, getSelected,
    getLabel, onSelectionChange }) {
    let mode = "simple";
    try { if (localStorage.getItem(storageKey) === "normal") mode = "normal"; }
    catch { /* Stockage éventuellement interdit. */ }
    let region = "all";
    let zones = [];
    let query = "";
    const openedByRegion = new Map();
    const english = () => window.DexI18n?.language === "en";
    const normalize = value => key(value);

    function stageName(index) {
      if (index === 0) return english() ? "Start → Badge 1" : "Début → Badge 1";
      if (index >= 1 && index <= 7) return english()
        ? `Badge ${index} → Badge ${index + 1}` : `Badge ${index} → Badge ${index + 1}`;
      if (index === 8) return english() ? "Badge 8 → League" : "Badge 8 → Ligue";
      if (index === 9) return english() ? "After the League" : "Après la Ligue";
      return english() ? "Other / variable access" : "Autres / accès variable";
    }
    function makeRow(zone) {
      const row = document.createElement("label");
      row.className = "ev-zone-choice";
      row.dataset.zone = zone;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = zone;
      const text = document.createElement("span");
      text.textContent = getLabel(region, zone);
      text.title = text.textContent;
      checkbox.addEventListener("change", () => changeSelection([zone], checkbox.checked));
      row.append(checkbox, text);
      return row;
    }
    function changeSelection(changed, checked) {
      const next = new Set(getSelected());
      changed.forEach(zone => checked ? next.add(zone) : next.delete(zone));
      onSelectionChange([...next]);
      refresh();
    }
    function refresh() {
      const selected = new Set(getSelected());
      list.querySelectorAll(".ev-zone-choice").forEach(row => {
        row.querySelector("input").checked = selected.has(row.dataset.zone);
      });
      list.querySelectorAll(".zone-stage").forEach(group => {
        const items = [...group.querySelectorAll(".ev-zone-choice")];
        const checked = items.filter(row => selected.has(row.dataset.zone)).length;
        const box = group.querySelector(".zone-stage-check");
        box.checked = checked === items.length;
        box.indeterminate = checked > 0 && checked < items.length;
        const count = group.querySelector(".zone-stage-count");
        count.textContent = `${checked}/${items.length} ${english() ? "areas selected" : "lieux sélectionnés"}`;
      });
    }
    function applyFilter(value) {
      query = normalize(value);
      list.querySelectorAll(".ev-zone-choice").forEach(row => {
        const match = !query || normalize(row.dataset.zone).includes(query) ||
          normalize(getLabel(region, row.dataset.zone)).includes(query);
        row.classList.toggle("hidden-by-search", !match);
      });
      list.querySelectorAll(".zone-stage").forEach(group => {
        const matches = !!group.querySelector(".ev-zone-choice:not(.hidden-by-search)");
        group.classList.toggle("hidden-by-search", !matches);
        const details = group.querySelector(".zone-stage-details");
        details.open = query ? matches : (openedByRegion.get(region)?.has(group.dataset.stage) || false);
      });
    }
    function render(nextRegion, nextZones) {
      // Garder les groupes manuellement ouverts, sauf si une recherche les a dépliés.
      if (!query && mode === "simple" && region === nextRegion) {
        const opened = new Set([...list.querySelectorAll(".zone-stage-details[open]")]
          .map(details => details.closest(".zone-stage").dataset.stage));
        if (list.querySelector(".zone-stage")) openedByRegion.set(region, opened);
      }
      region = nextRegion;
      zones = [...nextZones];
      list.replaceChildren();
      list.classList.toggle("zone-view-simplified", mode === "simple");
      normalButton.classList.toggle("active", mode === "normal");
      simpleButton.classList.toggle("active", mode === "simple");
      normalButton.setAttribute("aria-pressed", String(mode === "normal"));
      simpleButton.setAttribute("aria-pressed", String(mode === "simple"));
      if (mode === "normal") {
        zones.forEach(zone => list.appendChild(makeRow(zone)));
      } else {
        stages(region, zones).forEach(stage => {
          const group = document.createElement("div");
          group.className = "zone-stage";
          group.dataset.stage = String(stage.index);
          group.style.setProperty("--stage-border", stage.color);
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "zone-stage-check";
          checkbox.setAttribute("aria-label", `${english() ? "Select all areas in" : "Tout cocher dans"} ${stageName(stage.index)}`);
          checkbox.addEventListener("change", () => changeSelection(stage.zones, checkbox.checked));
          const details = document.createElement("details");
          const stageRegion = region;
          details.className = "zone-stage-details";
          const summary = document.createElement("summary");
          const heading = document.createElement("span");
          heading.className = "zone-stage-heading";
          const title = document.createElement("strong");
          title.textContent = stageName(stage.index);
          const count = document.createElement("small");
          count.className = "zone-stage-count";
          heading.append(title, count);
          summary.appendChild(heading);
          const locations = document.createElement("div");
          locations.className = "zone-stage-places";
          stage.zones.forEach(zone => locations.appendChild(makeRow(zone)));
          details.append(summary, locations);
          details.open = openedByRegion.get(region)?.has(String(stage.index)) || false;
          details.addEventListener("toggle", () => {
            if (query || region !== stageRegion || !group.isConnected) return;
            // Dépliage temporaire pendant une recherche ou ancien groupe démonté.
            const opened = openedByRegion.get(stageRegion) || new Set();
            if (details.open) opened.add(group.dataset.stage);
            else opened.delete(group.dataset.stage);
            openedByRegion.set(stageRegion, opened);
          });
          group.append(checkbox, details);
          list.appendChild(group);
        });
      }
      refresh();
      applyFilter(query);
    }
    function setMode(next) {
      if (next === mode) return;
      mode = next;
      try { localStorage.setItem(storageKey, mode); }
      catch { /* Mode toujours actif pendant la visite. */ }
      render(region, zones);
    }
    normalButton.addEventListener("click", () => setMode("normal"));
    simpleButton.addEventListener("click", () => setMode("simple"));
    return { render, refresh, filter: applyFilter };
  }

  window.DexZoneProgress = Object.freeze({
    stages,
    createPicker,
    sort(region, zones) {
      const order = ranks[region];
      return [...zones].sort((a, b) => {
        const aRank = order?.get(key(a)) ?? Number.MAX_SAFE_INTEGER;
        const bRank = order?.get(key(b)) ?? Number.MAX_SAFE_INTEGER;
        return aRank - bRank || alphabetical(a, b);
      });
    }
  });
})();
