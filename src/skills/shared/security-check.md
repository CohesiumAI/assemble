---
name: security-check
description: Vérification de sécurité — audit OWASP Top 10, analyse de vulnérabilités, hardening des configurations, gestion des secrets et conformité des dépendances
agents: [security, dev-backend, devops, architect]
trigger: /sec-check
---

# Skill : Vérification de Sécurité

## Objectif

Réaliser un audit de sécurité structuré couvrant les vulnérabilités applicatives (OWASP Top 10), la configuration des services, la gestion des secrets, les dépendances tierces et le hardening infrastructure. Cette skill produit un rapport priorisé avec des remédiations concrètes.

## Quand l'utiliser

- Avant la mise en production d'une application ou d'un service
- Après l'ajout d'un mécanisme d'authentification ou d'autorisation
- Lors d'un audit de sécurité périodique ou suite à un incident
- Quand de nouvelles dépendances tierces sont introduites dans le projet
- Lors d'un changement de configuration infrastructure (réseau, firewall, IAM)
- Avant un pentest pour identifier et corriger les failles évidentes

## Étapes

1. **Définir le périmètre d'audit** — Identifier les composants à analyser : application web, API, infrastructure, pipeline CI/CD, configuration cloud. Délimiter clairement ce qui est inclus et exclu. Collecter la documentation existante (architecture, flux de données).
2. **Analyser les vulnérabilités applicatives (OWASP Top 10)** — Passer en revue chaque catégorie : injection (SQL, NoSQL, LDAP, OS command), broken authentication, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, using components with known vulnerabilities, insufficient logging & monitoring.
3. **Auditer la gestion des secrets** — Vérifier qu'aucun secret n'est hardcodé dans le code source, les fichiers de configuration ou les images Docker. Valider l'utilisation d'un gestionnaire de secrets (Vault, AWS Secrets Manager, GCP Secret Manager). Vérifier la rotation des clés et tokens.
4. **Analyser les dépendances** — Scanner les dépendances avec `npm audit`, `pip-audit`, `trivy`, `snyk` ou `grype`. Identifier les CVE connues, évaluer leur sévérité (CVSS) et leur exploitabilité dans le contexte du projet.
5. **Vérifier le hardening des configurations** — Headers HTTP de sécurité (CSP, HSTS, X-Frame-Options, X-Content-Type-Options), configuration TLS (versions, cipher suites), CORS policy, rate limiting, timeouts, taille maximale des requêtes.
6. **Auditer l'authentification et l'autorisation** — Valider la politique de mots de passe, la gestion des sessions (expiration, rotation), les mécanismes MFA, les contrôles d'accès (RBAC/ABAC), l'isolation des tenants en multi-tenant.
7. **Vérifier le logging et la détection** — S'assurer que les événements de sécurité sont loggés (tentatives de connexion échouées, accès refusés, modifications de permissions), que les logs ne contiennent pas de données sensibles, et que des alertes sont configurées.
8. **Rédiger le rapport de sécurité** — Classifier chaque constat par sévérité (critique, haute, moyenne, basse, informationnelle) avec une description de l'impact, la preuve de concept et la remédiation recommandée.

## Checklist de sortie

- [ ] Le périmètre d'audit est défini et documenté
- [ ] Chaque catégorie OWASP Top 10 a été analysée
- [ ] Aucun secret n'est exposé dans le code source ou les configurations
- [ ] Les dépendances sont scannées et les CVE critiques identifiées
- [ ] Les headers de sécurité et la configuration TLS sont conformes
- [ ] L'authentification et l'autorisation sont robustes et testées
- [ ] Le logging de sécurité est en place sans fuite de données sensibles
- [ ] Le rapport est classé par sévérité avec des remédiations actionnables

## Format de sortie

```markdown
## Rapport de Sécurité

**Périmètre :** [composants audités]
**Référentiel :** OWASP Top 10 2021 + bonnes pratiques
**Date :** [date]
**Auditeur :** [agent]

### Résumé exécutif

| Sévérité         | Nombre |
|------------------|--------|
| 🔴 Critique      | X      |
| 🟠 Haute         | X      |
| 🟡 Moyenne       | X      |
| 🔵 Basse         | X      |
| ⚪ Informationnelle | X   |

**Score de risque global :** [Critique | Élevé | Modéré | Faible]

### Constats détaillés

#### 🔴 [SEC-01] Titre de la vulnérabilité

- **Catégorie OWASP :** [A01:2021 - Broken Access Control | ...]
- **Composant affecté :** [service/fichier/endpoint]
- **Description :** Explication technique de la vulnérabilité
- **Impact :** Conséquence en cas d'exploitation (confidentialité, intégrité, disponibilité)
- **Preuve de concept :** Commande ou scénario de reproduction
- **Remédiation :** Solution technique détaillée avec exemple de code
- **Priorité de correction :** [Immédiate | Sprint en cours | Prochain sprint]

### Analyse des dépendances

| Package | Version actuelle | CVE | CVSS | Version corrigée |
|---------|-----------------|-----|------|-----------------|
| [package] | [version] | [CVE-XXXX-XXXXX] | [score] | [version] |

### Recommandations prioritaires

1. [Action immédiate n°1 — description et responsable]
2. [Action immédiate n°2 — description et responsable]
3. [Amélioration à planifier — description]

### Conformité des headers de sécurité

| Header | Statut | Valeur attendue | Valeur actuelle |
|--------|--------|-----------------|-----------------|
| Content-Security-Policy | ✅/❌ | [valeur] | [valeur] |
| Strict-Transport-Security | ✅/❌ | max-age=31536000 | [valeur] |
| X-Content-Type-Options | ✅/❌ | nosniff | [valeur] |
| X-Frame-Options | ✅/❌ | DENY | [valeur] |

### Prochaines étapes

- [ ] Corriger les vulnérabilités critiques et hautes
- [ ] Planifier un re-test après correction
- [ ] Mettre à jour les dépendances vulnérables
- [ ] Configurer le monitoring de sécurité
```
