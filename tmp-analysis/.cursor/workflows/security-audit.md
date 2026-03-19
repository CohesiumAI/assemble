# Workflow : security-audit

Audit de sécurité complet — détection des vulnérabilités, remédiation et conformité

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Punisher (punisher)

**Action :** Scanner et identifier les vulnérabilités dans le code et l'infrastructure

**Livrables :**
- `vulnerability-report.md`
- `threat-model.md`

### Étape 2 — Bruce Banner (bruce-banner)

**Action :** Élaborer le plan de remédiation pour les vulnérabilités identifiées

**Inputs :** `01-security/vulnerability-report.md`, `01-security/threat-model.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `remediation-plan.md`
- `patching-schedule.md`

### Étape 3 — Thor (thor)

**Action :** Renforcer la sécurité de l'infrastructure et des configurations

**Inputs :** `01-security/vulnerability-report.md`, `02-dev-backend/remediation-plan.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `infrastructure-hardening.md`
- `security-config.md`

### Étape 4 — She-Hulk (she-hulk)

**Action :** Vérifier la conformité réglementaire et les obligations légales

**Inputs :** `01-security/vulnerability-report.md`, `03-devops/infrastructure-hardening.md`, `02-dev-backend/remediation-plan.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `compliance-check.md`
- `regulatory-summary.md`

