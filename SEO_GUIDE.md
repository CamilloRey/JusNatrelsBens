# Guide SEO - Les Jus Naturels Ben's

## Améliorations SEO Implémentées

### ✅ 1. Meta Tags Dynamiques (React Helmet)
- **Fichier**: `src/shared/components/SEO.tsx`
- **Usage**: Ajouter sur chaque page
```tsx
<SEO 
  title="Page Title"
  description="Page description pour Google"
  url="https://lesjusnatuelsbens.com/page"
/>
```

**Pages configurées:**
- ✅ Accueil (HomePage)
- ✅ Notre Histoire (AboutPage)
- ✅ Nos Produits (ProductsPage)
- ✅ Blogue (BlogPage)
- ✅ Contact (ContactPage)

### ✅ 2. Structured Data (Schema.org JSON-LD)
- **Fichier**: `src/shared/components/StructuredData.tsx`
- **Usage**: Ajouter Organization schema à la page d'accueil
```tsx
<StructuredData type="Organization" data={organizationSchema} />
```

**Schémas disponibles:**
- `organizationSchema` - Pour les résultats Google
- `localBusinessSchema` - Pour Google Maps et Business
- Vous pouvez créer des schémas Product et Article

### ✅ 3. Sitemap XML
- **Fichier**: `public/sitemap.xml`
- **Utilité**: Aide Google à indexer toutes les pages
- **Fréquence mise à jour**: Changer les `<lastmod>` quand vous mettez à jour les pages

### ✅ 4. Robots.txt
- **Fichier**: `public/robots.txt`
- **Utilité**: Contrôle ce que les crawlers peuvent accéder
- **Bloque**: `/admin/` et `/login/`

### ✅ 5. Meta Tags Globaux
- **Fichier**: `index.html`
- **Inclus**:
  - Keywords
  - Author
  - Robots directive
  - Canonical URL
  - Open Graph tags

### ✅ 6. HelmetProvider
- **Fichier**: `src/app/providers/AppProviders.tsx`
- **Rôle**: Gère tous les meta tags dynamiquement

---

## À FAIRE AVANT LANCEMENT

### 1. Mettre à jour les URLs
Remplacer `lesjusnatuelsbens.com` par votre domaine réel dans:
- `src/shared/components/SEO.tsx` (défaut)
- Toutes les pages (title, description, url)
- `public/sitemap.xml`
- `public/robots.xml`
- `index.html`
- `src/shared/components/StructuredData.tsx`

### 2. Ajouter les coordonnées réelles
Dans `src/shared/components/StructuredData.tsx`:
```typescript
localBusinessSchema: {
  telephone: '+1-514-XXX-XXXX', // ← Ajouter votre téléphone
  address: {
    streetAddress: 'Montréal', // ← Ajouter adresse complète
    postalCode: 'H1H 1H1', // ← Ajouter code postal
  },
  email: 'contact@lesjusnatuelsbens.com',
}
```

### 3. Ajouter les réseaux sociaux
Vérifier que les URLs sont correctes:
- Instagram
- Facebook
- Ajouter d'autres réseaux au besoin

### 4. Vérifier l'image OG (Open Graph)
S'assurer que `/images-bens/logos/logo.png` existe et est optimisée (1200x630px idéalement)

### 5. Créer des descriptions uniques
Chaque page doit avoir:
- Une description META unique (160 caractères max)
- Un titre H1 unique
- Du contenu riche et pertinent

### 6. Ajouter Alt Text aux images
```tsx
<img src="..." alt="Description précise de l'image" />
```

### 7. Vérifier les sitemap et robots.txt
1. Visiter: `https://votresite.com/robots.txt`
2. Visiter: `https://votresite.com/sitemap.xml`
3. Soumettre le sitemap à Google Search Console

---

## Prochaines Étapes Recommandées

### Optionnel mais Puissant:

1. **Google Search Console**
   - Soumettre le sitemap
   - Vérifier les erreurs d'indexation
   - Analyser le trafic de recherche

2. **Google Analytics**
   - Ajouter le code de suivi
   - Tracker les conversions

3. **Optimisation des Images**
   - Utiliser WebP format
   - Compresser les images
   - Ajouter srcset pour responsive

4. **Contenu**
   - Blog posts optimisé SEO
   - Descriptions produits longues
   - FAQ section

5. **Liens**
   - Backlinks de qualité
   - Internal linking naturel
   - Links profonds vers sous-pages

6. **PageSpeed**
   - Vérifier avec Google PageSpeed Insights
   - Optimiser Core Web Vitals
   - Code-splitting avec Vite

---

## Checklist Avant Lancement

- [ ] Domaine configuré et SSL activé (https)
- [ ] URLs mises à jour partout
- [ ] Coordonnées réelles ajoutées
- [ ] Images optimisées (format, taille, alt text)
- [ ] robots.txt accessible
- [ ] sitemap.xml généré et correct
- [ ] Google Search Console: sitemap soumis
- [ ] Canonical URLs correctes
- [ ] Meta descriptions uniques par page
- [ ] Structured Data testée (schema.org validator)
- [ ] Open Graph images testées (og debugger Facebook)
- [ ] Mobile responsive test (Google Mobile-Friendly Test)

---

## Ressources Utiles

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## Support

Pour des questions sur l'implémentation SEO, consultez la documentation React Helmet:
https://github.com/nfl/react-helmet-async
