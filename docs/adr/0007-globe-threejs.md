# 0007. Afficher une Terre réaliste avec Three.js

- **Statut :** acceptée
- **Date :** 2026-11-12
- **Décideurs :** Alexandre (tech-lead), équipe Product

## Contexte

L'équipe Product a fait une maquette de l'interface avec une Terre réaliste (textures NASA, nuages, atmosphère). Le globe actuel (`cobe`) n'affiche que des points. On veut reprendre ce design dans le vrai site, sans perdre les données de la base.

## Options

- **Garder `cobe`** : léger (5 Ko), mais pas de textures, donc loin de la maquette.
- **Three.js avec les textures de la maquette** : rendu identique à la maquette, mais une bibliothèque plus lourde et 1,7 Mo d'images.
- **Une image fixe de la Terre** : aucun code, mais le globe ne tourne plus.

## Décision

Three.js, chargé seulement dans le navigateur (`app/components/Globe.tsx`). Les textures NASA (domaine public) sont dans `public/textures/`, en 4K au plus. Le `Dockerfile` copie `public/`.

## Conséquences

- L'accueil ressemble à la maquette Product, avec les vraies données.
- Le site pèse plus lourd au premier chargement.
- Sans accélération graphique, un message remplace le globe.
- À revoir si le site doit tourner sur des machines peu puissantes.
