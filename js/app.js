const searchInput = document.querySelector("#pokemonSearch");
const suggestionsBox = document.querySelector("#suggestions");
const pokemonCard = document.querySelector("#pokemonCard");
const emptyState = document.querySelector("#emptyState");
const regionTabs = document.querySelector("#regionTabs");
const pinList = document.querySelector("#pinList");
const pinCount = document.querySelector("#pinCount");
const clearPinsBtn = document.querySelector("#clearPinsBtn");
const pinCurrentBtn = document.querySelector("#pinCurrentBtn");

const spriteEl = document.querySelector("#pokemonSprite");
const dexNumberEl = document.querySelector("#dexNumber");
const pokemonNameEl = document.querySelector("#pokemonName");
const englishNameEl = document.querySelector("#englishName");
const typeListEl = document.querySelector("#typeList");
const weaknessListEl = document.querySelector("#weaknessList");
const resistanceListEl = document.querySelector("#resistanceList");
const immunityListEl = document.querySelector("#immunityList");
const evYieldListEl = document.querySelector("#evYieldList");
const locationListEl = document.querySelector("#locationList");
const locationTitleEl = document.querySelector("#locationTitle");
const technicalDataEl = document.querySelector("#technicalData");

const REGIONS = {
  all: "Toutes les régions",
  kanto: "Kanto",
  hoenn: "Hoenn",
  sinnoh: "Sinnoh",
  unys: "Unys",
  johto: "Johto"
};

const PI18N = window.DexI18n;
const cardText = (key) => PI18N?.cardText(key) || key;
const localName = (pokemon) => PI18N?.pokemonName(pokemon) || pokemon.nom;
const localTerm = (group, value) => PI18N?.pokemonTerm(group, value) || value;
const localEvolutionMethod = (value) => PI18N?.evolutionMethod(value) || value;
const localLocationName = (region, value) => PI18N?.locationName?.(region, value) ?? value;
const localLocationMethod = (value) => PI18N?.locationMethod?.(value) ?? value;
const localLocationRarity = (value) => PI18N?.locationRarity?.(value) ?? value;
const localLocationLevel = (value) => PI18N?.locationLevel?.(value) ?? value;
const localRegionLabel = (region) => PI18N?.regionLabel?.(region) || REGIONS[region] || region;

const MAX_SUGGESTIONS = 10;
const MAX_PINS = 10;
const LOCAL_STORAGE_KEY = "pokemmoDexPinsV1";

let selectedRegion = "all";
let currentPokemon = null;
let activeSuggestionIndex = -1;

// Les données importées peuvent contenir du texte non fiable : jamais d'HTML brut.
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, "");
}

// Préparer les noms une seule fois : ils ne changent pas pendant la session.
const pokemonById = new Map(POKEMONS.map((pokemon) => [pokemon.id, pokemon]));
const pokemonSearchIndex = POKEMONS.map((pokemon) => ({
  pokemon,
  fr: normalizeText(pokemon.nom),
  en: normalizeText(pokemon.nom_en || "")
}));

function getPokemonById(id) {
  return pokemonById.get(Number(id));
}

function getPokemonByExactName(value) {
  const query = normalizeText(value);
  return pokemonSearchIndex.find(({ fr, en }) => fr === query || en === query)?.pokemon;
}

// Les numéros acceptés : 25, 025, #25 ou #025.
function isDexNumberQuery(value) {
  return /^#?\d+$/.test(value.trim());
}

function getPokemonByExactSearch(value) {
  const query = value.trim();
  if (isDexNumberQuery(query)) {
    return getPokemonById(Number(query.replace(/^#/, "")));
  }
  return getPokemonByExactName(query);
}

function getMatchingPokemon(value) {
  const rawQuery = value.trim();
  if (isDexNumberQuery(rawQuery)) {
    const digits = rawQuery.replace(/^#/, "");
    const exactId = Number(digits);

    return POKEMONS
      .filter((pokemon) =>
        String(pokemon.id).startsWith(digits) ||
        String(pokemon.id).padStart(3, "0").startsWith(digits)
      )
      .sort((a, b) => (b.id === exactId) - (a.id === exactId) || a.id - b.id)
      .slice(0, MAX_SUGGESTIONS);
  }

  const query = normalizeText(rawQuery);
  if (!query) return [];

  return pokemonSearchIndex
    .filter(({ fr, en }) => fr.startsWith(query) || en.startsWith(query))
    .map(({ pokemon }) => pokemon)
    .sort((a, b) => localName(a).localeCompare(localName(b), PI18N?.language || "fr"))
    .slice(0, MAX_SUGGESTIONS);
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const same = b[i - 1] === a[j - 1];

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (same ? 0 : 1)
      );
    }
  }

  return matrix[b.length][a.length];
}

function getApproximatePokemon(value) {
  const query = normalizeText(value);

  if (query.length < 3) {
    return [];
  }

  return pokemonSearchIndex
    .map(({ pokemon, fr, en }) => ({
      pokemon,
      distance: Math.min(
        levenshteinDistance(query, fr),
        levenshteinDistance(query, en)
      )
    }))
    .filter((item) => item.distance <= Math.max(2, Math.floor(query.length / 3)))
    .sort((a, b) => a.distance - b.distance || localName(a.pokemon).localeCompare(localName(b.pokemon), PI18N?.language || "fr"))
    .slice(0, MAX_SUGGESTIONS)
    .map((item) => item.pokemon);
}

function renderSuggestions() {
  const value = searchInput.value.trim();

  if (!value) {
    suggestionsBox.classList.add("hidden");
    suggestionsBox.innerHTML = "";
    activeSuggestionIndex = -1;
    return;
  }

  let matches = getMatchingPokemon(value);
  let approximate = false;

  if (matches.length === 0 && !isDexNumberQuery(value)) {
    matches = getApproximatePokemon(value);
    approximate = matches.length > 0;
  }

  suggestionsBox.innerHTML = "";
  activeSuggestionIndex = -1;

  if (matches.length === 0) {
    suggestionsBox.innerHTML = `
      <div class="no-suggestion">
        ${escapeHtml(cardText("pokemon.noResult"))}
      </div>
    `;
    suggestionsBox.classList.remove("hidden");
    return;
  }

  if (approximate) {
    const info = document.createElement("div");
    info.className = "no-suggestion";
    info.textContent = cardText("pokemon.didYouMean");
    suggestionsBox.appendChild(info);
  }

  matches.forEach((pokemon) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-btn";
    button.dataset.pokemonId = pokemon.id;

    button.innerHTML = `
      <span>${escapeHtml(localName(pokemon))}</span>
      <span class="suggestion-number">#${String(pokemon.id).padStart(3, "0")}</span>
    `;

    button.addEventListener("click", () => {
      selectPokemon(pokemon);
    });

    suggestionsBox.appendChild(button);
  });

  suggestionsBox.classList.remove("hidden");
}

function selectPokemon(pokemon) {
  currentPokemon = pokemon;
  searchInput.value = localName(pokemon);
  suggestionsBox.classList.add("hidden");
  renderPokemon(pokemon);
}

function renderPokemon(pokemon) {
  emptyState.classList.add("hidden");
  pokemonCard.classList.remove("hidden");

  dexNumberEl.textContent = `#${String(pokemon.id).padStart(3, "0")}`;
  pokemonNameEl.textContent = localName(pokemon);
  const alternateName = PI18N?.language === "en" ? pokemon.nom : pokemon.nom_en;
  const alternateKey = PI18N?.language === "en" ? "pokemon.frenchName" : "pokemon.englishName";
  englishNameEl.textContent = alternateName && alternateName !== localName(pokemon)
    ? `${cardText(alternateKey)} : ${alternateName}` : "";

  renderTypes(pokemon.types);
  renderMultiplierList(weaknessListEl, pokemon.faiblesses, cardText("pokemon.noWeakness"));
  renderMultiplierList(resistanceListEl, pokemon.resistances, cardText("pokemon.noResistance"));
  renderSimpleList(immunityListEl, pokemon.immunites, cardText("pokemon.noImmunity"), "type");
  renderLocations(pokemon);
  renderTechnicalData(pokemon);
  renderEvYield(pokemon);
  window.renderPokemonStatus?.(pokemon);
  updateCurrentPinButton();
  loadSprite(pokemon);
}

function loadSprite(pokemon) {
  // Aucun sprite local n'est distribué : une requête inutile en moins par fiche.
  spriteEl.alt = PI18N?.language === "en" ? `Sprite of ${localName(pokemon)}` : `Sprite de ${localName(pokemon)}`;
  spriteEl.onerror = null;
  spriteEl.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
}

function renderTypes(types) {
  typeListEl.innerHTML = "";

  types.forEach((type) => {
    const badge = document.createElement("span");
    badge.className = "type-badge";
    badge.textContent = localTerm("type", type);
    typeListEl.appendChild(badge);
  });
}

function renderMultiplierList(container, values, emptyMessage) {
  container.innerHTML = "";

  const entries = Object.entries(values || {});

  if (entries.length === 0) {
    container.innerHTML = `<span class="muted">${emptyMessage}</span>`;
    return;
  }

  entries
    .sort((a, b) => b[1] - a[1] || localTerm("type", a[0]).localeCompare(localTerm("type", b[0]), PI18N?.language || "fr"))
    .forEach(([type, multiplier]) => {
      const badge = document.createElement("span");
      badge.className = "multiplier-badge";
      badge.innerHTML = `
        <span>${escapeHtml(localTerm("type", type))}</span>
        <span class="multiplier">×${escapeHtml(multiplier)}</span>
      `;
      container.appendChild(badge);
    });
}

function renderSimpleList(container, values, emptyMessage, group = "") {
  container.innerHTML = "";

  if (!values || values.length === 0) {
    container.innerHTML = `<span class="muted">${emptyMessage}</span>`;
    return;
  }

  values.forEach((value) => {
    const badge = document.createElement("span");
    badge.className = "plain-badge";
    badge.textContent = group ? localTerm(group, value) : value;
    container.appendChild(badge);
  });
}

function renderLocations(pokemon) {
  locationListEl.innerHTML = "";
  locationTitleEl.textContent = selectedRegion === "all" ? window.DexI18n?.t("common.allRegions") || REGIONS.all : localRegionLabel(selectedRegion);

  const regionsToShow =
    selectedRegion === "all"
      ? ["kanto", "hoenn", "sinnoh", "unys", "johto"]
      : [selectedRegion];

  let displayedSomething = false;

  regionsToShow.forEach((region) => {
    const locations = pokemon.locations?.[region] || [];

    if (locations.length === 0) {
      return;
    }

    displayedSomething = true;

    const regionWrapper = document.createElement("div");
    regionWrapper.className = "location-region";

    const title = document.createElement("h4");
    title.textContent = localRegionLabel(region);
    regionWrapper.appendChild(title);

    locations.forEach((location) => {
      const item = document.createElement("div");
      item.className = "location-item";

      item.innerHTML = `
        <div>
          <div class="location-zone">${escapeHtml(localLocationName(region, location.zone || cardText("pokemon.unknownZone")))}</div>
        </div>
        <div class="location-detail">${escapeHtml(localLocationMethod(location.methode || cardText("pokemon.unknownMethod")))}</div>
        <div class="location-detail">${escapeHtml(localLocationLevel(location.niveau || cardText("pokemon.unknownLevel")))}</div>
        <div class="location-detail">${escapeHtml(localLocationRarity(location.rarete || ""))}</div>
      `;

      regionWrapper.appendChild(item);
    });

    locationListEl.appendChild(regionWrapper);
  });

  if (!displayedSomething) {
    locationListEl.innerHTML = `
      <p class="muted" style="margin:18px 0 0;">
${escapeHtml(cardText("pokemon.noLocation"))}
      </p>
    `;
  }
}

function renderTechnicalData(pokemon) {
  technicalDataEl.innerHTML = "";

  const items = [
    [cardText("pokemon.abilities"), pokemon.talents?.map((ability) => localTerm("ability", ability)).join(", ") || cardText("common.noData")],
    [cardText("pokemon.baseStats"), objectToText(pokemon.stats)],
    [cardText("pokemon.evolution"), evolutionsToText(pokemon.evolutions || (pokemon.evolution ? [pokemon.evolution] : []))]
  ];

  items.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "tech-item";
    const heading = document.createElement("strong");
    heading.textContent = label;
    const text = document.createElement("span");
    text.textContent = value;
    item.append(heading, text);
    technicalDataEl.appendChild(item);
  });

  const eggItem = document.createElement("div");
  eggItem.className = "tech-item egg-tech-item";
  const eggTitle = document.createElement("strong");
  eggTitle.textContent = cardText("pokemon.eggGroups");
  const eggList = document.createElement("div");
  eggList.id = "eggGroupList";
  eggList.className = "plain-list";
  renderSimpleList(eggList, pokemon.groupes_oeuf, cardText("common.noData"), "egg");
  eggItem.append(eggTitle, eggList);
  technicalDataEl.appendChild(eggItem);
}

function renderEvYield(pokemon) {
  evYieldListEl.innerHTML = "";
  const entries = Object.entries(pokemon.ev || {});

  if (!entries.length) {
    evYieldListEl.textContent = cardText("pokemon.noEv");
    return;
  }

  entries.forEach(([stat, amount]) => {
    const badge = document.createElement("span");
    badge.className = "ev-yield-badge";
    badge.textContent = `+${amount} ${localTerm("ev", stat)}`;
    evYieldListEl.appendChild(badge);
  });
}

function objectToText(value) {
  if (!value || Object.keys(value).length === 0) {
    return cardText("common.noData");
  }

  return Object.entries(value)
    .map(([key, val]) => `${localTerm("stat", key)}: ${val}`)
    .join(" · ");
}

function evolutionsToText(evolutions) {
  if (!evolutions || evolutions.length === 0) {
    return cardText("pokemon.noEvolution");
  }

  return evolutions
    .map((evolution) => {
      const target = getPokemonById(evolution.vers);
      const targetName = target ? localName(target) : (evolution.nom || `#${evolution.vers}`);

      if (evolution.methode) {
        return `${targetName} — ${localEvolutionMethod(evolution.methode)}`;
      }

      const details = [];
      if (evolution.type) details.push(evolution.type);
      if (evolution.niveau) details.push(`${cardText("pokemon.level")} ${evolution.niveau}`);

      return `${targetName}${details.length ? ` — ${details.join(", ")}` : ""}`;
    })
    .join(" · ");
}

function getPins() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return Array.isArray(saved) ? saved.slice(0, MAX_PINS) : [];
  } catch {
    return [];
  }
}

function savePins(pins) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pins.slice(0, MAX_PINS)));
  } catch {
    // L'interface reste utilisable si le navigateur bloque le stockage local.
  }
}

function isPinned(pokemonId) {
  return getPins().includes(pokemonId);
}

function pinPokemon(pokemon) {
  const pins = getPins();

  if (pins.includes(pokemon.id)) {
    unpinPokemon(pokemon.id);
    return;
  }

  if (pins.length >= MAX_PINS) {
    alert(cardText("pokemon.fullPins"));
    return;
  }

  pins.push(pokemon.id);
  savePins(pins);
  renderPins();
  updateCurrentPinButton();
}

function unpinPokemon(pokemonId) {
  const pins = getPins().filter((id) => id !== Number(pokemonId));
  savePins(pins);
  renderPins();
  updateCurrentPinButton();
}

function renderPins() {
  const pins = getPins();
  pinList.innerHTML = "";
  pinCount.textContent = `${pins.length} / ${MAX_PINS}`;

  for (let index = 0; index < MAX_PINS; index++) {
    const slot = document.createElement("div");
    slot.className = "pin-slot";

    const indexEl = document.createElement("div");
    indexEl.className = "pin-index";
    indexEl.textContent = index + 1;
    slot.appendChild(indexEl);

    const pokemonId = pins[index];

    if (!pokemonId) {
      const empty = document.createElement("div");
      empty.className = "empty-pin";
      empty.textContent = cardText("pokemon.freeSlot");
      slot.appendChild(empty);

      const spacer = document.createElement("div");
      slot.appendChild(spacer);
    } else {
      const pokemon = getPokemonById(pokemonId);

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "pin-open-btn";
      openButton.textContent = pokemon ? localName(pokemon) : `Pokémon #${pokemonId}`;
      openButton.addEventListener("click", () => {
        if (pokemon) selectPokemon(pokemon);
      });
      slot.appendChild(openButton);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "pin-remove-btn";
      removeButton.textContent = "×";
      removeButton.title = cardText("pokemon.remove");
      removeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        unpinPokemon(pokemonId);
      });
      slot.appendChild(removeButton);
    }

    pinList.appendChild(slot);
  }
}

function updateCurrentPinButton() {
  if (!currentPokemon) {
    return;
  }

  const pinned = isPinned(currentPokemon.id);

  pinCurrentBtn.textContent = pinned ? cardText("pokemon.pinned") : cardText("pokemon.pin");
  pinCurrentBtn.classList.toggle("is-pinned", pinned);
}

function getSuggestionButtons() {
  return [...suggestionsBox.querySelectorAll(".suggestion-btn")];
}

function setActiveSuggestion(index) {
  const buttons = getSuggestionButtons();

  buttons.forEach((button) => button.classList.remove("active"));

  if (buttons.length === 0) {
    activeSuggestionIndex = -1;
    return;
  }

  activeSuggestionIndex = Math.max(0, Math.min(index, buttons.length - 1));
  buttons[activeSuggestionIndex].classList.add("active");
  buttons[activeSuggestionIndex].scrollIntoView({ block: "nearest" });
}

searchInput.addEventListener("input", () => {
  renderSuggestions();

  // Ne pas sélectionner #002 pendant que l'utilisateur tape #025.
  const query = searchInput.value.trim();
  if (isDexNumberQuery(query)) return;

  const exact = getPokemonByExactName(query);
  if (exact) {
    selectPokemon(exact);
  }
});

searchInput.addEventListener("keydown", (event) => {
  const buttons = getSuggestionButtons();

  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveSuggestion(activeSuggestionIndex + 1);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveSuggestion(activeSuggestionIndex - 1);
  }

  if (event.key === "Enter") {
    const exact = getPokemonByExactSearch(searchInput.value.trim());

    if (exact) {
      event.preventDefault();
      selectPokemon(exact);
      return;
    }

    if (buttons[activeSuggestionIndex]) {
      event.preventDefault();
      const pokemon = getPokemonById(buttons[activeSuggestionIndex].dataset.pokemonId);
      if (pokemon) selectPokemon(pokemon);
    } else if (buttons[0]) {
      event.preventDefault();
      const pokemon = getPokemonById(buttons[0].dataset.pokemonId);
      if (pokemon) selectPokemon(pokemon);
    }
  }

  if (event.key === "Escape") {
    suggestionsBox.classList.add("hidden");
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-wrap")) {
    suggestionsBox.classList.add("hidden");
  }
});

regionTabs.addEventListener("click", (event) => {
  const button = event.target.closest(".region-btn");

  if (!button) return;

  selectedRegion = button.dataset.region;

  document
    .querySelectorAll(".region-btn")
    .forEach((btn) => btn.classList.toggle("active", btn === button));

  if (currentPokemon) {
    renderLocations(currentPokemon);
  }
});

pinCurrentBtn.addEventListener("click", () => {
  if (currentPokemon) {
    pinPokemon(currentPokemon);
  }
});

clearPinsBtn.addEventListener("click", () => {
  if (getPins().length === 0) {
    return;
  }

  const confirmed = confirm(cardText("pokemon.clearConfirm"));

  if (confirmed) {
    savePins([]);
    renderPins();
    updateCurrentPinButton();
  }
});

renderPins();

// Re-render the currently displayed entry when the language changes.
// No changes are made to saved Pokémon IDs, filters or encounter data.
document.addEventListener("dex:languagechange", () => {
  if (currentPokemon) {
    const oldNames = [currentPokemon.nom, currentPokemon.nom_en || currentPokemon.nom];
    const keepSelectedName = oldNames.includes(searchInput.value.trim());
    renderPokemon(currentPokemon);
    if (keepSelectedName) searchInput.value = localName(currentPokemon);
  }
  if (!suggestionsBox.classList.contains("hidden")) renderSuggestions();
  renderPins();
});
