# Workflow : release-cycle

Cycle de mise en production — validation, déploiement et communication

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Captain America (captain-america)

**Action :** Préparer la checklist de release et valider la complétion du scope

**Livrables :**
- `release-checklist.md`
- `scope-validation.md`

### Étape 2 — Hawkeye (hawkeye)

**Action :** Effectuer la validation finale et exécuter les tests de non-régression

**Inputs :** `01-scrum/release-checklist.md`, `01-scrum/scope-validation.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `qa-sign-off.md`
- `regression-results.md`

### Étape 3 — Punisher (punisher)

**Action :** Valider la conformité sécuritaire avant mise en production

**Inputs :** `02-qa/qa-sign-off.md`, `02-qa/regression-results.md`, `01-scrum/release-checklist.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `security-clearance.md`
- `final-audit.md`

### Étape 4 — She-Hulk (she-hulk)

**Action :** Vérifier la conformité réglementaire de la release (RGPD, CGU, mentions légales)

**Inputs :** `01-scrum/scope-validation.md`, `03-security/security-clearance.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `compliance-sign-off.md`
- `legal-notes.md`

### Étape 5 — Thor (thor)

**Action :** Préparer le runbook de déploiement et le plan de rollback

**Inputs :** `03-security/security-clearance.md`, `04-legal/compliance-sign-off.md`, `02-qa/qa-sign-off.md`

**Dépend de :** étape(s) 3, 4

**Livrables :**
- `deploy-runbook.md`
- `rollback-plan.md`

### Étape 6 — Star-Lord (star-lord)

**Action :** Rédiger l'annonce de la release et le changelog public

**Inputs :** `05-devops/deploy-runbook.md`, `01-scrum/scope-validation.md`

**Dépend de :** étape(s) 5

**Livrables :**
- `announcement.md`
- `changelog.md`

### Étape 7 — Phil Coulson (phil-coulson)

**Action :** Préparer le communiqué de presse et le plan de communication externe

**Inputs :** `06-marketing/announcement.md`, `01-scrum/scope-validation.md`

**Dépend de :** étape(s) 6

**Livrables :**
- `press-release.md`
- `comms-plan.md`

### Étape 8 — Pepper Potts (pepper-potts)

**Action :** Préparer la communication client et le plan d'accompagnement post-release

**Inputs :** `06-marketing/announcement.md`, `06-marketing/changelog.md`

**Dépend de :** étape(s) 6

**Livrables :**
- `customer-notification.md`
- `adoption-plan.md`

