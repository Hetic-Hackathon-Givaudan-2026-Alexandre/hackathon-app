# 0006. Toujours prévoir un plan B quand l'IA ne répond pas

- **Statut :** acceptée
- **Date :** 2026-11-12
- **Décideurs :** Alexandre (tech-lead), équipe Product

## Contexte

L'IA sert à trois endroits : la recherche client, la phrase qui explique le score et la proposition de produit. Le document Product demande une réponse en moins de 5 secondes, sans tendance ni arôme inventés. En test, le modèle gratuit `llama3.2:1b` met 5 à 20 secondes et sort souvent du format demandé.

## Options

- **Afficher la réponse de l'IA telle quelle** : simple, mais lent et risque d'inventer.
- **Vérifier la réponse et prévoir un repli** : deux chemins à coder, mais la démo marche toujours.
- **Pas d'IA du tout** : fiable, mais le challenge porte sur l'IA.

## Décision

On vérifie chaque réponse de l'IA (format JSON, identifiants qui existent en base) avec un délai maximal. Sinon, on affiche un résultat calculé par le code : recherche par mots-clés, phrase construite à partir des critères. Les arômes proposés viennent toujours du catalogue. L'écran indique si le texte vient de l'IA ou du calcul.

## Conséquences

- La démo fonctionne même sans IA ni réseau.
- Avec le petit modèle, la recherche utilise souvent les mots-clés.
- À revoir si on obtient une clé Claude pour la démo.
