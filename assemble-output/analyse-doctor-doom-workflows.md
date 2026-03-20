# Analyse d'opportunite : Doctor Doom dans les workflows Assemble
**Version :** 1.0 | **Date :** 2026-03-20 | **Statut :** Draft
**Auteur :** Nick Fury (Business Analyst Senior)

## Contexte

L'equipe Assemble envisage l'ajout d'un nouvel agent **Doctor Doom** -- un contrarian ultra-agressif qui demonte les raisonnements. L'equipe dispose deja de **Deadpool** (`@deadpool`), agent contrarian existant qui challenge les decisions par devil's advocacy structuree.

La question centrale n'est pas "Doctor Doom serait-il cool ?" mais **"Dans quels workflows un contrarian ultra-agressif apporte-t-il une valeur que Deadpool ne couvre pas deja ?"**

## Parties prenantes

- **Decideur** : Equipe Assemble / Jarvis (orchestrateur)
- **Utilisateurs directs** : Les 33 agents existants (qui seraient challenges par Doom)
- **Utilisateurs finaux** : Les utilisateurs des workflows qui beneficieraient (ou souffriraient) d'un challenge plus dur
- **Partie prenante silencieuse** : La vitesse d'execution -- chaque etape contrarian ajoutee allonge le workflow

## Perimetre d'analyse

**Dans le perimetre :**
- Analyse des 15 workflows existants, etape par etape
- Evaluation de la couverture de Deadpool
- Identification des cas ou un contrarian plus agressif (Doom) apporterait une valeur differenciante
- Recommandation par workflow

**Hors perimetre :**
- Definition du prompt agent de Doctor Doom (travail de @professor-x)
- Implementation technique de l'ajout
- Analyse du Party Mode (Deadpool y est deja systematiquement convoque)

---

## Profil compare : Deadpool vs Doctor Doom (hypothese)

| Dimension | Deadpool (existant) | Doctor Doom (hypothese) |
|-----------|-------------------|----------------------|
| **Posture** | Devil's advocate structure | Destruction methodique et agressive |
| **Methode** | Pre-mortem, biais cognitifs, red teaming strategique | Attaque logique brutale, stress test des fondations |
| **Ton** | Direct, provocateur mais substantie | Ultra-agressif, aucune concession |
| **Verdict** | GREEN / YELLOW / RED | Binaire : ca tient ou ca tombe |
| **Risque** | Ralentir le consensus | Paralyser la decision, demoraliser l'equipe |
| **Valeur unique** | Empecher le groupthink | Empecher la complaisance sur les sujets critiques |

---

## Analyse par workflow

### Grille de lecture

Pour chaque workflow, j'evalue :
1. **Deadpool suffit-il ?** -- La devil's advocacy structuree couvre-t-elle le besoin de challenge ?
2. **Doom serait-il utile ?** -- Un contrarian ultra-agressif apporterait-il une valeur supplementaire mesurable ?
3. **Si oui, a quelle etape ?** -- Ou exactement dans la chaine l'intervention est-elle la plus rentable ?
4. **Risque d'ajout** -- L'agressivite de Doom pourrait-elle nuire au workflow ?

---

### 1. /mvp -- MVP Launch (9 etapes)

**Etapes :** PM -> Architect + UX + Brand (parallele) -> DB -> Backend -> Frontend -> QA -> DevOps

**Deadpool suffit-il ?** NON

**Doom serait-il utile ?** OUI -- c'est le workflow numero 1 pour Doom.

**Justification :** Le MVP est le moment ou les decisions ont le plus fort effet de levier. Une mauvaise vision produit (etape 1) ou un mauvais choix d'architecture (etape 2) se propagent sur 7 etapes suivantes. Le cout de correction est exponentiel. Deadpool challenge les decisions de facon structuree, mais sur un MVP, il faut quelqu'un qui attaque les **fondations memes** du raisonnement : "Pourquoi ce produit devrait exister ?", "Qui a prouve que le marche veut ca ?", "Pourquoi cette architecture et pas une 10x plus simple ?".

**Etape recommandee :** Entre l'etape 1 (PM) et l'etape 2 (Architect). Doom intervient apres la vision produit, AVANT que l'architecture ne soit dessinee. Si la vision ne tient pas face a Doom, mieux vaut le savoir avant 8 etapes de travail.

**Risque :** MOYEN. Si Doom est trop destructeur, il peut bloquer le lancement. Mitigation : Doom doit produire un verdict actionnable, pas juste une demolition.

---

### 2. /feature -- Feature Development (6 etapes)

**Etapes :** PM -> Analyst -> Architect -> Backend -> Frontend -> QA

**Deadpool suffit-il ?** OUI, dans la majorite des cas.

**Doom serait-il utile ?** NON, sauf features structurantes.

**Justification :** Une feature classique ne justifie pas un contrarian ultra-agressif. Le cycle est court (6 etapes), le risque est contenu, et l'analyse d'impact (etape 2, Analyst -- c'est moi) identifie deja les risques. Deadpool en Party Mode suffit si on veut challenger la spec.

Exception : pour une feature qui modifie le modele de donnees, change un flux business critique, ou impacte la facturation, Doom serait pertinent apres l'etape 2 (Analyst).

**Risque :** FAIBLE, mais rapport benefice/cout insuffisant pour une feature standard.

---

### 3. /bugfix -- Bug Fix (3 etapes)

**Etapes :** QA (analyse) -> Dev Fullstack (fix) -> QA (validation)

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON.

**Justification :** Trois etapes. Le bug est reproduit, fixe, valide. Il n'y a pas de decision strategique a challenger. Ajouter un contrarian ultra-agressif dans un workflow de correction de bug est du gaspillage pur. Le risque n'est pas dans le raisonnement, il est dans l'execution.

**Risque :** INUTILE. Doom ralentirait un workflow qui doit etre rapide.

---

### 4. /review -- Code Review Pipeline (5 etapes)

**Etapes :** Dev Fullstack (resume) -> QA (qualite) -> Security (audit) -> Red Team (exploit) -> **Contrarian (Deadpool)**

**Deadpool suffit-il ?** OUI. Il est deja la en etape 5.

**Doom serait-il utile ?** DANGEREUX.

**Justification :** Ce workflow est deja le plus defensif de tout le catalogue. Il enchaine QA + Security + Red Team + Contrarian. Quatre couches de verification. Ajouter Doom par-dessus Deadpool serait de la sur-ingenierie defensive. Le risque reel n'est pas un manque de challenge -- c'est un exces de friction qui decouragerait les equipes de soumettre du code a la review.

De plus, Deadpool en etape 5 a acces a TOUS les rapports precedents (QA, Security, Red Team) -- il a deja le contexte maximal pour challenger.

**Risque :** ELEVE. Deux contrarians dans un meme workflow = paralysie analytique.

---

### 5. /security -- Security Audit (5 etapes)

**Etapes :** Security (blue team) -> Red Team (pentest) -> Backend (remediation) -> DevOps (hardening) -> Legal (compliance)

**Deadpool suffit-il ?** OUI, mais pas pour les memes raisons.

**Doom serait-il utile ?** NON.

**Justification :** Ce workflow a deja un **adversaire structurel** : Microchip (Red Team, etape 2). Le Red Team EST le contrarian technique par excellence -- il attaque ce que le Blue Team a defendu. Ajouter un contrarian meta (Doom) au-dessus de deux couches de securite (Blue + Red) n'apporte rien. La securite se valide par l'exploit, pas par le debat.

**Risque :** MOYEN. Doom pourrait challenger les choix de remediation (etape 3), mais ce n'est pas son domaine de competence.

---

### 6. /seo -- SEO Content Pipeline (4 etapes)

**Etapes :** SEO technique -> Content SEO -> Copywriter -> GEO/AIO

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON.

**Justification :** Workflow court, domaine specialise (SEO). Le challenge pertinent ici est sur la strategie de mots-cles (etape 1) et la qualite du contenu (etape 3). C'est du challenge metier, pas du stress test de raisonnement. Deadpool en Party Mode est suffisant si le CMO veut un deuxieme avis.

**Risque :** FAIBLE mais inutile. Le SEO se valide par les metriques, pas par la confrontation.

---

### 7. /campaign -- Marketing Campaign (8 etapes)

**Etapes :** Marketing -> Finance -> Brand -> Copywriter -> Ads + Social + PR (parallele) -> Growth

**Deadpool suffit-il ?** PARTIELLEMENT.

**Doom serait-il utile ?** OUI.

**Justification :** Une campagne marketing engage du budget reel (etape 2, Finance). Le risque financier est concret. La strategie de campagne (etape 1) et l'allocation budgetaire (etape 5, Ads) sont des decisions a fort levier. Deadpool peut challenger la strategie, mais Doom pourrait attaquer plus durement les **hypotheses de marche** : "Pourquoi cette audience et pas une autre ?", "Sur quoi repose l'hypothese de ROAS ?", "Quel est le cout de se tromper de canal ?".

**Etape recommandee :** Apres l'etape 2 (Finance). Avant que le budget soit alloue et les assets crees. Doom challenge la strategie + le budget en meme temps.

**Risque :** MOYEN. Doom ne doit pas paralyser le lancement. Mitigation : verdict en 48h max, pas de debat sans fin.

---

### 8. /sprint -- Sprint Cycle (5 etapes)

**Etapes :** Scrum -> PM -> Dev Fullstack -> QA -> DevOps

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON.

**Justification :** Le sprint est un cycle court, iteratif, avec un backlog deja priorise. Le challenge se fait en sprint planning (retrospective, etc.), pas par un agent destructeur. Doom dans un sprint serait comme un audit strategique pendant une course de vitesse -- contre-productif.

**Risque :** ELEVE. Doom bloquerait le rythme du sprint. Le sprint est un mecanisme de livraison, pas de reflexion strategique.

---

### 9. /refactor -- Tech Debt Reduction (4 etapes)

**Etapes :** Architect (inventaire) -> Dev Fullstack (plan) -> QA (tests) -> DevOps (deploiement)

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON, sauf refactoring majeur (migration de stack).

**Justification :** Le refactoring est technique. Le challenge pertinent est sur le plan de migration (etape 2), mais c'est un challenge technique, pas un stress test de raisonnement. L'Architect (etape 1) identifie deja l'impact.

Exception : sur une migration de stack (ex: monolithe vers microservices), Doom apres l'etape 1 pourrait forcer l'Architect a justifier pourquoi la migration est necessaire vs. ameliorer l'existant.

**Risque :** FAIBLE. Le refactoring a des metriques objectives (couverture de tests, dette mesuree).

---

### 10. /onboard -- Onboarding Project (4 etapes)

**Etapes :** PM (charter) -> Analyst (exigences) -> Architect (archi) -> Scrum (equipe)

**Deadpool suffit-il ?** PARTIELLEMENT.

**Doom serait-il utile ?** OUI.

**Justification :** L'onboarding est le moment ou les fondations sont posees. La vision produit (etape 1) et les exigences (etape 2 -- c'est moi) definissent TOUT ce qui suit. Si les fondations sont mauvaises, tout le projet sera bancal. Doom forcerait a repondre a : "Pourquoi ce projet et pas un autre ?", "Quelles sont les hypotheses non verifiees dans le charter ?", "Que se passe-t-il si le stakeholder principal change d'avis ?".

**Etape recommandee :** Apres l'etape 2 (Analyst). Quand les exigences et la cartographie des parties prenantes sont posees, Doom les attaque avant que l'Architect ne batisse dessus.

**Risque :** MOYEN. Ne pas laisser Doom bloquer le demarrage. L'onboarding doit avancer.

---

### 11. /release -- Release Cycle (8 etapes)

**Etapes :** Scrum -> QA -> Security -> Legal -> DevOps -> Marketing + PR (parallele) -> Customer Success

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON.

**Justification :** Le workflow de release a deja QUATRE gates de validation (QA, Security, Legal, DevOps). C'est le workflow le plus controle du catalogue. Le risque n'est pas un manque de challenge -- c'est que quelqu'un bloque la release sans raison. Doom serait un 5eme verrou sur une porte deja fermee a quadruple tour.

**Risque :** ELEVE. Doom pourrait retarder une release validee par tous les specialistes, sur la base d'un raisonnement meta deconnecte de la realite technique.

---

### 12. /hotfix -- Hotfix Release (5 etapes)

**Etapes :** QA (diagnostic) -> Security (impact) -> Dev Fullstack (patch) -> QA (validation) -> DevOps (deploiement)

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** DANGEREUX.

**Justification :** Un hotfix est une urgence. La production est en feu. Chaque minute compte. Ajouter un contrarian ultra-agressif dans un workflow d'urgence est irresponsable. Le diagnostic (etape 1) et l'evaluation de securite (etape 2) suffisent pour cadrer le risque. Le seul challenge utile serait sur la qualite du patch (etape 3), mais QA (etape 4) le fait deja.

**Risque :** CRITIQUE. Doom dans un hotfix = temps de resolution allonge en production. Inacceptable.

---

### 13. /upgrade -- Dependency Upgrade (5 etapes)

**Etapes :** Architect (audit) -> Security (CVE) -> Dev Fullstack (upgrade) -> QA (compatibilite) -> DevOps (deploiement)

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON.

**Justification :** L'upgrade de dependances est un workflow technique avec des criteres objectifs : CVE corrigees, tests qui passent, pas de regression. Il n'y a pas de decision strategique a challenger. Le risque est technique (breaking changes), pas cognitif (mauvais raisonnement).

**Risque :** FAIBLE mais inutile. Les breaking changes se detectent par les tests, pas par le debat.

---

### 14. /docs -- Documentation Sprint (5 etapes)

**Etapes :** Analyst (inventaire) -> Architect + Dev Fullstack (redaction parallele) -> Copywriter (relecture) -> DevOps (publication)

**Deadpool suffit-il ?** OUI.

**Doom serait-il utile ?** NON.

**Justification :** La documentation est un travail de clarification, pas de confrontation. Le Copywriter (etape 4) fait deja le travail de relecture critique. Ajouter un contrarian sur de la documentation est disproportionne.

**Risque :** FAIBLE mais absurde. On ne demolit pas un README.

---

### 15. /experiment -- Experimentation (5 etapes)

**Etapes :** PM (hypothese) -> Data (sample size) -> Dev Fullstack (implementation) -> QA (validation) -> Growth (analyse)

**Deadpool suffit-il ?** PARTIELLEMENT.

**Doom serait-il utile ?** OUI.

**Justification :** L'experimentation repose ENTIEREMENT sur la qualite de l'hypothese (etape 1). Si l'hypothese est mal formulee, biaisee ou triviale, tout le cycle est gaspille. Doom serait extremement utile pour attaquer l'hypothese : "Est-ce que tu testes vraiment ce que tu crois tester ?", "Ton critere de succes est-il manipulable ?", "Que se passe-t-il si le test est non-concluant ?".

C'est exactement le type de challenge ou Deadpool (devil's advocate generaliste) est moins pertinent que Doom (destructeur de raisonnements). L'experimentation est un acte de rigueur scientifique -- il faut un niveau de challenge au-dessus de la devil's advocacy.

**Etape recommandee :** Apres l'etape 1 (PM). Doom attaque l'hypothese et les criteres de decision AVANT que Data ne calcule le sample size et que le dev n'implemente.

**Risque :** FAIBLE. Si Doom demolit l'hypothese, c'est une victoire -- on evite un cycle complet de gaspillage.

---

## Tableau de synthese

| # | Workflow | Etapes | Deadpool suffit ? | Doom utile ? | Etape Doom | Risque d'ajout | Justification cle |
|---|----------|--------|-------------------|-------------|------------|----------------|-------------------|
| 1 | /mvp | 9 | NON | **OUI** | Apres etape 1 (PM) | Moyen | Decisions a fort levier, cout de correction exponentiel |
| 2 | /feature | 6 | OUI | Non (sauf feature critique) | -- | Faible | Cycle court, risque contenu |
| 3 | /bugfix | 3 | OUI | Non | -- | Inutile | Execution, pas strategie |
| 4 | /review | 5 | OUI | **DANGEREUX** | -- | Eleve | Deja 4 couches de verification, risque de paralysie |
| 5 | /security | 5 | OUI | Non | -- | Moyen | Red Team est deja le contrarian technique |
| 6 | /seo | 4 | OUI | Non | -- | Faible | Se valide par les metriques |
| 7 | /campaign | 8 | Partiellement | **OUI** | Apres etape 2 (Finance) | Moyen | Budget reel engage, hypotheses de marche a stresser |
| 8 | /sprint | 5 | OUI | Non | -- | Eleve | Cycle court iteratif, Doom bloquerait le rythme |
| 9 | /refactor | 4 | OUI | Non (sauf migration) | -- | Faible | Challenge technique, pas meta |
| 10 | /onboard | 4 | Partiellement | **OUI** | Apres etape 2 (Analyst) | Moyen | Fondations du projet, hypotheses non verifiees |
| 11 | /release | 8 | OUI | Non | -- | Eleve | Deja 4 gates de validation |
| 12 | /hotfix | 5 | OUI | **DANGEREUX** | -- | Critique | Urgence production, chaque minute compte |
| 13 | /upgrade | 5 | OUI | Non | -- | Faible | Criteres objectifs, pas de decision strategique |
| 14 | /docs | 5 | OUI | Non | -- | Faible | Documentation, pas confrontation |
| 15 | /experiment | 5 | Partiellement | **OUI** | Apres etape 1 (PM) | Faible | Rigueur scientifique, hypothese a detruire |

---

## Verdict global

Sur 15 workflows :
- **4 workflows ou Doom apporte une valeur reelle** : /mvp, /campaign, /onboard, /experiment
- **2 workflows ou Doom est DANGEREUX** : /review (paralysie), /hotfix (blocage en urgence)
- **9 workflows ou Deadpool suffit** : /feature, /bugfix, /security, /seo, /sprint, /refactor, /release, /upgrade, /docs

**Taux de pertinence : 4/15 = 27%.**

Ce n'est pas negligeable, mais ce n'est pas non plus un besoin transversal. Doom n'est pas un agent de workflow -- c'est un **agent de gate strategique**, a invoquer ponctuellement sur les moments ou les decisions ont un effet de levier maximal.

---

## Recommandation

### Option A : Ne pas creer Doctor Doom comme agent permanent
Renforcer Deadpool avec un **mode agressif** activable par Jarvis quand la complexite est COMPLEX et le risque HIGH. Deadpool aurait deux modes :
- Mode standard (devil's advocate structure -- actuel)
- Mode Doom (destruction methodique des fondations -- active sur demande)

**Avantage :** Pas de nouvel agent a maintenir, pas de confusion de role.
**Inconvenient :** Deadpool porte deux casquettes, risque de dilution.

### Option B : Creer Doctor Doom comme agent optionnel (RECOMMANDE)
Doom existe mais n'est dans AUCUN workflow par defaut. Jarvis l'invoque en tant qu'etape optionnelle sur les 4 workflows identifies (/mvp, /campaign, /onboard, /experiment), uniquement quand la complexite est COMPLEX.

**Avantage :** Separation claire des roles. Deadpool = devil's advocate quotidien. Doom = stress test strategique ponctuel.
**Inconvenient :** Un agent de plus a maintenir, rarement utilise.

### Option C : Creer Doctor Doom et l'integrer dans les workflows
Doom est ajoute comme etape dans les 4 workflows identifies.

**Avantage :** Systematique, pas d'oubli.
**Inconvenient :** Ajoute une etape obligatoire meme quand le MVP est trivial ou la campagne est petite. Sur-ingenierie.

**Ma recommandation : Option B.** Doom optionnel, invoque par Jarvis sur signal de complexite. Il ne doit jamais etre dans un workflow par defaut.

---

## Hypotheses

| ID | Hypothese | Impact si fausse |
|----|-----------|-----------------|
| H1 | Deadpool ne change pas de comportement (reste devil's advocate structure) | Si Deadpool est renforce, Doom devient redondant |
| H2 | Doom sera effectivement plus agressif que Deadpool, pas juste un doublon | Si meme posture, zero valeur ajoutee |
| H3 | L'utilisateur ne sera pas derange par un agent qui demolit ses idees | Si l'utilisateur rejette Doom, l'agent est mort-ne |
| H4 | Jarvis saura identifier correctement quand invoquer Doom | Si Jarvis le convoque trop souvent, fatigue ; pas assez, inutile |

## Risques

| ID | Risque | Criticite | Mitigation |
|----|--------|-----------|------------|
| R1 | Doom et Deadpool produisent des outputs contradictoires entre eux | Majeur | Sequencer : Deadpool d'abord, Doom ensuite (Doom a acces au rapport de Deadpool) |
| R2 | Doom bloque systematiquement les decisions | Critique | Doom doit produire un verdict binaire avec justification, pas un veto |
| R3 | Les agents se sentent "attaques" par Doom, qualite des livrables impactee | Majeur | Doom ne challenge que les livrables, jamais les agents |
| R4 | L'utilisateur confond Doom et Deadpool | Mineur | Noms, tons et outputs clairement differencies |

## Questions en suspens

1. **Quel est le seuil de complexite qui declenche Doom ?** Seulement COMPLEX, ou aussi certains MODERATE a haut risque ?
2. **Doom doit-il avoir un droit de veto formel ?** Ou seulement un avis consultatif que l'utilisateur peut ignorer ?
3. **Comment mesurer la valeur ajoutee de Doom ?** Nombre de decisions modifiees apres son intervention ? Taux de projets reussis avec/sans Doom ?
4. **Doom intervient-il dans le Party Mode ?** Si oui, en complement ou en remplacement de Deadpool ?

## Glossaire

| Terme | Definition |
|-------|-----------|
| **Contrarian** | Agent dont le role est de challenger systematiquement les decisions et propositions |
| **Devil's Advocate** | Methode de challenge structuree ou un participant argumente contre le consensus |
| **Gate strategique** | Point de decision dans un workflow ou une validation est requise avant de continuer |
| **Stress test** | Evaluation de la robustesse d'une decision en la soumettant a des conditions extremes |
| **Groupthink** | Biais de groupe ou les membres convergent vers un consensus sans examen critique |
| **Pre-mortem** | Exercice ou l'on imagine que le projet a echoue pour identifier les causes potentielles |
| **Effet de levier** | Impact disproportionne d'une decision early-stage sur tout le reste du projet |
