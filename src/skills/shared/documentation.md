---
name: documentation
description: Génération de documentation technique et fonctionnelle — README, guides d'architecture, ADR, documentation d'API et guides utilisateur
agents: [dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, architect, qa, security, db, data, pm, scrum, ai-engineer, automation, seo, geo-aio, content-seo, marketing, copywriter, ads, growth, social, storytelling, ux, brand, contrarian, analyst, legal]
trigger: /doc
---

# Skill : Documentation

## Objectif

Produire une documentation claire, structurée et maintenable qui répond au besoin identifié : documentation technique (README, ADR, guides), documentation d'API, documentation fonctionnelle ou guide utilisateur. Chaque document doit être autonome, à jour et actionnable.

## Quand l'utiliser

- À la création d'un nouveau projet, module ou service
- Après un choix architectural significatif (ADR)
- Lors de la publication ou modification d'une API
- Quand un processus métier doit être documenté pour l'équipe
- Lors de l'onboarding de nouveaux membres dans le projet
- Quand la documentation existante est obsolète ou manquante

## Étapes

1. **Identifier le type de document** — Classifier le besoin : README projet, guide d'architecture, ADR (Architecture Decision Record), documentation d'API, guide utilisateur, runbook opérationnel, changelog.
2. **Définir l'audience** — Qui va lire ce document ? Développeur, ops, product owner, utilisateur final ? Adapter le niveau de détail et le vocabulaire en conséquence.
3. **Collecter les informations sources** — Analyser le code, les fichiers de configuration, les commentaires existants, les tickets, les conversations pertinentes. Ne pas inventer — documenter ce qui existe.
4. **Structurer le document** — Appliquer le template approprié au type de document. Utiliser des titres hiérarchiques, des listes, des tableaux et des blocs de code pour maximiser la lisibilité.
5. **Rédiger le contenu** — Écrire de manière concise et directe. Chaque section doit répondre à une question précise. Inclure des exemples concrets (commandes, requêtes, snippets) quand pertinent.
6. **Ajouter les éléments visuels** — Diagrammes d'architecture (Mermaid), schémas de flux, tableaux de référence. Un bon schéma remplace souvent trois paragraphes.
7. **Valider la cohérence** — Vérifier que les chemins de fichiers, les commandes et les exemples de code sont corrects et fonctionnels. Supprimer les sections vides ou placeholder.
8. **Définir la maintenance** — Indiquer la date de dernière mise à jour, le responsable du document et les conditions de révision (ex: à chaque release, à chaque changement d'architecture).

## Checklist de sortie

- [ ] Le type de document et l'audience sont clairement identifiés
- [ ] La structure suit le template approprié
- [ ] Le contenu est factuel, concis et actionnable
- [ ] Les exemples de code et commandes sont vérifiés et fonctionnels
- [ ] Les diagrammes et schémas sont inclus quand nécessaire
- [ ] Aucune section vide ou placeholder n'est présente
- [ ] La date de mise à jour et le responsable sont indiqués
- [ ] Le document est autonome (compréhensible sans contexte oral)

## Format de sortie

```markdown
## Documentation générée

**Type :** [README | ADR | Guide d'architecture | Doc API | Guide utilisateur | Runbook]
**Audience :** [Développeurs | Ops | Product | Utilisateurs finaux]
**Dernière mise à jour :** [date]
**Responsable :** [nom/rôle]

---

### [Titre du document]

#### Contexte
[Pourquoi ce document existe, quel problème il résout]

#### Contenu principal
[Corps du document structuré selon le template du type choisi]

##### Pour un README :
- Description du projet
- Prérequis et installation
- Configuration
- Utilisation / Commandes disponibles
- Architecture (schéma)
- Contribution
- Licence

##### Pour un ADR :
- Statut : [Proposé | Accepté | Déprécié | Remplacé par ADR-XXX]
- Contexte
- Décision
- Alternatives considérées
- Conséquences

##### Pour un Runbook :
- Scénario / Alerte déclencheuse
- Diagnostic étape par étape
- Actions correctives
- Escalade

---

**Prochaine révision prévue :** [date ou condition]
```
