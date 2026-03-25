-- ================================================================
--  Les Jus Naturels Ben's — Schéma Supabase
--  Exécuter ce fichier dans l'éditeur SQL de Supabase :
--  https://supabase.com/dashboard/project/<ton-projet>/sql
-- ================================================================

-- ─── EXTENSION UUID (déjà activée par défaut sur Supabase) ───
-- create extension if not exists "uuid-ossp";


-- ════════════════════════════════════════════════════════════════
--  TABLE : products
-- ════════════════════════════════════════════════════════════════
create table if not exists products (
  id          text primary key,
  name        text          not null,
  category    text          not null default 'Jus',
  price       numeric(10,2) not null,
  formats     text[]        not null default '{}',
  "desc"      text                   default '',
  available   boolean                default true,
  tag         text                   default '',
  img         text                   default '🍹',   -- emoji OU URL Supabase Storage
  color       text                   default '#c44536',
  characteristics text[]             default '{}',
  ingredients     text[]             default '{}',
  created_at  timestamptz            default now()
);

-- Désactiver RLS pour l'instant (réactiver avec des politiques après ajout de Supabase Auth)
alter table products disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : reviews
-- ════════════════════════════════════════════════════════════════
create table if not exists reviews (
  id          text primary key,
  name        text    not null,
  text        text    not null,
  rating      integer not null check (rating between 1 and 5),
  approved    boolean default false,
  date        date    not null,
  created_at  timestamptz default now()
);

alter table reviews disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : blogs
-- ════════════════════════════════════════════════════════════════
create table if not exists blogs (
  id          text primary key,
  title       text    not null,
  category    text    not null default 'Santé',
  content     text    not null,
  img         text    default '',
  tags        text[]  default '{}',
  content_type text   default 'article',
  published   boolean default false,
  date        date    not null,
  created_at  timestamptz default now()
);

alter table blogs disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : locations  (points de vente)
-- ════════════════════════════════════════════════════════════════
create table if not exists locations (
  id          text primary key,
  name        text    not null,
  address     text    not null,
  type        text    not null default 'Épicerie',
  region      text    default 'Montreal',
  active      boolean default true,
  phone       text,
  hours       text,
  neighborhood text,
  coords      double precision[] default '{}',
  created_at  timestamptz default now()
);

alter table locations disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : subscribers  (abonnés newsletter)
-- ════════════════════════════════════════════════════════════════
create table if not exists subscribers (
  id          text primary key,
  email       text unique not null,
  date        date        not null,
  active      boolean     default true,
  created_at  timestamptz default now()
);

alter table subscribers disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : activity  (journal d'activité admin)
-- ════════════════════════════════════════════════════════════════
create table if not exists activity (
  id          text primary key,
  action      text        not null,
  detail      text                 default '',
  date        timestamptz not null,
  type        text                 default 'info',
  created_at  timestamptz default now()
);

alter table activity disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : messages  (formulaire de contact)
-- ════════════════════════════════════════════════════════════════
create table if not exists messages (
  id          text primary key,
  name        text        not null,
  email       text        not null,
  message     text        not null,
  read        boolean     default false,
  responded   boolean     default false,
  date        timestamptz not null,
  created_at  timestamptz default now()
);

alter table messages disable row level security;


-- ════════════════════════════════════════════════════════════════
--  TABLE : settings  (paramètres de l'entreprise — 1 seule ligne)
-- ════════════════════════════════════════════════════════════════
create table if not exists settings (
  id   integer primary key default 1,
  data jsonb   not null    default '{}'::jsonb
);

alter table settings disable row level security;


-- ════════════════════════════════════════════════════════════════
--  BUCKET SUPABASE STORAGE : product-images
--  À créer manuellement dans :
--  Storage → New bucket → Nom : "product-images" → Public : OUI
-- ════════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════════
--  DONNÉES INITIALES (seed)
-- ════════════════════════════════════════════════════════════════
-- Exécuter supabase/seed.sql après ce fichier.

-- Ingredients table for public page + admin CRUD
create table if not exists ingredients (
  id          text primary key,
  name        text not null,
  image       text not null default '',
  benefits    text[] not null default '{}',
  note        text not null default '',
  active      boolean default true,
  created_at  timestamptz default now()
);

alter table ingredients disable row level security;

-- ════════════════════════════════════════════════════════════════
--  TABLES : settings dynamiques
-- ════════════════════════════════════════════════════════════════
create table if not exists product_settings (
  id              text primary key,
  categories      text[] not null default '{}',
  formats         text[] not null default '{}',
  tags            text[] not null default '{}',
  characteristics jsonb  not null default '[]',
  colors          text[] not null default '{}',
  created_at      timestamptz default now()
);

alter table product_settings disable row level security;

create table if not exists blog_settings (
  id            text primary key,
  categories    text[] not null default '{}',
  content_types text[] not null default '{}',
  created_at    timestamptz default now()
);

alter table blog_settings disable row level security;

create table if not exists event_settings (
  id         text primary key,
  types      text[] not null default '{}',
  created_at timestamptz default now()
);

alter table event_settings disable row level security;

create table if not exists location_settings (
  id         text primary key,
  types      text[] not null default '{}',
  regions    text[] not null default '{}',
  created_at timestamptz default now()
);

alter table location_settings disable row level security;
