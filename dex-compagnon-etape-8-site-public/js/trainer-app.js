const trainerSearchInput = document.querySelector("#trainerSearch");
const trainerSuggestionsBox = document.querySelector("#trainerSuggestions");
const trainerCard = document.querySelector("#trainerCard");
const trainerEmptyState = document.querySelector("#trainerEmptyState");
const trainerNameEl = document.querySelector("#trainerName");
const trainerEnglishNameEl = document.querySelector("#trainerEnglishName");
const trainerCategoryEl = document.querySelector("#trainerCategory");
const trainerSpecialtyEl = document.querySelector("#trainerSpecialty");
const trainerRegionsEl = document.querySelector("#trainerRegions");
const trainerPositionEl = document.querySelector("#trainerPosition");
const trainerExtraInfoEl = document.querySelector("#trainerExtraInfo");
const trainerBattlesEl = document.querySelector("#trainerBattles");
const modeTabs = document.querySelector("#searchModeTabs");
const pokemonSearchSection = document.querySelector("#pokemonSearchSection");
const trainerSearchSection = document.querySelector("#trainerSearchSection");
const appShell = document.querySelector("#appShell");
const trainerCategoryFilters = document.querySelector("#trainerCategoryFilters");
const trainerGymFilters = document.querySelector("#trainerGymFilters");

let currentSearchMode = "pokemon";
let currentTrainer = null;
let trainerActiveSuggestionIndex = -1;
let trainerCategoryFilter = "all";
let trainerGymFilter = "all";

function getActiveRegion() {
  return document.querySelector(".region-btn.active")?.dataset.region || "all";
}

function trainerMatchesRegion(trainer) {
  const region = getActiveRegion();
  return region === "all" || (trainer.regions || []).includes(region);
}

function trainerCategoryMatches(trainer) {
  if (trainerCategoryFilter === "all") return true;

  const category = normalizeText(trainer.categorie || "");

  if (trainerCategoryFilter === "gym") {
    return category.includes("championdarene");
  }

  if (trainerCategoryFilter === "elite4") {
    return category.includes("conseil4");
  }

  if (trainerCategoryFilter === "master") {
    return category.includes("maitre");
  }

  if (trainerCategoryFilter === "rival") {
    return category.includes("rival");
  }

  if (trainerCategoryFilter === "special") {
    return category.includes("dresseurspecial");
  }

  return true;
}

function trainerGymMatches(trainer) {
  if (trainerGymFilter === "all") return true;
  return Number(trainer.numero_arene) === Number(trainerGymFilter);
}

function trainerMatchesFilters(trainer) {
  return trainerMatchesRegion(trainer) &&
    trainerCategoryMatches(trainer) &&
    trainerGymMatches(trainer);
}

function trainerNames(trainer) {
  return [
    trainer.nom,
    trainer.nom_en,
    ...(trainer.aliases || [])
  ].filter(Boolean);
}

function trainerSearchTerms(trainer) {
  const regions = (trainer.regions || []).flatMap((region) => [
    region,
    REGIONS[region] || region
  ]);

  const automatic = [
    trainer.nom,
    trainer.nom_en,
    ...(trainer.aliases || []),
    ...regions,
    trainer.position,
    trainer.categorie,
    trainer.specialite,
    trainer.badge,
    ...(trainer.tags || [])
  ];

  if (trainer.numero_arene) {
    const n = trainer.numero_arene;
    automatic.push(
      `arene${n}`,
      `arene ${n}`,
      `arène${n}`,
      `arène ${n}`,
      `gym${n}`,
      `gym ${n}`,
      `badge${n}`,
      `badge ${n}`
    );
  }

  return automatic.filter(Boolean);
}

function trainerQueryTokens(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map(normalizeText)
    .filter(Boolean);
}

function trainerMatchesText(trainer, value) {
  const tokens = trainerQueryTokens(value);
  if (!tokens.length) return true;

  const haystack = trainerSearchTerms(trainer)
    .map(normalizeText)
    .join(" ");

  return tokens.every((token) => haystack.includes(token));
}

function trainerMatchScore(trainer, value) {
  const query = normalizeText(value);
  const names = trainerNames(trainer).map(normalizeText);
  const position = normalizeText(trainer.position || "");
  const specialty = normalizeText(trainer.specialite || "");
  const category = normalizeText(trainer.categorie || "");
  const tags = (trainer.tags || []).map(normalizeText);

  let score = 0;

  if (query) {
    if (names.some((name) => name === query)) score += 1000;
    if (names.some((name) => name.startsWith(query))) score += 500;
    if (position === query) score += 350;
    if (position.startsWith(query)) score += 250;
    if (specialty === query) score += 180;
    if (category.includes(query)) score += 140;
    if (tags.some((tag) => tag === query)) score += 200;
  }

  if (trainer.numero_arene) score += 5;
  return score;
}

function getTrainerExact(value) {
  const q = normalizeText(value);
  if (!q) return null;

  return (window.TRAINERS || []).find((trainer) =>
    trainerMatchesFilters(trainer) &&
    trainerNames(trainer).some((name) => normalizeText(name) === q)
  );
}

function getTrainerMatches(value) {
  const filtered = (window.TRAINERS || [])
    .filter(trainerMatchesFilters)
    .filter((trainer) => trainerMatchesText(trainer, value));

  return filtered
    .sort((a, b) =>
      trainerMatchScore(b, value) - trainerMatchScore(a, value) ||
      (Number(a.numero_arene || 99) - Number(b.numero_arene || 99)) ||
      a.nom.localeCompare(b.nom, "fr")
    )
    .slice(0, 10);
}

function trainerFilterIsActive() {
  return trainerCategoryFilter !== "all" || trainerGymFilter !== "all";
}

function trainerMatchReason(trainer, value) {
  const q = normalizeText(value);

  if (trainer.numero_arene && (
    q.includes(`arene${trainer.numero_arene}`) ||
    q.includes(`gym${trainer.numero_arene}`) ||
    trainerGymFilter !== "all"
  )) {
    return `Arène ${trainer.numero_arene}`;
  }

  if (value && normalizeText(trainer.position || "").includes(q)) {
    return trainer.position;
  }

  if (value && normalizeText(trainer.specialite || "").includes(q)) {
    return `Type ${trainer.specialite}`;
  }

  if (trainer.numero_arene) return `Arène ${trainer.numero_arene}`;
  return trainer.specialite || trainer.categorie || "";
}

function renderTrainerSuggestions() {
  const value = trainerSearchInput.value.trim();

  if (!value && !trainerFilterIsActive()) {
    trainerSuggestionsBox.classList.add("hidden");
    trainerSuggestionsBox.innerHTML = "";
    trainerActiveSuggestionIndex = -1;
    return;
  }

  const matches = getTrainerMatches(value);
  trainerSuggestionsBox.innerHTML = "";
  trainerActiveSuggestionIndex = -1;

  if (matches.length === 0) {
    trainerSuggestionsBox.innerHTML = `
      <div class="no-suggestion">
        Aucun dresseur ne correspond à cette recherche et ces filtres.
      </div>
    `;
    trainerSuggestionsBox.classList.remove("hidden");
    return;
  }

  matches.forEach((trainer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-btn trainer-suggestion-btn";
    button.dataset.trainerSlug = trainer.slug;

    const regions = (trainer.regions || [])
      .map((region) => REGIONS[region] || region)
      .join(", ");

    const categoryLine = [
      trainer.categorie,
      trainer.numero_arene ? `Arène ${trainer.numero_arene}` : "",
      trainer.specialite
    ].filter(Boolean).join(" · ");

    const placeLine = [trainer.position, regions].filter(Boolean).join(" · ");
    const reason = trainerMatchReason(trainer, value);

    button.innerHTML = `
      <span>
        <strong>${escapeHtml(trainer.nom)}</strong>
        <small>${escapeHtml(categoryLine)}</small>
      </span>
      <span class="trainer-suggestion-meta">
        <span class="trainer-suggestion-place">${escapeHtml(placeLine)}</span>
        ${reason ? `<span class="trainer-suggestion-reason">${escapeHtml(reason)}</span>` : ""}
      </span>
    `;

    button.addEventListener("click", () => selectTrainer(trainer));
    trainerSuggestionsBox.appendChild(button);
  });

  trainerSuggestionsBox.classList.remove("hidden");
}

function getTrainerBySlug(slug) {
  return (window.TRAINERS || []).find((trainer) => trainer.slug === slug);
}

function selectTrainer(trainer) {
  currentTrainer = trainer;
  trainerSearchInput.value = trainer.nom;
  trainerSuggestionsBox.classList.add("hidden");
  renderTrainer(trainer);
}

function renderTrainer(trainer) {
  trainerEmptyState.classList.add("hidden");
  trainerCard.classList.remove("hidden");

  trainerNameEl.textContent = trainer.nom || trainer.nom_en || "Dresseur";
  trainerEnglishNameEl.textContent =
    trainer.nom_en && trainer.nom_en !== trainer.nom
      ? `Nom anglais : ${trainer.nom_en}`
      : "";

  trainerCategoryEl.textContent = trainer.categorie || "Dresseur important";
  trainerSpecialtyEl.textContent = trainer.specialite || "Varié";
  trainerRegionsEl.textContent = (trainer.regions || [])
    .map((region) => REGIONS[region] || region)
    .join(", ") || "Non renseignée";
  trainerPositionEl.textContent = trainer.position || "Non renseignée";

  const extras = [];
  if (trainer.badge) extras.push(`Badge : ${trainer.badge}`);
  if (trainer.numero_arene) extras.push(`Arène n°${trainer.numero_arene}`);
  if (trainer.ordre) extras.push(`Ordre : ${trainer.ordre}`);

  trainerExtraInfoEl.textContent = extras.join(" · ");
  trainerExtraInfoEl.classList.toggle("hidden", extras.length === 0);

  renderTrainerBattles(trainer);
}

function renderTrainerBattles(trainer) {
  trainerBattlesEl.innerHTML = "";

  const combats = trainer.combats || [];

  if (combats.length === 0) {
    trainerBattlesEl.innerHTML = `
      <div class="trainer-no-team">
        <strong>Équipe non synchronisée</strong>
        <span>Aucune équipe détaillée n'est disponible pour ce dresseur dans les données publiées.</span>
      </div>
    `;
    return;
  }

  combats.forEach((combat, index) => {
    const details = document.createElement("details");
    details.className = "trainer-battle";
    if (index === 0) details.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <span>${escapeHtml(combat.nom || `Combat ${index + 1}`)}</span>
      <span class="battle-team-count">${(combat.equipe || []).length} Pokémon</span>
    `;
    details.appendChild(summary);

    const team = document.createElement("div");
    team.className = "trainer-team-grid";

    (combat.equipe || []).forEach((member) => {
      team.appendChild(createTrainerPokemonCard(member));
    });

    if (!(combat.equipe || []).length) {
      team.innerHTML = `<span class="muted">Aucune équipe détaillée disponible.</span>`;
    }

    details.appendChild(team);
    trainerBattlesEl.appendChild(details);
  });
}

function createTrainerPokemonCard(member) {
  const card = document.createElement("article");
  card.className = "trainer-pokemon-card";

  const pokemon =
    (member.pokemon_id ? getPokemonById(member.pokemon_id) : null) ||
    POKEMONS.find((p) =>
      [p.nom, p.nom_en].some((name) =>
        normalizeText(name) === normalizeText(member.nom || "")
      )
    );

  const id = Number(pokemon?.id || member.pokemon_id);
  const displayName = pokemon?.nom || member.nom || "Pokémon";
  const sprite = Number.isSafeInteger(id) && id > 0 && id <= 20000
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    : "";

  const types = member.types?.length
    ? member.types
    : (pokemon?.types || []);

  card.innerHTML = `
    <div class="trainer-pokemon-main">
      <div class="trainer-mini-sprite">
        ${sprite ? `<img src="${sprite}" alt="${escapeHtml(displayName)}">` : ""}
      </div>

      <div class="trainer-pokemon-identity">
        <button class="trainer-pokemon-link" type="button">${escapeHtml(displayName)}</button>
        <span class="trainer-level">${member.niveau ? `Niv. ${escapeHtml(member.niveau)}` : ""}</span>
        <div class="trainer-type-row">
          ${types.map((type) => `<span class="type-badge">${escapeHtml(type)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="trainer-member-details">
      ${member.attaques?.length ? `
        <div><strong>Attaques</strong><span>${escapeHtml(member.attaques.join(" · "))}</span></div>
      ` : ""}
      ${member.talent ? `
        <div><strong>Talent</strong><span>${escapeHtml(member.talent)}</span></div>
      ` : ""}
      ${member.objet ? `
        <div><strong>Objet</strong><span>${escapeHtml(member.objet)}</span></div>
      ` : ""}
    </div>
  `;

  const button = card.querySelector(".trainer-pokemon-link");
  button.addEventListener("click", () => {
    if (!pokemon) return;
    switchSearchMode("pokemon");
    selectPokemon(pokemon);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (!pokemon) button.disabled = true;

  return card;
}

function switchSearchMode(mode) {
  currentSearchMode = mode;
  const trainerMode = mode === "trainer";

  appShell.classList.toggle("trainer-mode", trainerMode);

  modeTabs.querySelectorAll(".mode-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  pokemonSearchSection.classList.toggle("hidden", trainerMode);
  trainerSearchSection.classList.toggle("hidden", !trainerMode);

  if (trainerMode) {
    pokemonCard.classList.add("hidden");
    emptyState.classList.add("hidden");

    if (currentTrainer) {
      trainerCard.classList.remove("hidden");
      trainerEmptyState.classList.add("hidden");
    } else {
      trainerCard.classList.add("hidden");
      trainerEmptyState.classList.remove("hidden");
    }

    setTimeout(() => trainerSearchInput.focus(), 0);
  } else {
    trainerCard.classList.add("hidden");
    trainerEmptyState.classList.add("hidden");

    if (typeof currentPokemon !== "undefined" && currentPokemon) {
      pokemonCard.classList.remove("hidden");
      emptyState.classList.add("hidden");
    } else {
      pokemonCard.classList.add("hidden");
      emptyState.classList.remove("hidden");
    }

    setTimeout(() => searchInput.focus(), 0);
  }
}

function getTrainerSuggestionButtons() {
  return [...trainerSuggestionsBox.querySelectorAll(".trainer-suggestion-btn")];
}

function setActiveTrainerSuggestion(index) {
  const buttons = getTrainerSuggestionButtons();
  buttons.forEach((button) => button.classList.remove("active"));

  if (!buttons.length) {
    trainerActiveSuggestionIndex = -1;
    return;
  }

  trainerActiveSuggestionIndex = Math.max(0, Math.min(index, buttons.length - 1));
  buttons[trainerActiveSuggestionIndex].classList.add("active");
  buttons[trainerActiveSuggestionIndex].scrollIntoView({ block: "nearest" });
}

modeTabs.addEventListener("click", (event) => {
  const button = event.target.closest(".mode-btn");
  if (!button) return;
  switchSearchMode(button.dataset.mode);
});

trainerSearchInput.addEventListener("input", () => {
  renderTrainerSuggestions();

  const exact = getTrainerExact(trainerSearchInput.value.trim());
  if (exact) selectTrainer(exact);
});

trainerSearchInput.addEventListener("keydown", (event) => {
  const buttons = getTrainerSuggestionButtons();

  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveTrainerSuggestion(trainerActiveSuggestionIndex + 1);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveTrainerSuggestion(trainerActiveSuggestionIndex - 1);
  }

  if (event.key === "Enter") {
    const exact = getTrainerExact(trainerSearchInput.value.trim());
    if (exact) {
      event.preventDefault();
      selectTrainer(exact);
      return;
    }

    const target = buttons[trainerActiveSuggestionIndex] || buttons[0];
    if (target) {
      event.preventDefault();
      const trainer = getTrainerBySlug(target.dataset.trainerSlug);
      if (trainer) selectTrainer(trainer);
    }
  }

  if (event.key === "Escape") {
    trainerSuggestionsBox.classList.add("hidden");
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#trainerSearchSection")) {
    trainerSuggestionsBox.classList.add("hidden");
  }
});

function updateTrainerFilterButtons() {
  trainerCategoryFilters?.querySelectorAll("[data-trainer-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.trainerCategory === trainerCategoryFilter);
  });

  trainerGymFilters?.querySelectorAll("[data-gym-number]").forEach((button) => {
    button.classList.toggle("active", button.dataset.gymNumber === String(trainerGymFilter));
  });
}

trainerCategoryFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-trainer-category]");
  if (!button) return;

  trainerCategoryFilter = button.dataset.trainerCategory;

  // Si on quitte le filtre Arènes, on remet aussi le numéro d'arène à Toutes.
  if (trainerCategoryFilter !== "gym" && trainerGymFilter !== "all") {
    trainerGymFilter = "all";
  }

  updateTrainerFilterButtons();
  renderTrainerSuggestions();
  trainerSearchInput.focus();
});

trainerGymFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gym-number]");
  if (!button) return;

  trainerGymFilter = button.dataset.gymNumber;

  // Cliquer sur un numéro d'arène active automatiquement la catégorie Arènes.
  if (trainerGymFilter !== "all") {
    trainerCategoryFilter = "gym";
  }

  updateTrainerFilterButtons();
  renderTrainerSuggestions();
  trainerSearchInput.focus();
});

updateTrainerFilterButtons();

regionTabs.addEventListener("click", () => {
  if (currentSearchMode === "trainer") {
    renderTrainerSuggestions();

    if (currentTrainer && !trainerMatchesRegion(currentTrainer)) {
      trainerCard.classList.add("hidden");
      trainerEmptyState.classList.remove("hidden");
      currentTrainer = null;
      trainerSearchInput.value = "";
    }
  }
});
