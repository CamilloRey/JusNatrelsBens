# SKILL — Architecture & Conventions React + Supabase

> Template de référence basé sur le projet JusNatrelsBens.
> Réutilisable pour tout site vitrine / e-commerce avec panneau admin.

---

## Stack

| Technologie | Version | Rôle |
|---|---|---|
| React | 18 | UI |
| TypeScript | 5 | Typage statique |
| Vite | 6 | Build + dev server |
| React Router DOM | 6 | Routing SPA |
| Supabase JS | 2 | Base de données + Storage |
| i18next + react-i18next | 23/15 | Internationalisation FR/EN |
| Zod | 3 | Validation de formulaires |

---

## Structure de dossiers

```
src/
├── app/
│   ├── layouts/
│   │   ├── PublicLayout.tsx       # Nav + Footer autour des pages publiques
│   │   └── AdminLayout.tsx        # Sidebar + header autour des pages admin
│   ├── providers/
│   │   ├── AppProviders.tsx       # Composition de tous les providers
│   │   ├── AuthContext.tsx        # État d'authentification admin
│   │   └── DataContext.tsx        # Source de vérité globale (toutes les entités)
│   └── router/
│       ├── index.tsx              # Déclaration de toutes les routes
│       └── ProtectedRoute.tsx     # Garde pour les routes /admin/*
│
├── features/                      # Un dossier par domaine métier
│   └── <feature>/
│       ├── components/            # Composants propres à la feature
│       ├── pages/
│       │   ├── <Feature>Page.tsx       # Page publique
│       │   └── Admin<Feature>Page.tsx  # Page admin (CRUD)
│       ├── services/
│       │   └── <feature>.service.ts    # getAll() + save()
│       ├── types/
│       │   └── <feature>.types.ts      # Interface + FormState
│       └── validations/           # Schémas Zod (optionnel)
│
├── lib/
│   ├── api/
│   │   └── http-client.ts         # fetchAll, syncAll, syncSettings, uploadImage
│   ├── supabase/
│   │   ├── client.ts              # Instance Supabase (offline-safe)
│   │   └── types.ts               # Types générés depuis le schéma DB
│   └── i18n/
│       ├── index.ts               # Config i18next
│       └── locales/
│           ├── fr.ts
│           └── en.ts
│
├── shared/
│   ├── components/                # Composants transverses (ChatBot, LanguageSwitcher…)
│   ├── constants/
│   │   ├── colors.ts              # Palette de marque (objet C)
│   │   ├── styles.ts              # CSS-in-JS globaux (inputSt, labelSt, CSS.heading…)
│   │   ├── routes.ts              # Constantes de chemins (ROUTES.products…)
│   │   └── seed-data.ts           # Données de démo pour mode offline
│   ├── hooks/                     # Hooks partagés (useInView…)
│   ├── ui/                        # Primitives UI (Icon, Reveal, ProductImg…)
│   └── utils/
│       └── format.ts              # formatDate, formatPrice…
│
├── styles/
│   └── globals.css                # Reset + imports Google Fonts
│
└── main.tsx                       # ReactDOM.createRoot + AppProviders
```

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Page publique | `<Feature>Page.tsx` | `EventsPage.tsx` |
| Page admin | `Admin<Feature>Page.tsx` | `AdminEventsPage.tsx` |
| Service | `<feature>.service.ts` | `event.service.ts` |
| Types | `<feature>.types.ts` | `event.types.ts` |
| Contexte | `<Name>Context.tsx` | `DataContext.tsx` |
| Hook | `use<Name>.ts` | `useAuth.ts` |
| Composant | PascalCase | `ProductCard.tsx` |
| Import alias | `@/` → `src/` | `import { C } from '@/shared/constants/colors'` |

---

## Pattern de données (DataContext)

Toutes les entités vivent dans un seul contexte. Chaque entité expose :
- un tableau de données (ex: `products`)
- une fonction de mise à jour (ex: `updateProducts`)

```typescript
// DataContext.tsx — structure type
const DataContext = createContext<DataContextType>({...});

export function DataProvider({ children }) {
  const [products, setProducts] = useState<Product[]>([]);
  // ... (une paire état/setter par entité)

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      eventService.getAll(),
      // ...
    ]).then(([prods, evts, ...]) => {
      setProducts(prods);
      setEvents(evts);
      // ...
    });
  }, []);

  const updateProducts = (next: Product[]) => {
    setProducts(next);
    productService.save(next);
  };

  return (
    <DataContext.Provider value={{ products, updateProducts, events, updateEvents, ... }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
```

---

## Pattern de service

```typescript
// features/events/services/event.service.ts
import { fetchAll, syncAll } from '@/lib/api/http-client';
import type { Event } from '../types/event.types';
import { SEED_EVENTS } from '@/shared/constants/seed-data';

export const eventService = {
  async getAll(): Promise<Event[]> {
    return fetchAll<Event>('events', SEED_EVENTS);
  },
  async save(events: Event[]): Promise<void> {
    return syncAll<Event>('events', events);
  },
};
```

---

## Pattern de types

```typescript
// features/events/types/event.types.ts

export interface Event {
  id:          string;
  title:       string;
  description: string;
  date:        string;    // "YYYY-MM-DD"
  active:      boolean;
  img?:        string;    // URL Supabase Storage (optionnel)
}

// État du formulaire admin (toujours séparé de l'entité)
export interface EventFormState {
  title:       string;
  description: string;
  date:        string;
  active:      boolean;
  img:         string;    // chaîne vide par défaut
}
```

**Règle** : L'entité a des champs optionnels (`img?`). Le `FormState` les a tous requis (avec une valeur par défaut vide).

---

## Supabase — Configuration

### Variables d'environnement (`.env.local`)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Client (`src/lib/supabase/client.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Offline-safe : si les vars manquent, l'app tourne quand même
export const supabase = url && key ? createClient(url, key) : null;
```

### Helpers (`src/lib/api/http-client.ts`)
```typescript
// Lire une table (fallback sur seed si hors-ligne)
export async function fetchAll<T>(table: string, fallback: T[]): Promise<T[]>

// Écraser une table (DELETE all + INSERT all)
export async function syncAll<T>(table: string, items: T[]): Promise<void>

// Upsert les settings (singleton row id=1)
export async function syncSettings(settings: Settings): Promise<void>

// Upload un fichier dans le bucket 'product-images'
export async function uploadImage(file: File, folder: string): Promise<string | null>
```

### Tables Supabase à créer
```sql
-- Exemple pour "events"
create table events (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now()
);

-- Ou stocker chaque entité comme un tableau JSON dans une ligne :
-- table: "events" | colonnes: id text, data jsonb
```

> **Stratégie simple** : `syncAll` fait `DELETE` puis `INSERT` sur toute la table.
> Adapté aux petits volumes (< 1000 lignes). Pour de gros volumes, utiliser des upserts individuels.

### Storage — Bucket
- Nom : `product-images` (public)
- Dossiers utilisés : `products/`, `events/`, `blog/`, `banners/`
- `uploadImage(file, 'events')` → retourne l'URL publique ou `null`

---

## Routage

```typescript
// src/app/router/index.tsx
<Routes>
  {/* Public */}
  <Route element={<PublicLayout />}>
    <Route path="/"          element={<HomePage />} />
    <Route path="/products"  element={<ProductsPage />} />
    <Route path="/events"    element={<EventsPage />} />
    <Route path="/blog"      element={<BlogPage />} />
    <Route path="/contact"   element={<ContactPage />} />
    <Route path="/login"     element={<LoginPage />} />
  </Route>

  {/* Admin (protégé) */}
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminLayout />}>
      <Route path="/admin"             element={<DashboardPage />} />
      <Route path="/admin/products"    element={<AdminProductsPage />} />
      <Route path="/admin/events"      element={<AdminEventsPage />} />
      <Route path="/admin/settings"    element={<AdminSettingsPage />} />
      {/* ... */}
    </Route>
  </Route>
</Routes>
```

### Constantes de routes
```typescript
// src/shared/constants/routes.ts
export const ROUTES = {
  home:     '/',
  products: '/products',
  events:   '/events',
  admin:    '/admin',
} as const;
```

---

## Authentification admin

- Pas de JWT / token externe
- Mot de passe admin stocké dans `settings` (Supabase ou localStorage)
- `AuthContext` expose `isAuthenticated` + `login(password, adminPassword) → boolean`
- `ProtectedRoute` redirige vers `/login` si non authentifié
- Session perdue au refresh (stateless côté client)

```typescript
// Connexion
const ok = login(inputPassword, settings.password);
if (ok) navigate('/admin');
```

---

## Internationalisation (i18n)

### Config
```typescript
// src/lib/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: 'fr',
    detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'bens-lang' },
    interpolation: { escapeValue: false },
  });
```

### Usage dans les composants
```typescript
const { t } = useTranslation();
return <h1>{t('events.title')}</h1>;
```

### Structure des clés
```typescript
// locales/fr.ts
export const fr = {
  nav:    { home: 'Accueil', products: 'Produits', ... },
  home:   { hero: { title: '...', subtitle: '...' }, ... },
  events: { title: 'Événements', subtitle: '...', past: 'Passé', ... },
  // Une section par feature/page
};
```

---

## Styling (CSS-in-JS inline)

Aucun framework CSS. Tout est en `React.CSSProperties` inline + un fichier `globals.css` minimal.

### Palette de couleurs
```typescript
// src/shared/constants/colors.ts
export const C = {
  hibiscus: '#8b1a1a',  // couleur principale de marque
  red:      '#c44536',
  gold:     '#d4763b',
  cream:    '#faf6f0',  // fond de page
  dark:     '#1a0f0a',  // texte principal
  text:     '#2d1f15',
  muted:    '#8a7968',  // texte secondaire
  light:    '#f0e6d8',  // fond de cartes
  green:    '#2a6a4f',
  border:   '#e4d9cc',
} as const;
```

### Styles globaux réutilisables
```typescript
// src/shared/constants/styles.ts
export const CSS = {
  root:    { fontFamily: "'DM Sans', sans-serif", background: C.cream, color: C.dark },
  heading: { fontFamily: "'Playfair Display', serif" },
};

export const inputSt: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  borderRadius: 10, border: `1px solid ${C.border}`,
  fontSize: 14, outline: 'none',
};

export const labelSt: React.CSSProperties = {
  display: 'block', fontSize: 12,
  fontWeight: 600, color: C.muted, marginBottom: 6,
};
```

### Typographies Google Fonts
```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
```

---

## Pattern de page admin (CRUD)

Chaque page admin suit la même structure :

```tsx
export default function AdminEventsPage() {
  const { events, updateEvents, logActivity } = useData();
  const [editing, setEditing] = useState<string | null>(null);   // null = liste, 'new' = création, id = édition
  const [form, setForm]       = useState<EventFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  // Charger les données dans le formulaire
  const startEdit = (ev: Event) => {
    setEditing(ev.id);
    setForm({ title: ev.title, ..., img: ev.img ?? '' });
  };

  // Upload photo vers Supabase Storage
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, 'events');
    if (url) setForm(f => ({ ...f, img: url }));
    setUploading(false);
  };

  // Sauvegarder (création ou édition)
  const save = () => {
    if (editing === 'new') {
      const newItem = { ...form, id: 'e' + Date.now() };
      updateEvents([...events, newItem]);
      logActivity('Événement créé', newItem.title, 'event');
    } else {
      updateEvents(events.map(e => e.id === editing ? { ...e, ...form } : e));
    }
    setEditing(null);
  };

  // Supprimer
  const remove = (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    updateEvents(events.filter(e => e.id !== id));
  };

  // Affichage conditionnel : formulaire ou liste
  if (editing) return <FormView ... />;
  return <ListView ... />;
}
```

---

## Journal d'activité

`logActivity(action, detail, type)` — disponible via `useData()`.

```typescript
logActivity('Produit créé', product.title, 'product');
logActivity('Article modifié', blog.title,  'blog');
logActivity('Connexion',       'Admin',      'auth');
```

Types reconnus : `auth | product | review | blog | location | settings | newsletter | event`

---

## Composants partagés

| Composant | Usage |
|---|---|
| `<Icon type="edit" size={16} color={C.muted} />` | Icônes SVG inline (edit, trash, plus, x, check, shield, shop, settings, clock, star…) |
| `<Reveal>` | Animation d'entrée au scroll (IntersectionObserver) |
| `<ProductImg src={url} alt="..." />` | Image produit avec fallback |
| `<ChatBot />` | Bot FAQ keyword-based (FR/EN), toujours affiché en bas à droite |
| `<LanguageSwitcher />` | Toggle FR ↔ EN |

---

## Seed Data (mode offline)

```typescript
// src/shared/constants/seed-data.ts
export const SEED_PRODUCTS: Product[] = [ { id: 'p1', name: 'Jus Hibiscus', ... } ];
export const SEED_EVENTS:   Event[]   = [ { id: 'ev1', title: 'Marché Atwater', ... } ];
// ...
```

Si Supabase est inaccessible, `fetchAll(table, SEED_**)` retourne les seeds.

---

## Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

---

## Checklist — Nouveau projet depuis ce template

### 1. Setup
- [ ] `npm create vite@latest <nom> -- --template react-ts`
- [ ] Installer : `react-router-dom`, `@supabase/supabase-js`, `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `zod`
- [ ] Configurer alias `@/` dans `vite.config.ts` + `tsconfig.json`
- [ ] Créer `.env.local` avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### 2. Structure
- [ ] Copier l'arborescence `src/` (app, features, lib, shared, styles)
- [ ] Adapter `colors.ts` à la palette de marque
- [ ] Adapter `seed-data.ts` aux entités du projet

### 3. Supabase
- [ ] Créer les tables dans Supabase (une par entité)
- [ ] Créer le bucket Storage `product-images` (public)
- [ ] Activer RLS ou désactiver pour les tables nécessaires

### 4. i18n
- [ ] Renseigner `fr.ts` et `en.ts` pour toutes les sections
- [ ] Ajouter `<LanguageSwitcher />` dans la nav

### 5. Features
- [ ] Pour chaque entité : créer `types/`, `services/`, `pages/`
- [ ] Ajouter l'entité dans `DataContext` (état + setter + updateFn)
- [ ] Ajouter les routes dans `router/index.tsx`
- [ ] Ajouter le lien dans `AdminLayout` (sidebar)

### 6. Admin
- [ ] Configurer le mot de passe initial dans les `settings` seed
- [ ] Vérifier que `ProtectedRoute` redirige bien
- [ ] Ajouter `logActivity(...)` sur chaque action CRUD

### 7. Photos
- [ ] Le bucket `product-images` est le seul bucket nécessaire
- [ ] Utiliser `uploadImage(file, 'dossier')` dans tout formulaire avec photo
- [ ] Stocker l'URL retournée dans l'entité (`img?: string`)

---

## Commandes utiles

```bash
npm run dev          # Démarrage dev (http://localhost:5173)
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npx supabase login   # (optionnel) CLI Supabase
```
