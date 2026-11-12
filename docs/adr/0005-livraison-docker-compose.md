# 0005. Lancer toute l'application avec `docker compose up`

- **Statut :** acceptée
- **Date :** 2026-11-12
- **Décideurs :** Alexandre (tech-lead)

## Contexte

Pour m2, `docker compose up` doit lancer le site et la base sans autre commande. Avant, il fallait lancer `npm run dev` à la main dans le dev container.

## Options

- **`npm run dev` dans le service `dev`** : rien à ajouter, mais c'est le mode développement, lent et pas ce qu'on livrerait.
- **Un service `web` construit par un `Dockerfile`** : image de production, même Node que la CI. Premier build plus long.
- **Héberger sur Vercel** : lien public, mais la base et Ollama ne sont pas joignables.

## Décision

Service `web` construit par le `Dockerfile` (Next.js en mode `standalone`), sur http://localhost:8080. Il attend que `db` soit prête. Le dev container ne démarre que `dev` et `db`.

## Conséquences

- La démo se lance en une commande : `docker compose up --build`.
- Pour recharger les données de test, il faut supprimer `db/data/`.
- À revoir si le site doit être accessible hors de nos machines.
