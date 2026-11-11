# Dex Compagnon

Guide indépendant et non officiel pour consulter les fiches des Pokémon, les dresseurs et des données communautaires de rencontre et d'entraînement EV.

Ouvrir `index.html` (ou activer GitHub Pages sur la racine de ce dépôt). Cette version publique ne contient aucun outil de synchronisation ou de maintenance. Le fichier `.nojekyll` permet à GitHub Pages de servir directement les fichiers statiques.

**Précision** : les localisations, horaires, saisons et équipes de dresseurs peuvent dépendre de la version du jeu et des sources utilisées ; ils ne s'appliquent pas nécessairement aux jeux officiels.

Ce projet n'est affilié, approuvé ou soutenu ni par Nintendo, ni par The Pokémon Company, ni par Game Freak, ni par les opérateurs des sources communautaires.

**Sources et crédits :** [PokéAPI](https://pokeapi.co/) pour certaines données, [PokeMMO-Tools](https://github.com/PokeMMO-Tools/pokemmo-data) pour des données communautaires, [PikaMMO](https://www.pikammo.fr/) pour les équipes de dresseurs (ses contenus originaux sont annoncés sous [CC BY 4.0 avec attribution](https://www.pikammo.fr/en/cgu)), et [PokeVengers](https://github.com/PokeVengers/PokeMMO-Data-Gen) pour des localisations lorsque cette source est utilisée. Les sprites sont chargés depuis [PokéAPI/sprites](https://github.com/PokeAPI/sprites) ; les images restent soumises aux droits de leurs titulaires. Les URLs de provenance restent dans les données lorsqu'elles sont disponibles.

Les noms, visuels et contenus tiers restent soumis aux droits de leurs titulaires ; ce dépôt ne revendique aucune affiliation officielle ni aucune licence implicite sur eux. Vérifier les droits de diffusion des données et images avant publication.

Le nom « Dex Compagnon » est provisoire.


## Recherche XP

L'onglet Recherche XP permet de comparer les lieux d'entraînement selon les
faiblesses de type des espèces sauvages, leur niveau et leur EXP de base. Il
suppose une attaque de même type que le Pokémon sélectionné, et signale
les risques de type potentiels avec ⚠. Ce sont des indications, pas une mesure
d'EXP par heure ni une garantie sur les attaques possédées.

Les zones débloquées et leur filtre sont enregistrés séparément dans Recherche XP.
Aucun choix effectué dans Recherche XP ne change les réglages de Recherche EV.

## Sélection des zones — V2.1 β5

Dans Recherche EV et Recherche XP, le sélecteur **Normal / Simplifié** apparaît
à côté du titre des routes accessibles. Le mode simplifié regroupe les lieux
par étape indicative de l'aventure. On peut cocher une étape entière ou
déplier son titre pour choisir des lieux individuellement. Les cases EV et XP
ainsi que les modes d'affichage sont sauvegardés indépendamment dans le navigateur.

### Recherche XP — EV en parallèle (V2.1 β6)

Les résultats XP indiquent aussi les EV de base donnés par chaque Pokémon
sauvage. Le filtre EV facultatif permet de privilégier un EV parmi les six
statistiques pendant l'entraînement XP, sans masquer les espèces donnant
d'autres EV et sans modifier les paramètres de Recherche EV. Les classements
restent indicatifs (espèces présentes, pas de taux de rencontre réels).

### Recherche XP — Double EV et régions multiples (V2.1 β7)

Le filtre EV de Recherche XP accepte jusqu'à **deux statistiques en même temps**.
Les zones contenant au moins une des statistiques choisies restent proposées,
avec une préférence pour les zones utiles aux deux. Le mode sans EV conserve
le classement XP standard.

Il est aussi possible de rechercher sur **plusieurs régions à la fois**. Dans
« Choisir mes routes », une liste permet de configurer les routes accessibles
pour chaque région sélectionnée, indépendamment de la progression EV.

### Navigation EV / XP — V2.1 β8

Le retour depuis une fiche Pokémon conserve la route ouverte et la position de
lecture des recherches EV et XP. La petite épingle 📌 place temporairement une
route en tête des résultats, sans modifier son score. Dans Recherche XP, les
noms et sprites des Pokémon sauvages ouvrent désormais leurs fiches Pokémon.
Les épingles EV et XP sont indépendantes.
