# Détecteur de tendances — Givaudan AI Challenge 2026

Thématique 03 : « De la tendance émergente aux opportunités de demain ».

Prototype d'un outil qui repère les signaux faibles (réseaux sociaux, recherches web, actualités, brevets, données de consommation), les regroupe en tendances alimentaires et olfactives, leur donne un score et explique **pourquoi une tendance mérite d'être suivie ou non** : buzz passager ou tendance durable.

> Les données du prototype sont **simulées** (`db/init/002-seed.sql`, colonne `simule`).

Chaîne : page Next.js → API Next.js (`app/api/`) → PostgreSQL 17 (service `db`) et IA compatible OpenAI (Ollama en dev, Claude en démo).

## Démarrer (nouvel arrivant)

### 1. Installer, une seule fois, sur votre machine

- [Docker Desktop](https://www.docker.com/products/docker-desktop/), lancé avant d'ouvrir le projet
- [VS Code](https://code.visualstudio.com/) avec l'extension **Dev Containers** (`ms-vscode-remote.remote-containers`)
- [Git](https://git-scm.com/downloads)
- [Ollama](https://ollama.com/download) pour l'IA gratuite, puis dans un terminal de votre machine :
  ```bash
  ollama pull llama3.2:1b
  ```

### 2. Lancer le projet

1. Cloner : `git clone https://github.com/Hetic-Hackathon-Givaudan-2026-Alexandre/hackathon-app.git`
2. Dans VS Code : **File → Open Folder**, choisir `hackathon-app`, puis cliquer sur **Reopen in Container** (ou `F1` → **Dev Containers: Reopen in Container**).
   Le premier lancement prend quelques minutes : il construit le conteneur, démarre PostgreSQL, crée `.env.local` depuis `.env.example` et lance `npm ci`.
3. Dans le terminal de VS Code (il s'ouvre dans le conteneur) :
   ```bash
   npm run dev
   ```
4. Ouvrir http://localhost:3000 : les tendances s'affichent avec leur score. Cliquer sur **Analyser avec l'IA** sur une tendance.

### 3. Vérifier

| Vérification     | Commande (terminal du conteneur)                                      | Résultat attendu                          |
| ---------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| API + base       | `curl localhost:3000/api/health`                                      | `"status":"ok"` et la version PostgreSQL  |
| Données          | `psql postgres://app:app@db:5432/app -c "SELECT id, nom FROM trends"` | 13 tendances                              |
| IA               | `curl -X POST localhost:3000/api/trends/dubai-chocolate/analyse`      | une `recommandation` et une `explication` |
| Analyses gardées | `psql postgres://app:app@db:5432/app -c "SELECT * FROM analyses"`     | une ligne par analyse                     |

### En cas de problème

- **`Fournisseur d'IA indisponible`** : Ollama n'est pas lancé sur votre machine, ou le modèle n'est pas téléchargé (`ollama pull llama3.2:1b`).
- **`base injoignable`** : le service `db` ne tourne pas. Dans VS Code : `F1` → **Dev Containers: Rebuild Container**.
- **Rejouer le schéma ou les données de test** : supprimer le dossier `db/data/`, puis **Rebuild Container**.
- **Utiliser Claude au lieu d'Ollama** : modifier les trois lignes `AI_` de `.env.local` (exemple commenté dans `.env.example`), puis relancer `npm run dev`.

## Lancer toute l'application (démo)

Depuis un terminal **de votre machine** (PowerShell, pas le dev container), à la racine du projet :

```bash
docker compose up --build
```

Puis ouvrir http://localhost:8080. Ollama doit tourner sur la machine pour que l'IA rédige ; sinon l'application affiche des textes calculés.

- Arrêter : `Ctrl + C`, puis `docker compose down`
- Repartir des données de test (obligatoire après un changement de `db/init/`) : `docker compose down`, supprimer le dossier `db/data/`, puis `docker compose up --build`
- Démo avec Claude : créer un fichier `.env` à la racine avec `AI_BASE_URL=https://api.anthropic.com/v1`, `AI_MODEL=claude-haiku-5-5` et `AI_API_KEY=votre-cle`

### Parcours de démo (cas yuzu)

1. **Fil du jour** (`/`) : le yuzu gagne 6 points, le Dubai Chocolate retombe.
2. **Recherche client** : taper « boisson aux agrumes pour l'Asie », le yuzu sort en premier.
3. **Fiche yuzu**, onglet Décision : score 82/100 et ses 3 critères, phrase de l'IA, arôme yuzu au catalogue (1 mois), alternatives sudachi, bergamote, clémentine.
4. **Onglet Signaux** : courbe sur 5 ans et sources.
5. **Proposer la piste** : note modifiable, Copier, Envoyer (simulé).

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
lib/            accès base (db.ts), score (trends.ts), appel IA (ia.ts)
db/init/        schéma et données de test PostgreSQL
docs/adr/       décisions d'architecture
openapi.yaml    contrat de l'API
AGENTS.md       consignes pour l'assistant de code
```

## Travailler à plusieurs

- Branches : `main` (démontrable), `develop` (intégration, par défaut), `feature/*`, `hotfix/*`.
- Chaque tâche part d'un ticket du tableau GitHub Projects, puis d'une branche `feature/…` et d'une pull request vers `develop` contenant `Closes #numéro`.
- `main` et `develop` sont protégées : pull request, une approbation et le check `qualite` vert obligatoires.
- Committer **depuis le dev container** : le hook `pre-commit` (ESLint + Prettier) y est installé.

## Équipe

| Nom       | Rôle      |
| --------- | --------- |
| Alexandre | Tech-lead |
| …         | Data      |
| …         | Product   |
