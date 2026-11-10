-- Données simulées : toute l'équipe part des mêmes lignes
INSERT INTO trends (id, nom, categorie, description, pays, sources, mentions) VALUES
  ('dubai-chocolate', 'Dubai Chocolate', 'food',
   'Chocolat fourré pistache et kadayif, popularisé par une vidéo TikTok.',
   ARRAY['AE', 'FR', 'DE', 'US', 'GB'],
   ARRAY['tiktok', 'instagram', 'google-trends', 'presse'],
   ARRAY[120, 340, 1100, 4200, 9800, 15400]),
  ('fleur-de-sureau', 'Fleur de sureau en parfumerie', 'fragrance',
   'Note florale fraîche citée dans des avis et lancements de niche.',
   ARRAY['FR', 'GB'],
   ARRAY['reddit', 'brevets'],
   ARRAY[80, 95, 110, 130, 150, 175]),
  ('boisson-ube', 'Boissons à l''ube', 'food',
   'Igname violette des Philippines, en latte et en dessert.',
   ARRAY['PH', 'US'],
   ARRAY['tiktok'],
   ARRAY[50, 900, 3000, 1200, 400, 220]);
