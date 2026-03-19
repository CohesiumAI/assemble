---
name: seo-audit
description: Audit SEO technique et on-page — crawlabilité, Core Web Vitals, balises, données structurées, maillage interne et opportunités d'optimisation
agents: [seo, content-seo, geo-aio, dev-frontend]
trigger: /seo
---

# Skill : Audit SEO

## Objectif

Réaliser un audit SEO complet couvrant les aspects techniques (crawlabilité, indexabilité, performance), on-page (balises, contenu, données structurées) et structurels (maillage interne, architecture de l'information). Cette skill produit un rapport actionnable avec des recommandations priorisées par impact sur le référencement.

## Quand l'utiliser

- Lors du lancement d'un nouveau site ou d'une refonte
- Quand le trafic organique chute ou stagne sans explication évidente
- Lors d'un audit périodique de la santé SEO (trimestriel recommandé)
- Après une migration de domaine, de CMS ou de structure d'URL
- Pour identifier les opportunités d'optimisation rapides (quick wins)
- Avant une campagne de contenu pour s'assurer que la base technique est solide

## Étapes

1. **Analyser la crawlabilité et l'indexabilité** — Vérifier le `robots.txt`, le `sitemap.xml`, les directives meta robots et les en-têtes X-Robots-Tag. Identifier les pages bloquées involontairement, les boucles de redirection, les erreurs 4xx/5xx. Analyser le budget de crawl (logs serveur).
2. **Auditer la performance technique** — Mesurer les Core Web Vitals (LCP, INP, CLS) sur les pages stratégiques. Vérifier le temps de chargement, le TTFB, la compression (gzip/brotli), la minification des ressources, le lazy loading des images, le cache navigateur.
3. **Analyser les balises SEO on-page** — Vérifier la présence et l'unicité des balises `<title>`, `<meta description>`, `<h1>`, la hiérarchie des headings (H1→H6), les attributs `alt` des images, les URLs canoniques, les balises hreflang pour le multilingue.
4. **Vérifier les données structurées** — Auditer le balisage Schema.org (JSON-LD) : validité (Google Rich Results Test), pertinence par rapport au type de page (Article, Product, FAQPage, LocalBusiness, BreadcrumbList), complétude des champs recommandés.
5. **Auditer le maillage interne** — Analyser la profondeur de crawl (pages à plus de 3 clics de la homepage), la distribution du PageRank interne, les pages orphelines, les ancres de liens optimisées, les liens cassés internes.
6. **Analyser le contenu** — Vérifier le contenu dupliqué (interne et externe), le thin content (pages < 300 mots sans valeur ajoutée), la cannibalisation de mots-clés (plusieurs pages ciblant le même terme), l'optimisation des contenus existants vs le search intent.
7. **Évaluer l'expérience mobile** — Tester la compatibilité mobile (responsive design), la taille des zones tactiles, la lisibilité du texte sans zoom, l'absence d'interstitiels intrusifs. Vérifier le rendu sur les principaux appareils.
8. **Produire le rapport et le plan d'action** — Classifier les recommandations par impact SEO (élevé, moyen, faible) et effort technique. Identifier les quick wins (fort impact, faible effort). Proposer un calendrier de mise en œuvre réaliste.

## Checklist de sortie

- [ ] Le robots.txt et le sitemap.xml sont conformes et à jour
- [ ] Aucune page stratégique n'est bloquée à l'indexation
- [ ] Les Core Web Vitals respectent les seuils Google (vert)
- [ ] Chaque page a un title, une meta description et un H1 uniques
- [ ] Les données structurées sont valides et pertinentes
- [ ] Le maillage interne assure une profondeur de crawl ≤ 3 clics
- [ ] Aucun contenu dupliqué ou cannibalisation critique identifié
- [ ] Le rapport contient un plan d'action priorisé avec quick wins

## Format de sortie

```markdown
## Rapport d'Audit SEO

**Site :** [URL du site]
**Pages analysées :** [nombre]
**Date :** [date]
**Auditeur :** [agent]

### Score global

| Catégorie | Score | Statut |
|-----------|-------|--------|
| Technique | XX/100 | ✅/⚠️/❌ |
| On-page | XX/100 | ✅/⚠️/❌ |
| Contenu | XX/100 | ✅/⚠️/❌ |
| Maillage interne | XX/100 | ✅/⚠️/❌ |
| Mobile | XX/100 | ✅/⚠️/❌ |

**Score SEO global :** XX/100

### Constats techniques

#### 🔴 Problèmes critiques

**[SEO-01] Titre du problème**
- **Pages affectées :** [nombre] pages — [exemples d'URLs]
- **Impact SEO :** [description de l'impact sur le référencement]
- **Recommandation :** [solution technique détaillée]
- **Priorité :** Immédiate

#### 🟠 Problèmes importants

**[SEO-02] Titre du problème**
- **Pages affectées :** [nombre] pages
- **Impact SEO :** [description]
- **Recommandation :** [solution]

#### 🟡 Améliorations recommandées

**[SEO-03] Titre de l'amélioration**
- **Opportunité :** [gain potentiel]
- **Recommandation :** [solution]

### Analyse des Core Web Vitals

| Page | LCP | INP | CLS | Score mobile | Score desktop |
|------|-----|-----|-----|-------------|---------------|
| Homepage | X.Xs | Xms | X.XX | XX | XX |
| Page catégorie | X.Xs | Xms | X.XX | XX | XX |
| Page produit | X.Xs | Xms | X.XX | XX | XX |

### Analyse des balises

| Problème | Pages affectées | Exemples |
|----------|----------------|----------|
| Title manquant | X | [URLs] |
| Title dupliqué | X | [URLs] |
| Meta description manquante | X | [URLs] |
| H1 manquant ou multiple | X | [URLs] |
| Images sans alt | X | [URLs] |

### Données structurées

| Type | Pages | Statut validation | Erreurs |
|------|-------|-------------------|---------|
| [BreadcrumbList] | X | ✅/❌ | [détails] |
| [Product] | X | ✅/❌ | [détails] |
| [FAQPage] | X | ✅/❌ | [détails] |

### Quick wins — Actions à fort impact / faible effort

| # | Action | Impact estimé | Effort | Délai |
|---|--------|---------------|--------|-------|
| 1 | [action] | [impact trafic] | [jours-homme] | [délai] |
| 2 | [action] | [impact trafic] | [jours-homme] | [délai] |
| 3 | [action] | [impact trafic] | [jours-homme] | [délai] |

### Plan d'action complet

| Phase | Actions | Délai | Responsable |
|-------|---------|-------|-------------|
| Immédiat (S1-S2) | [actions critiques] | 2 semaines | [équipe] |
| Court terme (M1) | [actions importantes] | 1 mois | [équipe] |
| Moyen terme (M2-M3) | [améliorations] | 2-3 mois | [équipe] |
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
