# 0001. Construire le prototype en Next.js (TypeScript) dans un seul projet

- **Statut :** acceptée
- **Date :** 2026-11-09
- **Décideurs :** Alexandre (tech-lead), équipe

## Contexte

Le challenge Givaudan « Détecteur de tendances » demande un prototype qui montre comment l'outil détecte, note et priorise les tendances, puis une démo de 2 minutes. Le jalon m2 (vendredi 13 novembre) exige que `docker compose up` lance une tranche complète, de l'interface jusqu'aux données.

Contraintes :

- une semaine de développement, un seul développeur front/back dans l'équipe (les autres membres sont Data et Product) ;
- compétences de l'équipe : HTML/CSS, JavaScript, bases de React (formation MMI) ;
- le code est écrit avec l'aide de Claude Code, donc la pile doit être très répandue pour que l'assistant la maîtrise ;
- le dev container et la CI du cours tournent sur Node 24 (`node:24-trixie`).

## Options

### A. Outil no-code (Lovable ou Base44)

- Avantages : écrans obtenus en quelques heures.
- Inconvénients : code peu maîtrisé, hors du dépôt, impossible à faire passer par la CI et les pull requests ; pas de `docker compose up` pour m2.

### B. Front Vite/React + API Express séparée

- Avantages : séparation nette front/API, proche de l'exemple du cours.
- Inconvénients : deux projets, deux configurations et un proxy à maintenir pour un seul développeur.

### C. Next.js (App Router, TypeScript) + Tailwind CSS

- Avantages : pages et routes d'API dans un seul projet (`app/` et `app/api/`), un seul `npm run build` pour la CI, sortie `standalone` facile à mettre dans une image Docker ; framework React très documenté.
- Inconvénients : conventions propres à Next.js à apprendre (routes par dossiers, composants serveur).

## Décision

Option C : Next.js en TypeScript avec Tailwind CSS. Elle couvre front et API avec un seul projet et une seule chaîne de qualité (ESLint, Prettier, CI `qualite`), ce qui tient dans le délai avec un seul développeur. Les graphiques utiliseront Recharts.

Pour le prototype, les tendances sont lues dans `data/trends.json` (données simulées, champ `simule: true`). Aucune base de données n'est ajoutée tant que ce fichier suffit.

## Conséquences

- Positives : un dépôt, une commande de build, une image Docker pour m2.
- Négatives acceptées : apprentissage de Next.js ; pas de séparation physique front/API.
- Négatives acceptées : données simulées, à annoncer pendant la démo.
- À revoir si : l'équipe Data livre un service Python (notebook ou API) à appeler, ou si les données dépassent ce qu'un fichier JSON permet (alors ADR sur PostgreSQL).
