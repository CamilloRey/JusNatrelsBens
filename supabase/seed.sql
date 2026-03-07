-- ================================================================
--  Les Jus Naturels Ben's — Données initiales (seed)
--  Exécuter APRÈS schema.sql
-- ================================================================

-- ─── PRODUITS ───
insert into products (id, name, category, price, formats, "desc", available, tag, img, color) values
  ('p1',  'Hibiscus Gingembre',              'Tisanes', 8.99,  ARRAY['250ml','354ml','1L'], 'Alliance exquise de l''hibiscus et du gingembre piquant.', true,  'Populaire', '🌺', '#c44536'),
  ('p2',  'Hibiscus Fraises',                'Jus',     9.49,  ARRAY['250ml','1L'],         'Fusion rafraîchissante de fleurs d''hibiscus et fraises fraîches.', true, 'Nouveau', '🍓', '#e63946'),
  ('p3',  'Hibiscus Fraises Sans Sucre',     'Jus',     9.49,  ARRAY['250ml','354ml','1L'], 'Toute la saveur sans sucre ajouté.',                       true,  '',          '🍓', '#d62839'),
  ('p4',  'Gingembre Citron Sucré',          'Jus',     7.99,  ARRAY['250ml','1L'],         'Piquant et acidulé, parfait pour chaque moment.',           true,  '',          '🍋', '#f4a261'),
  ('p5',  'Gingembre Citron Sans Sucre',     'Jus',     7.99,  ARRAY['250ml','1L'],         'Bienfaits du gingembre et citron, zéro sucre ajouté.',     true,  'Populaire', '🍋', '#e9c46a'),
  ('p6',  'Jus d''Ananas',                  'Jus',     8.49,  ARRAY['250ml','354ml','1L'], 'Explosion tropicale de saveur d''ananas frais.',             true,  '',          '🍍', '#f4a261'),
  ('p7',  'Ananas Sucré',                    'Jus',     8.49,  ARRAY['250ml','1L'],         'La douceur tropicale de l''ananas.',                        true,  '',          '🍍', '#e9c46a'),
  ('p8',  'Ananas Passion',                  'Jus',     9.99,  ARRAY['250ml','354ml','1L'], 'Mélange exotique ananas et fruit de la passion.',           true,  'Nouveau',   '🥭', '#e76f51'),
  ('p9',  'Jus de Bleuets',                  'Jus',     10.99, ARRAY['1L'],                 'Source de fibres, riche en vitamine C et antioxydants.',    true,  '',          '🫐', '#457b9d'),
  ('p10', 'Jus de Fraises',                  'Jus',     8.99,  ARRAY['250ml','1L'],         'Délicieux jus de fraises fraîches du Québec.',              true,  '',          '🍓', '#e63946'),
  ('p11', 'Gingembre Bio',                   'Tisanes', 9.99,  ARRAY['1L'],                 'Source de potassium, propriétés antibactériennes et antivirales.', true, 'Populaire', '🫚', '#bc6c25')
on conflict (id) do nothing;

-- ─── AVIS ───
insert into reviews (id, name, text, rating, approved, date) values
  ('r1', 'Clarice Turner',  'J''adore absolument ces jus ! Le jus d''hibiscus est mon préféré – rafraîchissant et délicieux.',                5, true,  '2024-11-15'),
  ('r2', 'Brian Moten',     'Le jus d''ananas a le goût du fruit frais. Sans sucre ajouté ni conservateurs. Un vrai régal !',                 5, true,  '2024-12-03'),
  ('r3', 'Jeanne Tremblay', 'Je bois 1 litre de tisane d''hibiscus à tous les jours. Elle m''apaise beaucoup !',                             5, true,  '2025-01-10'),
  ('r4', 'Marc Dubois',     'Le gingembre citron est incroyable. Parfait pour l''hiver québécois.',                                           4, false, '2025-02-20')
on conflict (id) do nothing;

-- ─── ARTICLES DE BLOGUE ───
insert into blogs (id, title, category, content, published, date) values
  ('b1', 'Les bienfaits de l''hibiscus pour la santé',       'Santé',    'L''hibiscus est reconnu pour ses propriétés antioxydantes exceptionnelles. Riche en vitamine C, cette fleur aide à renforcer le système immunitaire et à réguler la pression artérielle.', true,  '2025-01-15'),
  ('b2', 'Comment préparons-nous nos jus artisanaux',         'Recettes', 'Nos jus sont préparés selon des méthodes artisanales qui préservent la fraîcheur, la saveur et l''intégrité nutritionnelle des ingrédients. Chaque fruit est soigneusement sélectionné à maturité.', true, '2025-02-01'),
  ('b3', 'Le gingembre : un allié santé au quotidien',        'Santé',    'Le gingembre possède des propriétés antibactériennes, antivirales et antifongiques. Idéal pour lutter contre les infections respiratoires.', false, '2025-03-01')
on conflict (id) do nothing;

-- ─── POINTS DE VENTE ───
insert into locations (id, name, address, type, active) values
  ('l1', 'Marché Jean-Talon',       '7070 Henri Julien, Montréal',    'Marché',   true),
  ('l2', 'Épicerie Afro-Antillaise','3456 Boul. Décarie, Montréal',   'Épicerie', true),
  ('l3', 'Marché Atwater',          '138 Atwater, Montréal',          'Marché',   true)
on conflict (id) do nothing;

-- ─── ABONNÉS ───
insert into subscribers (id, email, date, active) values
  ('s1', 'marie@example.com',  '2025-01-10', true),
  ('s2', 'pierre@example.com', '2025-01-22', true),
  ('s3', 'sophie@example.com', '2025-02-05', true),
  ('s4', 'jean@example.com',   '2025-02-14', false),
  ('s5', 'amelie@example.com', '2025-03-01', true)
on conflict (id) do nothing;

-- ─── ACTIVITÉ ───
insert into activity (id, action, detail, date, type) values
  ('a1', 'Connexion admin',    'Première connexion au panneau',                    '2025-03-01T10:00:00Z', 'auth'),
  ('a2', 'Produit ajouté',     'Ananas Passion ajouté au catalogue',               '2025-03-02T14:30:00Z', 'product'),
  ('a3', 'Avis approuvé',      'Avis de Jeanne Tremblay approuvé',                 '2025-03-03T09:15:00Z', 'review'),
  ('a4', 'Article publié',     'Le gingembre : un allié santé au quotidien',       '2025-03-04T16:45:00Z', 'blog'),
  ('a5', 'Point de vente ajouté','Marché Atwater ajouté',                          '2025-03-05T11:20:00Z', 'location')
on conflict (id) do nothing;

-- ─── MESSAGES ───
insert into messages (id, name, email, message, read, responded, date) values
  ('m1', 'Marie Lavoie',   'marie.lavoie@gmail.com', 'Bonjour, où puis-je acheter vos jus dans le quartier Rosemont ?', false, false, '2025-03-04T09:30:00Z'),
  ('m2', 'Paul Tremblay',  'paul.t@hotmail.com',     'J''aimerais savoir si vous faites des collaborations avec des restaurants. Nous avons un petit bistro sur le Plateau.', false, false, '2025-03-05T14:15:00Z'),
  ('m3', 'Nadia Benali',   'nadia.b@outlook.com',    'Avez-vous du jus de gingembre sans sucre en format 1L ? Je n''en trouve plus au Marché Jean-Talon.', false, false, '2025-03-06T08:45:00Z'),
  ('m4', 'Sophie Martin',  'sophie.martin@yahoo.com','Vos jus sont excellents ! Est-ce que vous livrez à Laval ?', true, true, '2025-02-28T16:20:00Z')
on conflict (id) do nothing;

-- ─── PARAMÈTRES ───
insert into settings (id, data) values (1, '{
  "businessName": "Les Jus Naturels Ben''s",
  "email": "info@lesjusnaturelsbens.com",
  "phone": "(514) 555-0123",
  "address": "Montréal, Québec, Canada",
  "description": "Des jus naturels et exotiques faits maison, inspirés des traditions Africaines.",
  "facebook": "https://facebook.com/lesjusnaturelsbens",
  "instagram": "https://instagram.com/lesjusnaturelsbens",
  "tiktok": "",
  "website": "https://lesjusnaturelsbens.com",
  "password": "bens2025",
  "heroTitle": "Savourez le plaisir des jus naturels",
  "heroSubtitle": "Bienvenue dans l''univers des boissons naturelles inspirées des traditions Africaines.",
  "currency": "CAD",
  "taxRate": 14.975,
  "deliveryNote": "Livraison disponible dans la grande région de Montréal."
}'::jsonb)
on conflict (id) do update set data = excluded.data;
