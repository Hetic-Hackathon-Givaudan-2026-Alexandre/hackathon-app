# Détecteur de tendances — Givaudan AI Challenge 2026

Thématique 03 : « De la tendance émergente aux opportunités de demain ».

Prototype d'un outil qui repère les signaux faibles (réseaux sociaux, recherches web, actualités, brevets, données de consommation), les regroupe en tendances alimentaires et olfactives, leur donne un score et explique **pourquoi une tendance mérite d'être suivie ou non** : buzz passager ou tendance durable.

> Les données du prototype sont **simulées** (`data/trends.json`, champ `simule: true`).

## Démarrer (nouvel arrivant)

Prérequis : Docker Desktop, VS Code et l'extension **Dev Containers**.

1. Cloner le dépôt : `git clone https://github.com/Hetic-Hackathon-Givaudan-2026-Alexandre/hackathon-app.git`
2. Ouvrir le dossier dans VS Code, puis **Reopen in Container**. Les dépendances s'installent automatiquement (`npm ci`).
3. Dans le terminal du conteneur : `npm run dev`
4. Ouvrir http://localhost:3000 (radar) et http://localhost:3000/api/health (doit afficher `{"status":"ok"}`).

## Commandes

| Commande               | Rôle                          |
| ---------------------- | ----------------------------- |
| `npm run dev`          | serveur de développement      |
| `npm run lint`         | ESLint                        |
| `npm run format`       | formate le code avec Prettier |
| `npm run format:check` | vérifie le formatage (CI)     |
| `npm run build`        | build de production (CI)      |

## Organisation du dépôt

```
app/            pages et routes d'API Next.js (app/api/)
lib/            logique métier (score des tendances)
data/           données simulées
docs/adr/       décisions d'architecture
openapi.yaml    contrat de l'API
AGENTS.md       consignes pour l'assistant de code
```

## Travailler à plusieurs

- Branches : `main` (démontrable), `develop` (intégration, par défaut), `feature/*`, `hotfix/*`.
- Chaque tâche part d'un ticket du tableau GitHub Projects, puis d'une branche `feature/…` et d'une pull request vers `develop` contenant `Closes #numéro`.
- `main` et `develop` sont protégées : pull request, une approbation et le check `qualite` vert obligatoires.

## Équipe

| Nom       | Rôle      |
| --------- | --------- |
| Alexandre | Tech-lead |
| …         | Data      |
| …         | Product   |
