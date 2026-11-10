# AGENTS.md — consignes pour l'assistant de code

Projet : prototype Next.js (TypeScript) du Détecteur de tendances Givaudan. Une page de radar (`app/page.tsx`), une API (`app/api/`), une base PostgreSQL (service `db` de `compose.yaml`) et un appel à l'IA (`lib/ia.ts`).

## Lancer

Toutes les commandes se lancent dans le dev container (`/workspace`).

- Installer : `npm ci`
- Démarrer : `npm run dev`, puis ouvrir http://localhost:3000
- Vérifier l'API et la base : `curl http://localhost:3000/api/health` doit renvoyer `"status":"ok"` et la version de PostgreSQL
- Lire la base : `psql postgres://app:app@db:5432/app -c "SELECT id, nom FROM trends"`
- Avant de dire qu'une tâche est finie, lancer les contrôles de la CI : `npm run lint`, `npm run format:check`, `npm run build`. Les trois doivent passer.

## Règles

- Le contrat de l'API est `openapi.yaml`. Coder contre ce contrat ; ne jamais inventer une route ou un champ absent. Si une route doit changer, modifier d'abord `openapi.yaml`.
- Routes d'API : un dossier par route dans `app/api/`, fichier `route.ts`.
- Logique métier et score : `lib/trends.ts`. Les composants n'implémentent pas de calcul de score.
- Base : schéma dans `db/init/001-schema.sql`, données de test dans `db/init/002-seed.sql`, joués au premier démarrage seulement (supprimer `db/data/` pour les rejouer). Accès SQL uniquement via `lib/db.ts`, requêtes paramétrées (`$1`). Toute donnée simulée garde `simule = true`.
- IA : uniquement dans `lib/ia.ts`, côté serveur, via l'API compatible OpenAI configurée par `AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY` (`.env.local`, modèle dans `.env.example`) : Ollama en dev, Claude en démo (ADR 0002). N'envoyer que des indicateurs agrégés.
- Styles : classes Tailwind CSS ; pas de nouveau fichier CSS hors `app/globals.css`.
- Git : une branche `feature/…` depuis `develop` par ticket, PR vers `develop` avec `Closes #numéro` dans la description, fusion en « Squash and merge ».

## Décisions

- Lire `docs/adr/` avant d'ajouter une dépendance ou de changer d'outil.
- Ne jamais contredire un ADR au statut « acceptée ». Si un changement s'impose, rédiger un nouvel ADR à partir de `docs/adr/0000-modele.md`, puis s'arrêter et demander une relecture.

## À ne pas faire

- Contourner les hooks (`git commit --no-verify`) ou désactiver une règle ESLint sans justification écrite dans `eslint.config.mjs`.
- Installer des dépendances ou committer hors du dev container.
- Écrire une clé API, un mot de passe ou un `.env` dans le code ou dans git.
- Pousser directement sur `main` ou `develop`.
- Lancer `/init` (il écraserait `CLAUDE.md`).
