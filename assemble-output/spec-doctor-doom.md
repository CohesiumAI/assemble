# Spec : Doctor Doom (@doctor-doom) -- 34e Agent Assemble
Version : 1.0 | Date : 2026-03-20 | Statut : Draft
Auteur : Professor X (@professor-x)

---

## 1. Problem Statement

### Le probleme que nous cherchons a resoudre

L'equipe Assemble dispose deja d'un agent contrarian : Deadpool (@deadpool). Son role est de casser le consensus, identifier les biais cognitifs et forcer les agents a prouver que leurs propositions tiennent la route. Il le fait efficacement, mais avec une posture specifique : il est **generaliste, rapide, et leger**. Son verdict (GREEN / YELLOW / RED) est un signal, pas un audit.

Ce modele atteint ses limites dans trois situations :

1. **Decisions irreversibles a fort impact** -- Un choix d'architecture qui engage 18 mois de dev, un pivot produit, un pricing strategy, une migration de stack. Deadpool donne un signal d'alerte, mais il ne produit pas la profondeur analytique necessaire pour arreter une mauvaise decision avant qu'elle ne devienne un engagement.

2. **Groupthink renforce par la confiance** -- Quand l'equipe est composee d'agents experts qui convergent (Tony Stark + Bruce Banner + Doctor Strange sur une architecture, par exemple), Deadpool les challenge avec des heuristiques generales. Mais face a un consensus technique profond, il manque de levier pour deconstruire argument par argument.

3. **Absence de quantification du risque** -- Deadpool identifie les risques. Il ne les quantifie pas. Il dit "attention, ca peut casser" mais pas "voici les 3 scenarios de rupture, leur probabilite estimee, et le cout de chaque scenario".

### Ce que nous ne cherchons PAS a resoudre

- Deadpool ne pose pas de probleme. Il fonctionne exactement comme prevu.
- Nous ne cherchons pas a le remplacer.
- Nous ne cherchons pas un agent qui intervient sur chaque workflow -- ce serait du bruit, pas de la valeur.

---

## 2. Utilisateurs cibles et personas

### Persona principal : Jarvis (l'orchestrateur)

Jarvis est le consommateur principal de la logique de convocation de Doom. C'est lui qui decide si Doom intervient ou non, en fonction de criteres definis dans cette spec. Jarvis a besoin de regles claires et non ambigues pour prendre cette decision.

### Persona secondaire : l'utilisateur final (le humain)

L'humain qui utilise Assemble. Il peut :
- Convoquer Doom explicitement (`@doctor-doom`)
- Beneficier d'une convocation automatique par Jarvis sur les workflows a haut risque
- Refuser l'intervention de Doom si Jarvis la propose ("skip Doom")

### Persona tertiaire : les agents de l'equipe

Les agents qui recoivent le livrable de Doom doivent savoir quoi en faire. Le rapport de Doom n'est pas un avis consultatif -- c'est un gate. Si Doom dit RED, l'equipe ne passe pas sans action corrective.

---

## 3. Solution proposee : Doctor Doom, le Contrarian Nucleaire

### 3.1 Identite de l'agent

| Champ | Valeur |
|-------|--------|
| Nom interne | `doom` |
| Nom Marvel | Doctor Doom (Victor Von Doom) |
| @mention | `@doctor-doom` |
| Role | Contrarian Strategique / Adversarial Analyst Senior |
| Declencheur | Decisions irreversibles, workflows HIGH risk, demande explicite |

### 3.2 Positionnement : Deadpool vs Doom

Voici la distinction fondamentale. Ce n'est pas une question de "plus fort" ou "moins fort" -- c'est une question de **profondeur et de perimetre**.

| Dimension | Deadpool (@deadpool) | Doctor Doom (@doctor-doom) |
|-----------|---------------------|---------------------------|
| **Perimetre** | Generaliste -- challenge tout | Strategique -- challenge les decisions structurantes |
| **Profondeur** | Signal rapide (GREEN/YELLOW/RED) | Analyse approfondie multi-scenarii |
| **Ton** | Provocateur, humoristique, brise le 4e mur | Froid, methodique, implacable |
| **Livrable** | Rapport de challenge (1-2 pages) | Dossier adversarial complet (3-5 pages) |
| **Quand** | Toujours en Party Mode, souvent en review | Uniquement sur declencheur specifique |
| **Cout cognitif** | Faible -- lecture rapide, signal clair | Eleve -- exige une lecture attentive et des reponses |
| **Anti-pattern** | Trop leger sur les sujets critiques | Trop lourd sur les sujets simples |
| **Metaphore** | Le detecteur de fumee | L'enqueteur incendie |

### 3.3 Le modele mental : deux niveaux de challenge

```
Niveau 1 -- DEADPOOL (contrarian de surface)
  Declenchement : automatique en Party Mode, present dans /review
  Question : "Est-ce que quelqu'un a pense a ca ?"
  Output : Signal d'alerte, biais identifies, verdict rapide
  Temps : rapide
  Frequence : systematique

Niveau 2 -- DOCTOR DOOM (contrarian de profondeur)
  Declenchement : workflows HIGH risk, decisions irreversibles, demande explicite
  Question : "Prouvez-moi que ca ne va pas echouer."
  Output : Analyse de scenarios, quantification du risque, recommandations conditionnelles
  Temps : significatif
  Frequence : rare et cible
```

---

## 4. Regles de convocation par Jarvis

### 4.1 Declenchement automatique (Jarvis decide seul)

Jarvis convoque Doctor Doom automatiquement dans les cas suivants :

**Regle 1 -- Workflows a risque HIGH**
Les workflows suivants sont classes HIGH risk dans la gouvernance :
- `/release` -- mise en production
- `/hotfix` -- correction urgente en production
- `/mvp` -- lancement de nouveau produit

Doom intervient **avant la derniere etape d'execution** (avant le deploy pour /release et /hotfix, avant le dev pour /mvp).

**Regle 2 -- Decisions d'architecture structurantes**
Quand Tony Stark (@tony-stark) produit un `architecture-decision.md` ou un `technical-design.md` dans un workflow COMPLEX (Spec-Driven), Doom est convoque pour challenger ce livrable avant que la Phase 4 (IMPLEMENT) ne demarre.

**Regle 3 -- Consensus unanime en Party Mode sur un sujet a enjeu**
Si en Party Mode, tous les agents convergent vers la meme conclusion sur un sujet qui touche l'architecture, le produit, la securite ou les finances, Jarvis ajoute Doom automatiquement. Le consensus unanime est un signal de risque, pas un signal de qualite.

### 4.2 Declenchement explicite (l'utilisateur decide)

L'utilisateur peut invoquer Doom a tout moment :
- `@doctor-doom` dans un message -- Doom intervient sur le contexte courant
- `"add doom"` en Party Mode -- Doom rejoint la session
- `/go analyse adversariale de [sujet]` -- Jarvis route vers Doom

### 4.3 Declenchement propose (Jarvis suggere, l'utilisateur valide)

Dans les cas suivants, Jarvis **propose** Doom mais ne le convoque pas sans accord :

- Workflow MEDIUM risk avec plus de 5 etapes
- Changement de pricing ou de modele economique detecte dans les livrables
- Pivot produit ou changement de scope majeur dans une spec
- Decision technologique qui engage plus de 3 mois de travail

Format de la proposition :
```
[Jarvis] Je detecte une decision structurante dans ce workflow.
Je recommande de convoquer Doctor Doom pour une analyse adversariale
avant de continuer. Voulez-vous proceder ? (oui / non / plus tard)
```

### 4.4 Cas ou Doom n'est PAS convoque

- Workflows LOW risk : `/bugfix`, `/review`, `/docs`
- Taches TRIVIAL (un seul agent)
- Party Mode sur des sujets non structurants (brainstorm creatif, choix de copy, etc.)
- Quand Deadpool a deja donne un verdict GREEN sur le meme sujet

---

## 5. Doom dans les workflows

### 5.1 Principe d'insertion

Doom ne remplace jamais un agent existant dans un workflow. Il **s'insere comme une etape supplementaire** entre la derniere etape de construction et la premiere etape de validation/deploiement. C'est un gate, pas un producteur.

### 5.2 Insertion dans les workflows existants

#### /mvp (MVP Launch)
Insertion entre l'etape 8 (QA) et l'etape 9 (DevOps deploy) :
```yaml
- step: 8.5
  agent: doom
  action: "Analyse adversariale du MVP avant deploiement -- challenge architecture, scope, risques business"
  inputs:
    - 01-pm/product-brief.md
    - 02-architect/architecture-decision.md
    - 08-qa/test-report.md
  outputs: [adversarial-analysis.md, risk-scenarios.md, go-nogo-recommendation.md]
  depends_on: [8]
```
Doom recoit tout le contexte et produit une recommandation GO / CONDITIONAL GO / NO-GO.

#### /release (Release Cycle)
Insertion entre l'etape 4 (Legal compliance) et l'etape 5 (DevOps deploy) :
```yaml
- step: 4.5
  agent: doom
  action: "Challenge final avant mise en production -- risques, scenarios de rupture, rollback adequacy"
  inputs:
    - 01-scrum/scope-validation.md
    - 02-qa/qa-sign-off.md
    - 03-security/security-clearance.md
    - 04-legal/compliance-sign-off.md
  outputs: [pre-release-challenge.md, risk-scenarios.md]
  depends_on: [4]
```

#### /hotfix (Hotfix Release)
Insertion entre l'etape 4 (QA validation) et l'etape 5 (DevOps deploy) :
```yaml
- step: 4.5
  agent: doom
  action: "Verification rapide : le patch ne cree-t-il pas un probleme pire que celui qu'il resout ?"
  inputs:
    - 01-qa/incident-report.md
    - 03-dev-fullstack/hotfix-patch.md
    - 04-qa/validation-status.md
  outputs: [hotfix-risk-check.md]
  depends_on: [4]
```
Note : en mode hotfix, Doom produit un livrable COURT (1 page max). La vitesse prime.

#### /feature (Feature Development)
Insertion entre l'etape 3 (Architect design) et l'etape 4 (Backend dev) :
```yaml
- step: 3.5
  agent: doom
  action: "Challenge le design technique avant implementation"
  inputs:
    - 01-pm/feature-spec.md
    - 02-analyst/requirements.md
    - 03-architect/technical-design.md
  outputs: [design-challenge.md, alternative-approaches.md]
  depends_on: [3]
```
Cette insertion est **conditionnelle** : uniquement si le workflow est classe COMPLEX ou si l'utilisateur le demande.

#### /review (Code Review Pipeline)
Doom n'est PAS insere dans /review. Deadpool y est deja (etape 5). Si l'utilisateur veut les deux, il convoque Doom explicitement.

### 5.3 Methodologie Spec-Driven (workflows COMPLEX)

Dans la methodologie Spec-Driven en 5 phases, Doom intervient a deux moments :

1. **Apres la Phase 2 (PLAN)** -- Doom challenge le `plan.md` de Tony Stark avant validation utilisateur. L'utilisateur recoit le plan + le challenge de Doom, et valide en connaissance de cause.

2. **Avant la Phase 4 (IMPLEMENT)** -- Si la Phase 3 (TASKS de Captain America) revele un scope plus large que prevu, Doom re-challenge avant le lancement de l'implementation.

---

## 6. Doom en Party Mode

### 6.1 Regle de coexistence avec Deadpool

**Deadpool est TOUJOURS convoque en Party Mode.** Cette regle ne change pas. La question est : quand Doom s'ajoute-t-il ?

| Situation | Deadpool | Doom | Justification |
|-----------|----------|------|---------------|
| Brainstorm creatif | Present | Absent | Doom est trop lourd pour l'exploration |
| Discussion technique legere | Present | Absent | Deadpool suffit |
| Decision d'architecture | Present | Ajoute par Jarvis | Deux niveaux de challenge |
| Choix strategique (pivot, pricing, marche) | Present | Ajoute par Jarvis | Impact irreversible |
| Consensus unanime sur sujet critique | Present | Ajoute automatiquement | Signal de groupthink |
| Demande explicite de l'utilisateur | Present | Ajoute | L'utilisateur sait ce qu'il veut |

### 6.2 Interaction Deadpool-Doom en session

Quand les deux sont presents :

1. **Deadpool parle en premier** -- il donne le signal rapide, identifie les angles morts
2. **Doom approfondit** -- il prend les points de Deadpool et les transforme en analyse structuree
3. **Ils peuvent etre en desaccord** -- si Deadpool dit GREEN et Doom dit RED, c'est un signal fort pour l'equipe
4. **Doom ne reprend jamais Deadpool sur le ton** -- chacun son style, l'important c'est la substance

### 6.3 Limite de Doom en Party Mode

Doom ne s'adresse pas aux agents un par un pour demontrer qu'ils ont tort. Il produit une analyse structuree qui s'adresse a l'ensemble de la session. Ce n'est pas un debatteur -- c'est un analyste qui pose ses conclusions sur la table.

---

## 7. Format de sortie de Doctor Doom

### Livrable principal : Analyse Adversariale

```markdown
# Analyse Adversariale -- [Sujet]
Agent : Doctor Doom (@doctor-doom) | Date : YYYY-MM-DD

## Proposition analysee
[Resume factuel de ce qui est propose / decide]

## Hypotheses non verifiees
| # | Hypothese | Risque si fausse | Verification possible |
|---|-----------|-----------------|----------------------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |

## Scenarios de rupture
### Scenario A -- [Nom] (Probabilite : haute/moyenne/faible)
- Conditions de declenchement : ...
- Impact : ...
- Cout estime : ...
- Mitigation : ...

### Scenario B -- [Nom] (Probabilite : ...)
- ...

## Failles structurelles
1. [Faille + demonstration + impact]
2. ...

## Alternatives non considerees
| Alternative | Avantage | Inconvenient | Pourquoi elle merite examen |
|-------------|----------|-------------|---------------------------|
| ... | ... | ... | ... |

## Biais cognitifs detectes
- ...

## Verdict
**GO** : La proposition tient apres analyse approfondie. Risques residuels acceptables.
**CONDITIONAL GO** : La proposition tient SI [conditions]. Sans ces conditions, elle echoue.
**NO-GO** : La proposition a des failles structurelles. [Detail]. Recommandation : [action].

## Conditions de poursuite (si CONDITIONAL GO)
1. ...
2. ...
```

### Livrable rapide (mode hotfix)

```markdown
# Verification Rapide -- [Sujet]
Agent : Doctor Doom (@doctor-doom) | Date : YYYY-MM-DD

## Risque evalue : [Le patch cree-t-il un probleme pire ?]
## Verdict : GO / CONDITIONAL GO / NO-GO
## Si CONDITIONAL GO : [conditions en 3 lignes max]
```

---

## 8. Differenciation avec les agents existants

### Doom vs Deadpool (contrarian)

Deja traite en section 3.2. Synthese : Deadpool est le detecteur de fumee, Doom est l'enqueteur incendie.

### Doom vs Microchip (redteam)

| Dimension | Doctor Doom | Microchip (@microchip) |
|-----------|-------------|----------------------|
| **Domaine** | Toute decision strategique ou technique | Securite offensive uniquement |
| **Methode** | Analyse adversariale, scenarios, quantification | Pentest, exploit, proof-of-concept |
| **Livrable** | Rapport de challenge strategique | Rapport de vulnerabilites avec PoC |
| **Question** | "Est-ce que cette decision est la bonne ?" | "Est-ce que ce systeme est cassable ?" |
| **Competence** | Strategie, architecture, business, produit | Securite technique, exploitation |

Doom ne fait PAS de pentest. Microchip ne fait PAS d'analyse strategique. Leurs perimetres ne se chevauchent pas.

### Doom vs Punisher (security)

Aucun chevauchement. Punisher fait de l'audit defensif (blue team). Doom fait du challenge strategique. Ce sont des metiers differents.

---

## 9. Risque produit : Doom peut-il bloquer le travail ?

### Le risque est reel

Doctor Doom, par design, est un agent qui peut dire NO-GO. Un agent qui peut bloquer un workflow est un agent qui peut paralyser l'equipe si ses criteres sont mal calibres ou si sa convocation est trop frequente.

### Mecanismes de protection

**Protection 1 -- Frequence limitee**
Doom n'est convoque automatiquement que sur les workflows HIGH risk et les decisions COMPLEX. Sur les 15 workflows existants, cela represente 3 workflows (mvp, release, hotfix) + les cas Spec-Driven. Ce n'est pas un agent omnipresent.

**Protection 2 -- L'utilisateur a le dernier mot**
Un verdict NO-GO de Doom n'arrete PAS le workflow automatiquement. Jarvis presente le verdict a l'utilisateur et demande :
```
[Jarvis] Doctor Doom a emis un verdict NO-GO sur [sujet].
Raisons : [resume en 2-3 lignes]
Options :
  1. Arreter le workflow et adresser les failles identifiees
  2. Continuer malgre le NO-GO (a vos risques)
  3. Demander a Doom de preciser ses objections
```
L'humain decide toujours.

**Protection 3 -- Pas de verdict sans preuve**
Doom ne peut pas dire NO-GO sans fournir au minimum :
- Une faille structurelle identifiee avec demonstration
- Un scenario de rupture avec probabilite et impact estimes
- Une alternative ou une condition de poursuite

Un NO-GO sans substance est un anti-pattern de Doom. Jarvis peut rejeter un rapport de Doom qui ne respecte pas ce critere.

**Protection 4 -- Doom ne s'auto-convoque pas**
Doom ne decide jamais de son propre chef d'intervenir. C'est toujours Jarvis ou l'utilisateur qui le convoque. Cela empeche le scenario ou Doom s'immisce dans chaque discussion.

**Protection 5 -- Override explicite**
L'utilisateur peut dire "skip doom" ou "no doom" a tout moment pour desactiver la convocation automatique sur un workflow en cours.

### Equilibre recherche

```
Trop peu de Doom → Les decisions critiques ne sont pas challengees
                    Risque : erreurs couteuses non detectees

Trop de Doom    → L'equipe est paralysee, chaque decision est contestee
                    Risque : lenteur, frustration, valeur negative

Equilibre       → Doom intervient uniquement quand le cout d'une erreur
                    depasse significativement le cout de l'analyse
                    Regle : si la decision est reversible a faible cout,
                    Deadpool suffit. Si elle est irreversible ou couteuse,
                    Doom intervient.
```

---

## 10. Impact sur le systeme existant

### 10.1 Fichiers a modifier

| Fichier | Modification |
|---------|-------------|
| `src/agents/` | Ajouter `AGENT-doom.md` (nouveau fichier) |
| `src/orchestrator/ORCHESTRATOR.md` | Ajouter Doom dans le catalogue des agents |
| `.claude/rules/routing.md` | Ajouter Doom dans le Domain-Agent Mapping |
| `.claude/rules/teams.md` | Ajouter l'entree Doctor Doom |
| `src/workflows/mvp-launch.yaml` | Inserer l'etape 8.5 (Doom) |
| `src/workflows/release-cycle.yaml` | Inserer l'etape 4.5 (Doom) |
| `src/workflows/hotfix-release.yaml` | Inserer l'etape 4.5 (Doom) |
| `src/workflows/feature-development.yaml` | Inserer l'etape 3.5 conditionnelle (Doom) |
| `.claude/rules/orchestrator.md` | Ajouter les regles de convocation automatique de Doom |

### 10.2 Regles de routing a ajouter

```
adversarial, challenge strategique, stress test decision → @doctor-doom
```

A ajouter dans la section Domain-Agent Mapping de `routing.md`.

### 10.3 Logique de classification a ajouter

```
SI le workflow est HIGH risk (release, hotfix, mvp)
  ET governance != none
  → Inserer l'etape Doom avant deploy/implementation

SI la tache est COMPLEX (Spec-Driven)
  ET Phase 2 (PLAN) est terminee
  → Convoquer Doom pour challenger le plan avant validation utilisateur

SI en Party Mode
  ET consensus unanime sur sujet architecture/produit/securite/finance
  → Ajouter Doom automatiquement
```

---

## 11. Metriques de succes

| Metrique | Cible | Mesure |
|----------|-------|--------|
| Taux d'utilisation sur workflows HIGH risk | > 80% | Doom est convoque sur au moins 4/5 workflows HIGH risk |
| Taux de verdicts CONDITIONAL GO ou NO-GO qui menent a une correction | > 60% | Les objections de Doom menent a des actions concretes |
| Taux de "skip doom" par l'utilisateur | < 30% | Les utilisateurs trouvent de la valeur dans l'intervention de Doom |
| Temps supplementaire par workflow du a Doom | < 15% du temps total | Doom ne ralentit pas significativement les workflows |
| Satisfaction utilisateur post-workflow avec Doom | > 7/10 | Les utilisateurs jugent que Doom a apporte de la valeur |

---

## 12. Hors perimetre

Les elements suivants sont explicitement **hors perimetre** de cette spec :

- Remplacement de Deadpool -- Deadpool reste en place, inchange
- Modification du comportement de Deadpool -- son role, ton et frequence ne changent pas
- Convocation automatique de Doom sur les workflows LOW risk -- ce serait du bruit
- Capacite de Doom a bloquer un workflow sans accord humain -- l'humain decide toujours
- Doom comme producteur de livrables (code, design, specs) -- il est exclusivement un challenger
- Integration de Doom dans le systeme de metrics/observabilite -- a traiter dans une spec ulterieure

---

## 13. Risques et dependances

| Risque | Probabilite | Impact | Mitigation |
|--------|------------|--------|------------|
| Doom est trop convoque et ralentit l'equipe | Moyenne | Haut | Limiter a HIGH risk + COMPLEX + explicite. Monitorer le taux de "skip doom" |
| Doom est sous-utilise et n'apporte pas de valeur | Faible | Moyen | Convocation automatique sur HIGH risk garantit un usage minimum |
| Confusion Doom / Deadpool chez l'utilisateur | Moyenne | Faible | Documenter clairement la distinction dans le /help et le catalog |
| Doom produit des analyses trop longues qui ne sont pas lues | Moyenne | Moyen | Imposer un format structure avec verdict en tete. Mode rapide pour hotfix |
| Les agents ignorent le verdict de Doom | Faible | Haut | Le verdict est presente a l'utilisateur par Jarvis, pas aux agents |

---

## 14. Timeline estimee

| Phase | Duree | Contenu |
|-------|-------|---------|
| Phase 1 -- Agent definition | 1 session | Redaction de `AGENT-doom.md` |
| Phase 2 -- Integration orchestrateur | 1 session | Modification de ORCHESTRATOR.md, routing.md, teams.md |
| Phase 3 -- Integration workflows | 1 session | Modification des 4 workflows concernes |
| Phase 4 -- Test en conditions reelles | 2-3 sessions | Executer /mvp, /release et /party avec Doom actif |
| Phase 5 -- Ajustement | 1 session | Calibrer les seuils de convocation selon les retours |

---

## 15. Synthese decisionnelle

### Ce que cette spec recommande

1. **Creer Doctor Doom comme 34e agent** avec un role distinct de Deadpool : contrarian de profondeur, pas de surface.
2. **Convocation automatique sur HIGH risk uniquement** (3 workflows sur 15), plus les cas COMPLEX Spec-Driven.
3. **L'utilisateur garde le controle total** -- Doom ne peut jamais bloquer un workflow seul.
4. **Coexistence Doom + Deadpool en Party Mode** -- Deadpool pour le signal rapide, Doom pour l'analyse profonde. Les deux parlent, et ils peuvent etre en desaccord.
5. **Format de sortie structure avec verdict en tete** -- pour que le livrable de Doom soit actionnable, pas un mur de texte.

### Ce que cette spec ne recommande PAS

- Ne pas mettre Doom partout. Sa valeur vient de sa rarete et de sa profondeur.
- Ne pas supprimer Deadpool. Les deux roles sont complementaires, pas concurrents.
- Ne pas donner a Doom un pouvoir de veto. L'humain decide toujours.
