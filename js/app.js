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
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))
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
    .sort((a, b) => a.distance - b.distance || a.pokemon.nom.localeCompare(b.pokemon.nom, "fr"))
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
        Aucun Pokémon trouvé dans la base actuelle.
      </div>
    `;
    suggestionsBox.classList.remove("hidden");
    return;
  }

  if (approximate) {
    const info = document.createElement("div");
    info.className = "no-suggestion";
    info.textContent = "Tu cherchais peut-être :";
    suggestionsBox.appendChild(info);
  }

  matches.forEach((pokemon) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-btn";
    button.dataset.pokemonId = pokemon.id;

    button.innerHTML = `
      <span>${escapeHtml(pokemon.nom)}</span>
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
  searchInput.value = pokemon.nom;
  suggestionsBox.classList.add("hidden");
  renderPokemon(pokemon);
}

function renderPokemon(pokemon) {
  emptyState.classList.add("hidden");
  pokemonCard.classList.remove("hidden");

  dexNumberEl.textContent = `#${String(pokemon.id).padStart(3, "0")}`;
  pokemonNameEl.textContent = pokemon.nom;
  englishNameEl.textContent =
    pokemon.nom_en && pokemon.nom_en !== pokemon.nom
      ? `Nom anglais : ${pokemon.nom_en}`
      : "";

  renderTypes(pokemon.types);
  renderMultiplierList(weaknessListEl, pokemon.faiblesses, "Aucune faiblesse enregistrée");
  renderMultiplierList(resistanceListEl, pokemon.resistances, "Aucune résistance enregistrée");
  renderSimpleList(immunityListEl, pokemon.immunites, "Aucune immunité");
  renderLocations(pokemon);
  renderTechnicalData(pokemon);
  renderEvYield(pokemon);
  window.renderPokemonStatus?.(pokemon);
  updateCurrentPinButton();
  loadSprite(pokemon);
}

function loadSprite(pokemon) {
  // Aucun sprite local n'est distribué : une requête inutile en moins par fiche.
  spriteEl.alt = `Sprite de ${pokemon.nom}`;
  spriteEl.onerror = null;
  spriteEl.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
}

function renderTypes(types) {
  typeListEl.innerHTML = "";

  types.forEach((type) => {
    const badge = document.createElement("span");
    badge.className = "type-badge";
    badge.textContent = type;
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
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
    .forEach(([type, multiplier]) => {
      const badge = document.createElement("span");
      badge.className = "multiplier-badge";
      badge.innerHTML = `
        <span>${escapeHtml(type)}</span>
        <span class="multiplier">×${escapeHtml(multiplier)}</span>
      `;
      container.appendChild(badge);
    });
}

function renderSimpleList(container, values, emptyMessage) {
  container.innerHTML = "";

  if (!values || values.length === 0) {
    container.innerHTML = `<span class="muted">${emptyMessage}</span>`;
    return;
  }

  values.forEach((value) => {
    const badge = document.createElement("span");
    badge.className = "plain-badge";
    badge.textContent = value;
    container.appendChild(badge);
  });
}

function renderLocations(pokemon) {
  locationListEl.innerHTML = "";
  locationTitleEl.textContent = REGIONS[selectedRegion];

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
    title.textContent = REGIONS[region];
    regionWrapper.appendChild(title);

    locations.forEach((location) => {
      const item = document.createElement("div");
      item.className = "location-item";

      item.innerHTML = `
        <div>
          <div class="location-zone">${escapeHtml(location.zone || "Zone inconnue")}</div>
        </div>
        <div class="location-detail">${escapeHtml(location.methode || "Méthode inconnue")}</div>
        <div class="location-detail">${escapeHtml(location.niveau || "Niveau ?")}</div>
        <div class="location-detail">${escapeHtml(location.rarete || "")}</div>
      `;

      regionWrapper.appendChild(item);
    });

    locationListEl.appendChild(regionWrapper);
  });

  if (!displayedSomething) {
    locationListEl.innerHTML = `
      <p class="muted" style="margin:18px 0 0;">
        Aucune localisation n'est renseignée dans la base pour ce Pokémon et cette région.
      </p>
    `;
  }
}

function renderTechnicalData(pokemon) {
  technicalDataEl.innerHTML = "";

  const items = [
    ["Talent(s)", pokemon.talents?.join(", ") || "Non renseigné"],
    ["Stats de base", objectToText(pokemon.stats)],
    ["Évolution", evolutionsToText(pokemon.evolutions || (pokemon.evolution ? [pokemon.evolution] : []))]
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
  eggTitle.textContent = "Groupes d'œuf";
  const eggList = document.createElement("div");
  eggList.id = "eggGroupList";
  eggList.className = "plain-list";
  renderSimpleList(eggList, pokemon.groupes_oeuf, "Non renseigné");
  eggItem.append(eggTitle, eggList);
  technicalDataEl.appendChild(eggItem);
}

function renderEvYield(pokemon) {
  evYieldListEl.innerHTML = "";
  const entries = Object.entries(pokemon.ev || {});

  if (!entries.length) {
    evYieldListEl.innerHTML = '<span class="muted">Aucun EV renseigné</span>';
    return;
  }

  entries.forEach(([stat, amount]) => {
    const badge = document.createElement("span");
    badge.className = "ev-yield-badge";
    badge.textContent = `+${amount} ${stat}`;
    evYieldListEl.appendChild(badge);
  });
}

function objectToText(value) {
  if (!value || Object.keys(value).length === 0) {
    return "Non renseigné";
  }

  return Object.entries(value)
    .map(([key, val]) => `${key}: ${val}`)
    .join(" · ");
}

function evolutionsToText(evolutions) {
  if (!evolutions || evolutions.length === 0) {
    return "Pas d'évolution suivante enregistrée";
  }

  return evolutions
    .map((evolution) => {
      const target = getPokemonById(evolution.vers);
      const targetName = evolution.nom || (target ? target.nom : `#${evolution.vers}`);

      if (evolution.methode) {
        return `${targetName} — ${evolution.methode}`;
      }

      const details = [];
      if (evolution.type) details.push(evolution.type);
      if (evolution.niveau) details.push(`niveau ${evolution.niveau}`);

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
    alert("Les 10 emplacements sont déjà utilisés. Retire d'abord un Pokémon.");
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
      empty.textContent = "Emplacement libre";
      slot.appendChild(empty);

      const spacer = document.createElement("div");
      slot.appendChild(spacer);
    } else {
      const pokemon = getPokemonById(pokemonId);

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "pin-open-btn";
      openButton.textContent = pokemon ? pokemon.nom : `Pokémon #${pokemonId}`;
      openButton.addEventListener("click", () => {
        if (pokemon) selectPokemon(pokemon);
      });
      slot.appendChild(openButton);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "pin-remove-btn";
      removeButton.textContent = "×";
      removeButton.title = "Retirer";
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

  pinCurrentBtn.textContent = pinned ? "✓ Épinglé" : "📌 Épingler";
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

  const confirmed = confirm("Vider les 10 emplacements épinglés ?");

  if (confirmed) {
    savePins([]);
    renderPins();
    updateCurrentPinButton();
  }
});

renderPins();
