# 0003. Stocker les tendances et les analyses dans PostgreSQL

- **Statut :** acceptée (révise la partie « données » de l'ADR 0001)
- **Date :** 2026-11-10
- **Décideurs :** Alexandre (tech-lead), équipe Data

## Contexte

L'ADR 0001 lisait les tendances dans un fichier `data/trends.json`. Deux faits changent la situation :

- l'évaluation exige une chaîne complète front, API, PostgreSQL et appel à l'IA ;
- les réponses de l'IA doivent être conservées pour comparer les modèles (Ollama en dev, Claude en démo, voir ADR 0002), ce qu'un fichier JSON en lecture seule ne permet pas.

L'équipe Data doit aussi pouvoir interroger les données en SQL, compétence qu'elle maîtrise.

## Options

### A. Garder le fichier JSON

- Avantages : rien à installer.
- Inconvénients : pas d'écriture concurrente, pas de requêtes SQL pour la Data, critère d'évaluation non rempli.

### B. SQLite

- Avantages : un simple fichier, pas de conteneur.
- Inconvénients : écritures concurrentes limitées ; différent de la base utilisée par le cours et par la production.

### C. PostgreSQL 17 dans un service `db` de `compose.yaml`

- Avantages : même version pour toute l'équipe, schéma et données de test rejoués automatiquement depuis `db/init/`, types tableaux pratiques pour les sources et les pays.
- Inconvénients : un conteneur de plus à démarrer.

## Décision

Option C. Le schéma est dans `db/init/001-schema.sql` (tables `trends` et `analyses`), les données simulées dans `db/init/002-seed.sql`. L'application s'y connecte avec `pg` via `DATABASE_URL` (`lib/db.ts`). Le fichier `data/trends.json` est supprimé.

## Conséquences

- Positives : critère « chaîne complète » rempli ; historique des analyses ; la Data travaille en SQL (`psql` est installé dans le dev container).
- Négatives acceptées : `db/init/` n'est rejoué qu'au premier démarrage ; après un changement de schéma, il faut supprimer `db/data/` puis relancer le conteneur.
- À revoir si : les données réelles (API sociales, Google Trends) demandent une ingestion régulière (alors ADR sur un script d'import).
