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
insert into locations (id, name, address, type, region, active, neighborhood) values
  ('l1',  'Boucherie Marieville Inc',            '631 Rue Claude de rameau, MarieVille, QC J3M 1J7',         'Partenaire Local', 'Rive Sud', true, 'Marieville'),
  ('l2',  'Boucherie du cap',                     '3575 Ch. de Chambly, Longueuil, QC J4L 4L8',               'Partenaire Local', 'Rive Sud', true, 'Longueuil'),
  ('l3',  'Casier bleue',                         '1005 QC-112, Saint-Césaire, QC J0L 1T0',                   'Partenaire Local', 'Rive Sud', true, 'Saint-Césaire'),
  ('l4',  'Épicerie Africaine de la rive sud',    '265 Bd Sainte-Foy, Longueuil, QC J4J 1X1',                 'Épicerie',         'Rive Sud', true, 'Longueuil'),
  ('l5',  'Épicier du Centre-Ville (Marché Ami)', '1312 Rue des Cascades, Saint-Hyacinthe, QC J2S 4H4',       'Marché',           'Rive Sud', true, 'Saint-Hyacinthe'),
  ('l6',  'Ferme Guyon',                          '1001 Rue Patrick Farrar, Chambly, QC J3L 4N7',             'Partenaire Local', 'Rive Sud', true, 'Chambly'),
  ('l7',  'Garage Lafinesse',                     '3785 Taschereau Blvd, Saint-Hubert, Québec J4T 2G4',       'Partenaire Local', 'Rive Sud', true, 'Saint-Hubert'),
  ('l8',  'Kohinoor',                             '3805 boulevard Taschereau, Saint-Hubert, Québec J4T 2G4',  'Partenaire Local', 'Rive Sud', true, 'Saint-Hubert'),
  ('l9',  'Marché des délices du monde',          '1218 Rue du Pont, Marieville, QC J3M 1G2',                 'Marché',           'Rive Sud', true, 'Marieville'),
  ('l10', 'Marché HK',                            '899 Boulevard Curé-Poirier O, Longueuil, QC J4K 2C5',       'Marché',           'Rive Sud', true, 'Longueuil'),
  ('l11', 'Pâtisserie Brossard',                  '3250 Boul. de Rome, Brossard, QC J4Y 1V9',                 'Partenaire Local', 'Rive Sud', true, 'Brossard'),
  ('l12', 'Alexpress',                            '4105 Boul. Sir Wilfrid Laurier, Saint-Hubert, QC J3Y 3X3',  'Partenaire Local', 'Rive Sud', true, 'Saint-Hubert'),
  ('l13', 'Épicerie Africaine & Caribéenne Lovaf','395a Bd Cartier O, Laval, QC H7N 2K8',                     'Épicerie',         'Montreal', true, 'Laval'),
  ('l14', 'Le souk',                              '267 Rue Principale, Granby, QC J2G 2W1',                    'Partenaire Local', 'Montreal', true, 'Granby'),
  ('l15', 'Marche al-Radji',                      '2557 Rue Centre, Montréal, QC H3K 1J9',                    'Marché',           'Montreal', true, 'Montréal'),
  ('l16', 'Marché Ikase',                         '2040 Rue La pierre, Lasalle, QC H8N 1B1',                   'Marché',           'Montreal', true, 'Lasalle'),
  ('l17', 'Nourriture d''Afrique Montréal',       '9465 Rue Charles-de-La Tour, Montréal, QC H4N 1M5',         'Épicerie',         'Montreal', true, 'Montréal'),
  ('l18', 'Orange coco',                          '177 Rue Empire, Granby, QC J2G 3B3',                        'Partenaire Local', 'Montreal', true, 'Granby'),
  ('l19', 'Resto Flap Flap',                      '5808 Rue de Charleroi, Montréal-Nord, QC H1G 3B2',          'Restaurant',       'Montreal', true, 'Montréal-Nord'),
  ('l20', 'Marche Fleur du Soleil',               '5047 Rue de Charleroi, Montréal-Nord, QC H1G 2Z6',          'Marché',           'Montreal', true, 'Montréal-Nord')
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

-- ─── PARAMÈTRES PRODUITS / BLOG / ÉVÉNEMENTS / LOCATIONS ───
insert into product_settings (id, categories, formats, tags, characteristics, colors) values (
  'product-settings',
  ARRAY['Jus','Tisanes','Sirops','Poudres','Épices','Cosmétiques'],
  ARRAY['250ml','354ml','500ml','750ml','1L','2L'],
  ARRAY['Pressé à froid','100% Naturel','Bio','Boost Immunité','Sans sucre ajouté','Nouveau','Populaire','En promotion'],
  '[{"icon":"🌿","label":"Sans conservateurs"},{"icon":"🍃","label":"Sans sucre ajouté"},{"icon":"✓","label":"100% Naturel"},{"icon":"🌱","label":"Bio"},{"icon":"🇨🇦","label":"Produit du Québec"},{"icon":"🧊","label":"Pressé à froid"},{"icon":"🌾","label":"Sans gluten"},{"icon":"🐾","label":"Végan"},{"icon":"⚡","label":"Boost Énergie"},{"icon":"🫀","label":"Boost Immunité"}]'::jsonb,
  ARRAY['#c44536','#e07a20','#2b6a4f','#1b4d38','#7c3aed','#0284c7','#be185d','#d97706','#059669','#64748b']
) on conflict (id) do update set categories = excluded.categories, formats = excluded.formats, tags = excluded.tags, characteristics = excluded.characteristics, colors = excluded.colors;

insert into blog_settings (id, categories, content_types) values (
  'blog-settings',
  ARRAY['Sante','Recettes','Actualites','Conseils','Traditions','Nutrition'],
  ARRAY['article','recette']
) on conflict (id) do update set categories = excluded.categories, content_types = excluded.content_types;

insert into event_settings (id, types) values (
  'event-settings',
  ARRAY['Marche','Festival','Degustation','Atelier','Autre']
) on conflict (id) do update set types = excluded.types;

insert into location_settings (id, types, regions) values (
  'location-settings',
  ARRAY['Atelier Signature','Partenaire Local','Marché','Épicerie','Café','Boutique bio','Studio bien-être','Restaurant','En ligne','Autre'],
  ARRAY['Montreal','Rive Sud','Rive Nord']
) on conflict (id) do update set types = excluded.types, regions = excluded.regions;

-- Ingredients seed
insert into ingredients (id, name, image, benefits, note, active) values
  ('ing-1', 'Hibiscus',  'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1200&q=80', ARRAY['Riche en antioxydants','Peut aider a la circulation','Source naturelle de vitamine C'], 'Base florale traditionnelle de plusieurs jus.', true),
  ('ing-2', 'Gingembre', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80', ARRAY['Aide la digestion','Soutien immunitaire','Effet tonique naturel'], 'Donne une note epicee et vive.', true),
  ('ing-3', 'Citron',    'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=1200&q=80', ARRAY['Fraicheur naturelle','Vitamine C','Saveur acidulee equilibree'], 'Utilise pour equilibrer les melanges.', true),
  ('ing-4', 'Ananas',    'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?auto=format&fit=crop&w=1200&q=80', ARRAY['Saveur tropicale','Contient de la bromelaine','Apporte une douceur naturelle'], 'Parfait dans les recettes exotiques.', true),
  ('ing-5', 'Fraises',   'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80', ARRAY['Riches en antioxydants','Saveur fruitee','Faible en calories'], 'Ajoute une touche douce et coloree.', true)
on conflict (id) do update set
  name = excluded.name,
  image = excluded.image,
  benefits = excluded.benefits,
  note = excluded.note,
  active = excluded.active;
