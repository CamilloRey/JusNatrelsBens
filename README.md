# Les Jus Naturels Ben's

Application web vitrine et d'administration pour **Les Jus Naturels Ben's** — jus artisanaux naturels inspirés des traditions africaines, fabriqués à Montréal.

---

## Aperçu

| Côté public | Panneau admin |
|---|---|
| Catalogue de produits | Gestion des produits (CRUD) |
| Détail produit + formats | Modération des avis clients |
| Avis clients | Gestion du blogue |
| Articles de blogue | Points de vente |
| Points de vente | Abonnés newsletter |
| Formulaire de contact | Boîte de messages |
| Newsletter | Journal d'activité |
| Page À propos | Paramètres de l'entreprise |

---

## Stack technique

| Couche | Technologie |
|---|---|
| UI | React 18, JSX, CSS-in-JS (styles inline) |
| Build | Vite 6 |
| Base de données | Supabase (PostgreSQL) |
| Stockage d'images | Supabase Storage |
| Polices | Google Fonts (Playfair Display, DM Sans) |
| Hébergement recommandé | Vercel / Netlify |

---

## Structure du projet

```
jus-naturels-bens/
├── les-jus-naturels-bens.jsx   # Application complète (composants React)
├── src/
│   ├── main.jsx                # Point d'entrée React
│   └── lib/
│       └── supabase.js         # Client Supabase + helpers loadData/saveData/uploadImage
├── supabase/
│   ├── schema.sql              # Schéma de la base de données (8 tables)
│   └── seed.sql                # Données initiales
├── index.html                  # HTML racine Vite
├── vite.config.js              # Configuration Vite
├── package.json
├── .env.example                # Variables d'environnement à copier
└── .gitignore
```

---

## Prérequis

- **Node.js** v18 ou supérieur
- Un compte **Supabase** (gratuit) — [supabase.com](https://supabase.com)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/CamilloRey/JusNatrelsBens.git
cd JusNatrelsBens
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir `.env` avec les valeurs de ton projet Supabase
(**Dashboard → Settings → API**) :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Configuration Supabase

### 4. Créer la base de données

Dans l'[éditeur SQL Supabase](https://supabase.com/dashboard/project/_/sql) :

1. Copie-colle et exécute `supabase/schema.sql`
2. Copie-colle et exécute `supabase/seed.sql`

### 5. Créer le bucket de stockage d'images

**Storage → New bucket**

| Champ | Valeur |
|---|---|
| Nom | `product-images` |
| Public | **OUI** |

---

## Lancer l'application

```bash
# Développement (avec hot-reload)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

L'application sera disponible sur `http://localhost:5173`.

---

## Accès au panneau admin

Depuis le site public, **clique 5 fois** sur le logo en bas de page pour ouvrir l'interface d'administration.

| Champ | Valeur par défaut |
|---|---|
| Mot de passe | `bens2025` |

> Changer le mot de passe dans **Admin → Paramètres → Sécurité**.

---

## Gestion des photos produits

L'application supporte deux formats pour les images produits :

- **Emoji** — icône rapide (ex. `🍹`)
- **URL** — lien direct vers une image hébergée
- **Upload** — téléversement direct vers Supabase Storage via l'admin

Pour ajouter une vraie photo :

1. Se connecter au panneau admin
2. **Produits → Modifier un produit**
3. Cliquer sur **"Choisir une photo"** ou coller une URL

---

## Base de données — Tables

| Table | Description |
|---|---|
| `products` | Catalogue des produits (jus, tisanes, épices, cosmétiques) |
| `reviews` | Avis clients avec modération |
| `blogs` | Articles de blogue avec publication |
| `locations` | Points de vente actifs |
| `subscribers` | Abonnés à la newsletter |
| `messages` | Messages du formulaire de contact |
| `activity` | Journal d'activité de l'admin |
| `settings` | Paramètres de l'entreprise (JSON, ligne unique) |

---

## Déploiement sur Vercel

```bash
# Build de production
npm run build
```

1. Importer le dépôt sur [vercel.com](https://vercel.com)
2. Ajouter les variables d'environnement dans **Settings → Environment Variables** :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Cliquer sur **Deploy**

---

## Sécurité — À faire avant la mise en production

- [ ] Activer **Row Level Security (RLS)** sur toutes les tables Supabase
- [ ] Définir des politiques RLS (lecture publique, écriture authentifiée)
- [ ] Migrer l'authentification admin vers **Supabase Auth**
- [ ] Changer le mot de passe admin par défaut
- [ ] Configurer un domaine personnalisé sur Vercel

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production (`dist/`) |
| `npm run preview` | Prévisualise le build local |

---

## Licence

Projet privé — © Les Jus Naturels Ben's. Tous droits réservés.
