# 0004. Décrire l'API dans `openapi.yaml` avant de la coder

- **Statut :** acceptée
- **Date :** 2026-11-10
- **Décideurs :** Alexandre (tech-lead), équipes Data et Product

## Contexte

Trois métiers travaillent en parallèle : Product conçoit les écrans, Data définit les critères du score et les données, Tech code les routes `app/api/`. Sans contrat écrit, chacun suppose un format différent pour une tendance. Le code est aussi écrit avec Claude Code, qui invente des routes s'il n'a pas de référence (voir `AGENTS.md`).

## Options

### A. Pas de contrat : le code fait foi

- Avantages : aucun fichier à maintenir.
- Inconvénients : Data et Product doivent lire du TypeScript ; les formats divergent.

### B. Contrat généré depuis le code (Swagger automatique)

- Avantages : toujours synchronisé avec le code.
- Inconvénients : n'existe qu'une fois le code écrit, alors que Data et Product en ont besoin dès maintenant ; Next.js ne le génère pas nativement.

### C. Contrat écrit d'abord, dans `openapi.yaml` à la racine

- Avantages : lisible par toute l'équipe, relu par pull request, sert de référence à l'assistant IA.
- Inconvénients : à mettre à jour à la main quand une route change.

## Décision

Option C. Le fichier `openapi.yaml` (OpenAPI 3.1) à la racine du dépôt est le contrat de l'API. Toute nouvelle route ou modification de format passe d'abord par une pull request sur ce fichier, relue par l'équipe `tech-leads` (voir `.github/CODEOWNERS`).

## Conséquences

- Positives : Data et Product peuvent préparer données et maquettes sans attendre le code.
- Négatives acceptées : risque d'écart entre contrat et code, vérifié à la relecture des PR.
- À revoir si : le nombre de routes dépasse une dizaine (alors générer le contrat depuis des schémas, par exemple avec Zod).
