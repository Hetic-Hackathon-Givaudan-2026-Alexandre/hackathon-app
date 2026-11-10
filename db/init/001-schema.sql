-- Tendances détectées (une ligne par tendance)
CREATE TABLE trends (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('food', 'fragrance', 'beauty')),
  description TEXT NOT NULL,
  pays TEXT[] NOT NULL,
  sources TEXT[] NOT NULL,
  -- Volume de mentions par période, de la plus ancienne à la plus récente
  mentions INTEGER[] NOT NULL,
  -- true tant que la donnée est simulée (à annoncer pendant la démo)
  simule BOOLEAN NOT NULL DEFAULT true
);

-- Explications produites par l'IA, conservées pour comparer les réponses
CREATE TABLE analyses (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trend_id TEXT NOT NULL REFERENCES trends (id),
  recommandation TEXT NOT NULL CHECK (recommandation IN ('suivre', 'attendre', 'ignorer')),
  explication TEXT NOT NULL,
  modele TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
