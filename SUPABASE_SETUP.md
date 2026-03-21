# 🔐 Supabase Security Setup Guide

## Configuration Initiale

### 1️⃣ Créer un Projet Supabase
1. Aller à https://supabase.com/dashboard
2. Cliquer "New Project"
3. Sélectionner votre organisation
4. Nommer le projet (ex: "jusnaturels-bens")
5. Créer une password forte pour la DB
6. Sélectionner la région (ex: Montreal)
7. Cliquer "Create new project"

### 2️⃣ Récupérer les Credentials
1. Aller dans **Settings > API**
2. Copier:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`
3. Créer un fichier `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3️⃣ Appliquer les Migrations
1. Aller à **SQL Editor** dans Supabase
2. Copier le contenu de `/supabase/migrations/001_auth_and_orders.sql`
3. Coller dans l'éditeur SQL
4. Cliquer **Run**

✅ Les tables, policies RLS et indexes vont être créés automatiquement!

---

## 🔒 Architecture de Sécurité

### Tables Créées

| Table | Contenu | RLS | Notes |
|-------|---------|-----|-------|
| `auth.users` | Comptes Supabase | ✅ | Géré par Supabase |
| `user_roles` | Rôles (admin/customer) | ✅ | Détermine les permissions |
| `customers` | Profils clients | ✅ | Infos compte clients |
| `orders` | Commandes | ✅ | Données de ventes |
| `shopping_carts` | Paniers utilisateurs | ✅ | Persistant côté DB |
| `customer_addresses` | Adresses de livraison | ✅ | Historique adresses |
| `payment_methods` | Cartes de crédit | ✅ | Tokens sécurisés |
| `order_analytics` | Analytics commandes | ✅ | Pour rapports |

### Politiques RLS (Row Level Security)

```
👤 Clients:
  ├─ Voient UNIQUEMENT leurs données
  ├─ Lecture: profil, commandes, adresses
  ├─ Écriture: profil, adresses, panier
  └─ INTERDICTION: voir autres clients

👨‍💼 Admins:
  ├─ Voient TOUTES les données
  ├─ Peuvent modifier statuts commandes
  ├─ Accès aux analytics et rapports
  └─ Gestion des utilisateurs

🔒 Données Sensibles:
  └─ Payment tokens = chiffrés, jamais visibles aux clients
```

---

## 🚀 Flux d'Authentification

```
CLIENT SANS COMPTE (Guest)
    ↓
Ajoute articles au panier (localStorage)
    ↓
Clique "Checkout"
    ↓
Rempli email + adresse
    ↓
Commande créée SANS user_id (guest_email seulement)
    ↓
Confirmation par email
    ✅ Livraison possible!

─────────────────────────────────────────

CLIENT AVEC COMPTE
    ↓
Se connecte via /auth/login
    ↓
Créé profil client automatiquement
    ↓
Ajoute articles au panier
    ↓
Panier synchronisé avec DB
    ↓
Checkout accélérée (adresses sauvegardées)
    ↓
Commande liée à son compte
    ↓
Accès historique commandes
    ✅ + Points de fidélité (future feature)

─────────────────────────────────────────

ADMIN LOGIN
    ↓
Ouvre /auth/login
    ↓
Supabase vérifie email + password
    ↓
Contrôle si user_id a rôle 'admin'
    ↓
Redirige vers /admin/dashboard
    ↓
Accès complet aux données
    ✅ Peut gérer commandes
```

---

## 📱 Endpoints Utilisés

### Authentication
- `supabase.auth.signUp()` - Créer compte
- `supabase.auth.signInWithPassword()` - Login
- `supabase.auth.signOut()` - Logout
- `supabase.auth.getSession()` - Vérifier session

### Database
- `from('orders').select()` - Lire commandes
- `from('shopping_carts').upsert()` - Sauvegarder panier
- `from('customers').insert()` - Créer profil
- `from('user_roles').select()` - Vérifier si admin

---

## 🛡️ Sécurité Implémentée

✅ **Row Level Security (RLS)** - Les données sont isolées par utilisateur
✅ **JWT Tokens** - Sessions sécurisées
✅ **Password Hashing** - Supabase hash automatiquement
✅ **Email Verification** - Option disponible
✅ **MFA Ready** - À activer dans Supabase
✅ **HTTPS Only** - Chiffrement en transit
✅ **Rôles & Permissions** - Admin vs Customer
✅ **Audit Logs** - Traçabilité des actions

---

## 🔧 Configuration Admin

Pour donner l'accès admin à un utilisateur:

### Via Supabase Dashboard
1. Aller à **SQL Editor**
2. Exécuter:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@example.com';
```

### Via App Admin
1. Login avec compte existant
2. Aller à `/admin/settings` (future feature)
3. Chercher utilisateur
4. Cliquer "Make Admin"

---

## 📧 Email Configuration

Supabase envoie des emails automatiquement:
- ✉️ Confirmation d'inscription
- ✉️ Réinitialisation mot de passe
- ✉️ Changement email

À configurer dans **Auth > Email Templates**

---

## 🔄 Sync Between localStorage & Supabase

### Cart Sync Strategy
```javascript
// Quand utilisateur se connecte:
1. Charger localStorage cart (priorité)
2. Charger DB cart pour cet utilisateur
3. Merger les deux avec dernière date
4. Sauvegarder merged cart en DB
5. Garder localStorage aussi (offline)

// Quand panier change:
1. Mettre à jour localStorage (instant)
2. Si user connecté → sync avec DB après 1s (debounce)
3. Si offline → sauvegarder localement, sync plus tard
```

---

## 🚨 Gestion des Erreurs

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Invalid API key" | Credentials incorrectes | Vérifier `.env.local` |
| "JWT expired" | Session expirée | Login à nouveau |
| "RLS policy denied" | Pas de permission | Vérifier user_id |
| "CORS error" | Domain non autorisé | Ajouter dans Supabase settings |

---

## 📊 Monitoring

### Supabase Dashboard
1. **Auth > Users** - Voir tous les comptes
2. **Database > Logs** - Voir les queries
3. **Logs > Database** - Errors & warnings
4. **Logs > Realtime** - Connexions Realtime

---

## 🎯 Checklist Déploiement

- [ ] Variables d'env configurées
- [ ] Migrations appliquées
- [ ] RLS policies activées
- [ ] Auth settings configurés
- [ ] Email templates personnalisés
- [ ] Admin accounts créés
- [ ] Test login/signup
- [ ] Test guest checkout
- [ ] Test admin panel
- [ ] SSL/HTTPS activé
- [ ] CORS configuré
- [ ] Backups programmées

---

## 🆘 Troubleshooting

### Login ne fonctionne pas
```bash
# Vérifier dans console:
1. Ouvrir DevTools > Console
2. Chercher erreurs CORS ou 401
3. Vérifier email/password
4. Vérifier que user est confirmé (email)
```

### Données ne s'affichent pas
```bash
# Vérifier RLS:
1. Aller Supabase > SQL Editor
2. Exécuter: SELECT * FROM user_roles WHERE user_id = auth.uid();
3. Si vide: user n'a pas de rôle
4. Ajouter le rôle comme ci-dessus
```

### Panier ne sync pas
```bash
# Vérifier sync:
1. Ouvrir DevTools > Network
2. Chercher requête à shopping_carts
3. Vérifier response status (200 = OK, 403 = RLS denied)
4. Vérifier que user_id dans localStorage = auth.uid()
```

---

## 📚 Documentation
- Supabase: https://supabase.com/docs
- Auth: https://supabase.com/docs/guides/auth
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
