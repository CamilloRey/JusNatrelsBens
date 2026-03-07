import type { Product }    from '@/features/products/types/product.types';
import type { Review }     from '@/features/reviews/types/review.types';
import type { BlogPost }   from '@/features/blog/types/blog.types';
import type { Location }   from '@/features/locations/types/location.types';
import type { Subscriber } from '@/features/newsletter/types/subscriber.types';
import type { Message }    from '@/features/contact/types/message.types';
import type { Activity }   from '@/features/dashboard/types/dashboard.types';
import type { Settings }   from '@/features/auth/types/auth.types';
import type { Event }         from '@/features/events/types/event.types';
import type { StockMovement } from '@/features/stock/types/stock.types';
import type { Transaction }   from '@/features/finance/types/finance.types';

export const SEED_PRODUCTS: Product[] = [
  { id: 'p1',  name: 'Hibiscus Gingembre',           category: 'Tisanes', price: 8.99,  formats: ['250ml','354ml','1L'], desc: "Alliance exquise de l'hibiscus et du gingembre piquant.", available: true, tag: 'Populaire', img: '🌺', color: '#c44536' },
  { id: 'p2',  name: 'Hibiscus Fraises',             category: 'Jus',     price: 9.49,  formats: ['250ml','1L'],         desc: "Fusion rafraîchissante de fleurs d'hibiscus et fraises fraîches.", available: true, tag: 'Nouveau',   img: '🍓', color: '#e63946' },
  { id: 'p3',  name: 'Hibiscus Fraises Sans Sucre',  category: 'Jus',     price: 9.49,  formats: ['250ml','354ml','1L'], desc: 'Toute la saveur sans sucre ajouté.', available: true, tag: '', img: '🍓', color: '#d62839' },
  { id: 'p4',  name: 'Gingembre Citron Sucré',       category: 'Jus',     price: 7.99,  formats: ['250ml','1L'],         desc: 'Piquant et acidulé, parfait pour chaque moment.', available: true, tag: '', img: '🍋', color: '#f4a261' },
  { id: 'p5',  name: 'Gingembre Citron Sans Sucre',  category: 'Jus',     price: 7.99,  formats: ['250ml','1L'],         desc: 'Bienfaits du gingembre et citron, zéro sucre ajouté.', available: true, tag: 'Populaire', img: '🍋', color: '#e9c46a' },
  { id: 'p6',  name: "Jus d'Ananas",                 category: 'Jus',     price: 8.49,  formats: ['250ml','354ml','1L'], desc: "Explosion tropicale de saveur d'ananas frais.", available: true, tag: '', img: '🍍', color: '#f4a261' },
  { id: 'p7',  name: 'Ananas Sucré',                 category: 'Jus',     price: 8.49,  formats: ['250ml','1L'],         desc: "La douceur tropicale de l'ananas.", available: true, tag: '', img: '🍍', color: '#e9c46a' },
  { id: 'p8',  name: 'Ananas Passion',               category: 'Jus',     price: 9.99,  formats: ['250ml','354ml','1L'], desc: 'Mélange exotique ananas et fruit de la passion.', available: true, tag: 'Nouveau', img: '🥭', color: '#e76f51' },
  { id: 'p9',  name: 'Jus de Bleuets',               category: 'Jus',     price: 10.99, formats: ['1L'],                 desc: 'Source de fibres, riche en vitamine C et antioxydants.', available: true, tag: '', img: '🫐', color: '#457b9d' },
  { id: 'p10', name: 'Jus de Fraises',               category: 'Jus',     price: 8.99,  formats: ['250ml','1L'],         desc: 'Délicieux jus de fraises fraîches du Québec.', available: true, tag: '', img: '🍓', color: '#e63946' },
  { id: 'p11', name: 'Gingembre Bio',                category: 'Tisanes', price: 9.99,  formats: ['1L'],                 desc: 'Source de potassium, propriétés antibactériennes et antivirales.', available: true, tag: 'Populaire', img: '🫚', color: '#bc6c25' },
];

export const SEED_REVIEWS: Review[] = [
  { id: 'r1', name: 'Clarice Turner',  text: "J'adore absolument ces jus ! Le jus d'hibiscus est mon préféré – rafraîchissant et délicieux.", rating: 5, approved: true,  date: '2024-11-15' },
  { id: 'r2', name: 'Brian Moten',     text: "Le jus d'ananas a le goût du fruit frais. Sans sucre ajouté ni conservateurs. Un vrai régal !", rating: 5, approved: true,  date: '2024-12-03' },
  { id: 'r3', name: 'Jeanne Tremblay', text: "Je bois 1 litre de tisane d'hibiscus à tous les jours. Elle m'apaise beaucoup !", rating: 5, approved: true,  date: '2025-01-10' },
  { id: 'r4', name: 'Marc Dubois',     text: "Le gingembre citron est incroyable. Parfait pour l'hiver québécois.", rating: 4, approved: false, date: '2025-02-20' },
];

export const SEED_BLOGS: BlogPost[] = [
  { id: 'b1', title: "Les bienfaits de l'hibiscus pour la santé", category: 'Santé',    content: "L'hibiscus est reconnu pour ses propriétés antioxydantes exceptionnelles. Riche en vitamine C, cette fleur aide à renforcer le système immunitaire et à réguler la pression artérielle.", published: true,  date: '2025-01-15' },
  { id: 'b2', title: 'Comment préparons-nous nos jus artisanaux',  category: 'Recettes', content: 'Nos jus sont préparés selon des méthodes artisanales qui préservent la fraîcheur, la saveur et l\'intégrité nutritionnelle des ingrédients. Chaque fruit est soigneusement sélectionné à maturité.', published: true,  date: '2025-02-01' },
  { id: 'b3', title: 'Le gingembre : un allié santé au quotidien', category: 'Santé',    content: 'Le gingembre possède des propriétés antibactériennes, antivirales et antifongiques. Idéal pour lutter contre les infections respiratoires.', published: false, date: '2025-03-01' },
];

export const SEED_LOCATIONS: Location[] = [
  { id: 'l1', name: 'Marché Jean-Talon',      address: '7070 Henri Julien, Montréal', type: 'Marché',   active: true },
  { id: 'l2', name: 'Épicerie Afro-Antillaise',address: '3456 Boul. Décarie, Montréal', type: 'Épicerie', active: true },
  { id: 'l3', name: 'Marché Atwater',          address: '138 Atwater, Montréal',      type: 'Marché',   active: true },
];

export const SEED_SUBSCRIBERS: Subscriber[] = [
  { id: 's1', email: 'marie@example.com',  date: '2025-01-10', active: true  },
  { id: 's2', email: 'pierre@example.com', date: '2025-01-22', active: true  },
  { id: 's3', email: 'sophie@example.com', date: '2025-02-05', active: true  },
  { id: 's4', email: 'jean@example.com',   date: '2025-02-14', active: false },
  { id: 's5', email: 'amelie@example.com', date: '2025-03-01', active: true  },
];

export const SEED_SETTINGS: Settings = {
  businessName: "Les Jus Naturels Ben's",
  email:        'info@lesjusnaturelsbens.com',
  phone:        '(514) 555-0123',
  address:      'Montréal, Québec, Canada',
  description:  'Des jus naturels et exotiques faits maison, inspirés des traditions Africaines.',
  facebook:     'https://facebook.com/lesjusnaturelsbens',
  instagram:    'https://instagram.com/lesjusnaturelsbens',
  tiktok:       '',
  website:      'https://lesjusnaturelsbens.com',
  password:     'bens2025',
  heroTitle:    'Savourez le plaisir des jus naturels',
  heroSubtitle: "Bienvenue dans l'univers des boissons naturelles inspirées des traditions Africaines.",
  currency:     'CAD',
  taxRate:      14.975,
  deliveryNote: 'Livraison disponible dans la grande région de Montréal.',
};

export const SEED_ACTIVITY: Activity[] = [
  { id: 'a1', action: 'Connexion admin',       detail: 'Première connexion au panneau',             date: '2025-03-01T10:00:00', type: 'auth'     },
  { id: 'a2', action: 'Produit ajouté',        detail: 'Ananas Passion ajouté au catalogue',        date: '2025-03-02T14:30:00', type: 'product'  },
  { id: 'a3', action: 'Avis approuvé',         detail: 'Avis de Jeanne Tremblay approuvé',          date: '2025-03-03T09:15:00', type: 'review'   },
  { id: 'a4', action: 'Article publié',        detail: 'Le gingembre : un allié santé au quotidien',date: '2025-03-04T16:45:00', type: 'blog'     },
  { id: 'a5', action: 'Point de vente ajouté', detail: 'Marché Atwater ajouté',                     date: '2025-03-05T11:20:00', type: 'location' },
];

export const SEED_EVENTS: Event[] = [
  { id: 'ev1', title: 'Marché Jean-Talon — Printemps', description: 'Venez nous retrouver au marché Jean-Talon pour déguster nos jus artisanaux et repartir avec vos favoris !', date: '2026-05-10', time: '09h00 - 15h00', location: 'Marché Jean-Talon', address: '7070 Henri Julien, Montréal', type: 'Marché', active: true },
  { id: 'ev2', title: 'Festival des Saveurs Africaines', description: 'Grande fête culinaire africaine à Montréal. Retrouvez-nous avec toute notre gamme de jus naturels et exotiques.', date: '2026-06-21', time: '11h00 - 20h00', location: 'Parc Lafontaine', address: '3933 Av. du Parc-La Fontaine, Montréal', type: 'Festival', active: true },
  { id: 'ev3', title: 'Dégustation — Épicerie Afro-Antillaise', description: 'Séance de dégustation gratuite de nos nouveaux jus. Rencontrez la fondatrice et découvrez nos secrets de fabrication.', date: '2026-04-12', time: '13h00 - 16h00', location: 'Épicerie Afro-Antillaise', address: '3456 Boul. Décarie, Montréal', type: 'Dégustation', active: true },
];

export const SEED_STOCK: StockMovement[] = [
  { id: 'st1', productId: 'p1', productName: 'Hibiscus Gingembre',          type: 'entree', quantity: 48, unit: 'bouteilles', location: 'Entrepôt',          note: 'Production du 2025-03-01', date: '2025-03-01T10:00:00' },
  { id: 'st2', productId: 'p2', productName: 'Hibiscus Fraises',            type: 'entree', quantity: 36, unit: 'bouteilles', location: 'Entrepôt',          note: 'Production du 2025-03-01', date: '2025-03-01T10:30:00' },
  { id: 'st3', productId: 'p1', productName: 'Hibiscus Gingembre',          type: 'sortie', quantity: 18, unit: 'bouteilles', location: 'Marché Jean-Talon', note: 'Marché samedi 08/03',      date: '2025-03-08T09:00:00' },
  { id: 'st4', productId: 'p2', productName: 'Hibiscus Fraises',            type: 'sortie', quantity: 12, unit: 'bouteilles', location: 'Marché Jean-Talon', note: 'Marché samedi 08/03',      date: '2025-03-08T09:00:00' },
  { id: 'st5', productId: 'p5', productName: 'Gingembre Citron Sans Sucre', type: 'entree', quantity: 24, unit: 'bouteilles', location: 'Entrepôt',          note: 'Production du 2025-03-05', date: '2025-03-05T14:00:00' },
  { id: 'st6', productId: 'p5', productName: 'Gingembre Citron Sans Sucre', type: 'sortie', quantity: 8,  unit: 'bouteilles', location: 'Épicerie Afro-Antillaise', note: 'Livraison épicerie', date: '2025-03-10T11:00:00' },
];

export const SEED_FINANCE: Transaction[] = [
  { id: 'fi1', type: 'revenu',  amount: 342.50, category: 'Vente marché',   description: 'Marché Jean-Talon — samedi 08/03',     date: '2025-03-08', location: 'Marché Jean-Talon' },
  { id: 'fi2', type: 'revenu',  amount: 156.00, category: 'Vente épicerie', description: 'Livraison Épicerie Afro-Antillaise',    date: '2025-03-10', location: 'Épicerie Afro-Antillaise' },
  { id: 'fi3', type: 'depense', amount: 89.40,  category: 'Ingrédients',    description: 'Fleurs d\'hibiscus séchées (2 kg)',     date: '2025-03-02', location: 'Fournisseur Tropicana' },
  { id: 'fi4', type: 'depense', amount: 45.00,  category: 'Emballage',      description: 'Bouteilles 250ml (lot de 100)',         date: '2025-03-03', location: 'Verreault & Cie' },
  { id: 'fi5', type: 'depense', amount: 15.00,  category: 'Transport',      description: 'Déplacement Marché Jean-Talon',         date: '2025-03-08', location: '' },
  { id: 'fi6', type: 'revenu',  amount: 278.00, category: 'Vente marché',   description: 'Marché Atwater — dimanche 09/03',       date: '2025-03-09', location: 'Marché Atwater' },
  { id: 'fi7', type: 'depense', amount: 32.00,  category: 'Marketing',      description: 'Impression de flyers A5 (200 ex.)',     date: '2025-03-05', location: 'Copie Express' },
];

export const SEED_MESSAGES: Message[] = [
  { id: 'm1', name: 'Marie Lavoie',  email: 'marie.lavoie@gmail.com', message: 'Bonjour, où puis-je acheter vos jus dans le quartier Rosemont ?', read: false, responded: false, date: '2025-03-04T09:30:00' },
  { id: 'm2', name: 'Paul Tremblay', email: 'paul.t@hotmail.com',     message: "J'aimerais savoir si vous faites des collaborations avec des restaurants.", read: false, responded: false, date: '2025-03-05T14:15:00' },
  { id: 'm3', name: 'Nadia Benali',  email: 'nadia.b@outlook.com',    message: "Avez-vous du jus de gingembre sans sucre en format 1L ?", read: false, responded: false, date: '2025-03-06T08:45:00' },
  { id: 'm4', name: 'Sophie Martin', email: 'sophie.martin@yahoo.com',message: 'Vos jus sont excellents ! Est-ce que vous livrez à Laval ?', read: true,  responded: true,  date: '2025-02-28T16:20:00' },
];
