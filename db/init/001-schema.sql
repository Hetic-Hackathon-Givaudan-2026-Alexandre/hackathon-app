-- Tendances suivies par l'outil (données simulées pour le prototype)
CREATE TABLE trends (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  metier TEXT NOT NULL CHECK (metier IN ('taste', 'fragrance', 'beauty')),
  categories TEXT[] NOT NULL,
  description TEXT NOT NULL,
  -- Pays où la tendance monte (codes ISO 3166-1 alpha-2), le premier est le pays d'origine
  pays TEXT[] NOT NULL,
  emoji TEXT NOT NULL,
  -- Notes gustatives ou olfactives, utilisées pour rapprocher la tendance du catalogue
  notes TEXT[] NOT NULL,
  -- Score de durabilité et ses 3 critères, sur 100 (calculés par l'équipe Data)
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  score_veille INTEGER CHECK (score_veille BETWEEN 0 AND 100),
  evolution INTEGER NOT NULL CHECK (evolution BETWEEN 0 AND 100),
  recurrence INTEGER NOT NULL CHECK (recurrence BETWEEN 0 AND 100),
  diffusion INTEGER NOT NULL CHECK (diffusion BETWEEN 0 AND 100),
  -- Intérêt de recherche mensuel sur 5 ans (indice 0 à 100, de déc. 2021 à nov. 2026)
  courbe INTEGER[] NOT NULL,
  -- Arôme du catalogue qui correspond déjà à la tendance (NULL : à créer)
  arome_ref TEXT,
  simule BOOLEAN NOT NULL DEFAULT true
);

-- Catalogue d'arômes Givaudan (simulé : les vraies références sont confidentielles)
CREATE TABLE aromes (
  ref TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  metier TEXT NOT NULL CHECK (metier IN ('taste', 'fragrance', 'beauty')),
  notes TEXT[] NOT NULL,
  description TEXT NOT NULL,
  disponibilite TEXT NOT NULL CHECK (disponibilite IN ('disponible', 'tendue', 'rare')),
  cout TEXT NOT NULL CHECK (cout IN ('stable', 'hausse', 'baisse')),
  recolte TEXT NOT NULL,
  risque TEXT NOT NULL
);

ALTER TABLE trends
  ADD CONSTRAINT trends_arome_fk FOREIGN KEY (arome_ref) REFERENCES aromes (ref);

-- Explications produites par l'IA, conservées pour comparer les réponses
CREATE TABLE analyses (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trend_id TEXT NOT NULL REFERENCES trends (id),
  recommandation TEXT NOT NULL CHECK (recommandation IN ('suivre', 'attendre', 'ignorer')),
  explication TEXT NOT NULL,
  modele TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
