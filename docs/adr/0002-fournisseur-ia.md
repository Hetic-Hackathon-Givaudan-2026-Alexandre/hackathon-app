# 0002. Appeler l'IA via une interface compatible OpenAI : Ollama en dev, Claude pour la démo

- **Statut :** acceptée
- **Date :** 2026-11-10
- **Décideurs :** Alexandre (tech-lead), équipe Data

## Contexte

Un critère du challenge est la capacité à distinguer un buzz d'une tendance durable et à expliquer pourquoi une tendance mérite d'être suivie. Le score chiffré est calculé par le code (`lib/trends.ts` : croissance, convergence des sources, diffusion géographique). Il manque une explication rédigée, lisible par les équipes Givaudan (Food, Fragrance, Beauty).

Contraintes :

- budget d'école quasi nul, et chaque membre doit pouvoir lancer le projet sans carte bancaire (test du nouvel arrivant) ;
- appel depuis une route serveur : la clé ne doit jamais atteindre le navigateur ;
- RGPD : on n'envoie que des indicateurs agrégés, aucune donnée personnelle ;
- la démo finale doit produire des explications de qualité, en français.

## Options

### A. API Claude (Anthropic) seule

- Avantages : très bonne rédaction en français ; même fournisseur que l'outil de développement (Claude Code).
- Inconvénients : payante (crédits, carte bancaire) ; chaque développeur aurait besoin d'une clé.

### B. Ollama sur la machine (modèle `llama3.2:1b`)

- Avantages : gratuit, aucune donnée ne sort de la machine, recommandé par le cours pour le développement.
- Inconvénients : réponses modestes ; Ollama à installer sur chaque poste.

### C. API Gemini (offre gratuite)

- Avantages : gratuite sans carte bancaire.
- Inconvénients : quotas variables ; un fournisseur de plus à apprendre.

### D. Explications pré-générées

- Avantages : gratuit, sans risque réseau.
- Inconvénients : aucune IA en direct ; le barème exige un vrai appel.

## Décision

Le code parle une seule interface, l'API **compatible OpenAI** (`POST {AI_BASE_URL}/chat/completions`), dans `lib/ia.ts`. Le fournisseur se choisit par variables d'environnement (`AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY` dans `.env.local`), sans changer le code :

- **en développement : option B, Ollama**, valeur par défaut de `.env.example` ;
- **pour la démo finale : option A, Claude** (`https://api.anthropic.com/v1`, modèle `claude-haiku-5-5`), avec une seule clé détenue par le tech-lead.

La route `POST /api/trends/{id}/analyse` (contrat dans `openapi.yaml`) enregistre chaque réponse dans la table `analyses`.

## Conséquences

- Positives : gratuit pour toute l'équipe au quotidien ; qualité de Claude le jour de la démo ; changer de fournisseur = changer trois variables.
- Négatives acceptées : installer Ollama sur chaque poste ; réponses de qualité différente entre dev et démo.
- Négatives acceptées : la démo dépend du réseau ; en cas de panne, la route renvoie 503 et le score reste affiché.
- À revoir si : l'équipe ne peut pas acheter de crédits Claude avant jeudi (alors démo avec Ollama ou option C, dans un nouvel ADR).
