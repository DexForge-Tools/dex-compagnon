/*
  Statuts globaux Pokémon — Dex Compagnon
  Ce fichier ne modifie jamais pokemon-data.js.
*/

(() => {
  // Familles des starters : on garde le badge sur toute la lignée.
  const STARTER_FAMILIES = new Set([
    1,2,3,4,5,6,7,8,9,
    152,153,154,155,156,157,158,159,160,
    252,253,254,255,256,257,258,259,260,
    387,388,389,390,391,392,393,394,395,
    495,496,497,498,499,500,501,502,503
  ]);

  const FOSSILS = new Set([
    138,139,140,141,142,
    345,346,347,348,
    408,409,410,411,
    564,565,566,567
  ]);

  // Pré-évolutions appartenant aux lignées dites pseudo-légendaires.
  const PSEUDO_FAMILIES = new Set([
    147,148,149,
    246,247,248,
    371,372,373,
    374,375,376,
    443,444,445,
    633,634,635
  ]);

  const PSEUDO_FINAL = new Set([149,248,373,376,445,635]);

  const LEGENDARIES = new Set([
    144,145,146,150,
    243,244,245,249,250,
    377,378,379,380,381,382,383,384,
    480,481,482,483,484,485,486,487,488,
    638,639,640,641,642,643,644,645,646
  ]);

  const MYTHICALS = new Set([
    151,
    251,
    385,386,
    489,490,491,492,493,494,
    647,648,649
  ]);

  const statusList = document.querySelector("#pokemonStatusList");

  function countWildEncounters(pokemon) {
    return Object.values(pokemon?.locations || {})
      .reduce((total, locations) => total + (Array.isArray(locations) ? locations.length : 0), 0);
  }

  function getPokemonCategory(pokemon) {
    const id = Number(pokemon?.id);

    if (MYTHICALS.has(id)) {
      return {
        label: "Fabuleux",
        className: "status-mythical"
      };
    }

    if (LEGENDARIES.has(id)) {
      return {
        label: "Légendaire",
        className: "status-legendary"
      };
    }

    if (PSEUDO_FINAL.has(id)) {
      return {
        label: "Pseudo-légendaire",
        className: "status-pseudo"
      };
    }

    if (PSEUDO_FAMILIES.has(id)) {
      return {
        label: "Lignée pseudo-légendaire",
        className: "status-pseudo-line"
      };
    }

    if (STARTER_FAMILIES.has(id)) {
      return {
        label: "Starter",
        className: "status-starter"
      };
    }

    if (FOSSILS.has(id)) {
      return {
        label: "Fossile",
        className: "status-fossil"
      };
    }

    return {
      label: "Standard",
      className: "status-standard"
    };
  }

  function getAvailability(pokemon) {
    if (pokemon?.obtenable === false) {
      return {
        label: "Non obtenable normalement",
        className: "availability-unavailable",
        detail: "Les données utilisées signalent ce Pokémon comme non obtenable normalement."
      };
    }

    const encounters = countWildEncounters(pokemon);

    if (encounters > 0) {
      return {
        label: "Sauvage",
        className: "availability-wild",
        detail: `${encounters} rencontre${encounters > 1 ? "s" : ""} sauvage${encounters > 1 ? "s" : ""} enregistrée${encounters > 1 ? "s" : ""}.`
      };
    }

    return {
      label: "Obtention spéciale",
      className: "availability-special",
      detail: "Aucune rencontre sauvage n'est enregistrée dans les données disponibles."
    };
  }

  function createBadge(label, className) {
    const badge = document.createElement("span");
    badge.className = `pokemon-status-badge ${className}`;
    badge.textContent = label;
    return badge;
  }

  function renderStatusBadges(pokemon) {
    if (!statusList) return;

    statusList.innerHTML = "";

    const category = getPokemonCategory(pokemon);
    const availability = getAvailability(pokemon);

    statusList.appendChild(createBadge(category.label, category.className));
    statusList.appendChild(createBadge(availability.label, availability.className));
  }

  function appendDetailCard(label, value, className = "") {
    const technicalData = document.querySelector("#technicalData");
    if (!technicalData) return;

    const item = document.createElement("div");
    item.className = `tech-item pokemon-status-detail ${className}`.trim();

    const title = document.createElement("strong");
    title.textContent = label;

    const content = document.createElement("span");
    content.textContent = value;

    item.appendChild(title);
    item.appendChild(content);
    technicalData.appendChild(item);
  }

  function renderStatusDetails(pokemon) {
    const technicalData = document.querySelector("#technicalData");
    if (!technicalData) return;

    technicalData
      .querySelectorAll(".pokemon-status-detail")
      .forEach((item) => item.remove());

    const category = getPokemonCategory(pokemon);
    const availability = getAvailability(pokemon);

    appendDetailCard("Catégorie", category.label, category.className);
    appendDetailCard(
      "Disponibilité",
      `${availability.label} — ${availability.detail}`,
      availability.className
    );
  }

  // Appelé depuis le rendu central de app.js, sans réécrire renderPokemon().
  window.renderPokemonStatus = (pokemon) => {
    renderStatusBadges(pokemon);
    renderStatusDetails(pokemon);
  };

  // Exposé uniquement pour de futurs filtres/recherches éventuels.
  window.getPokemonGlobalStatus = (pokemon) => ({
    category: getPokemonCategory(pokemon),
    availability: getAvailability(pokemon)
  });
})();
