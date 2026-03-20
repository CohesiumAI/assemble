# Mode YOLO -- Execution Autonome sans Validation
Version : 1.0 | Date : 2026-03-20 | Statut : Draft

---

## 1. Problem Statement

### Le probleme observe

Aujourd'hui, chaque workflow Assemble est concu pour maximiser la qualite en imposant des points de validation utilisateur entre les etapes. Pour un workflow COMPLEX (ex: `/feature` -- 6 etapes, `/mvp` -- 9 etapes), l'utilisateur doit valider explicitement la sortie de chaque phase avant que Jarvis ne passe a la suivante. En gouvernance `standard`, meme les taches MODERATE imposent une validation de livrable.

Ce mecanisme est pertinent pour les equipes structurees, les projets critiques et les environnements regules. Mais il cree une **friction significative** dans trois contextes :

1. **Le developpeur senior solo** qui sait ce qu'il veut et pour qui chaque "Validez-vous avant de continuer ?" est un obstacle. Il a confiance dans le systeme et veut que Jarvis fasse tout d'une traite.

2. **Le fondateur solo en phase d'exploration** qui veut aller de l'idee au prototype le plus vite possible. La methodologie Spec-Driven (SPECIFY > PLAN > TASKS > IMPLEMENT) est trop lourde pour un prototype jetable.

3. **L'expert qui itere rapidement** -- corrections de bugs en serie, generation de contenu en batch, refactoring massif -- ou la validation manuelle de chaque livrable intermediaire tue la velocite.

### Ce que le marche fait deja

- **Claude Code** : `--dangerously-skip-permissions` -- bypass total des confirmations
- **Cursor** : mode "auto-accept" pour les suggestions de code
- **GitHub Copilot Workspace** : execution lineaire sans points d'arret

Le pattern est clair : les outils AI professionnels offrent un mode "trust me" pour les utilisateurs avances. Assemble n'en a pas.

### Hypothese

En offrant un mode d'execution autonome avec des niveaux granulaires, on peut **reduire le temps de completion des workflows de 60-80%** (en eliminant le temps d'attente inter-etapes) tout en preservant les garde-fous essentiels pour les cas critiques.

---

## 2. Utilisateurs cibles et personas

### Persona A -- "Le Dev Senior Solo" (Alex)

- Developpeur fullstack avec 10+ ans d'experience
- Travaille seul ou en tres petite equipe (2-3 personnes)
- Utilise Assemble sur des projets perso ou des side projects
- Connait la codebase par coeur, sait ce qu'il veut
- Frustration principale : "Je sais deja que la spec est bonne, laisse-moi passer a l'implementation"

### Persona B -- "Le Solo Founder" (Marie)

- Fondatrice technique en phase de validation de marche
- Prototype rapidement, jette souvent, recommence
- Utilise `/go` et `/mvp` plusieurs fois par semaine
- Frustration principale : "Je veux passer de l'idee au code en une commande, pas en 4 phases avec 3 validations"

### Persona C -- "Le Tech Lead en Sprint" (Karim)

- Tech lead dans une startup en croissance
- Gere un backlog de 20+ features et bugs
- Utilise `/bugfix` et `/feature` en batch
- Frustration principale : "J'ai 8 bugfix a lancer, je ne veux pas valider 24 livrables intermediaires"

### Persona NON-cible (mais a proteger)

- **Le dev junior** qui active YOLO sans comprendre les consequences
- **L'equipe enterprise** en gouvernance strict ou la tracabilite est une obligation legale
- **Le projet critique** (fintech, sante) ou un skip de validation peut avoir des consequences reglementaires

---

## 3. Solution proposee -- Le Mode YOLO

### 3.1 Concept

Le mode YOLO est un **modificateur de comportement de l'orchestrateur** qui reduit ou supprime les points de validation utilisateur dans les workflows. Il ne modifie pas le travail des agents ni la qualite de leurs livrables -- il modifie uniquement la **boucle de feedback** entre Jarvis et l'utilisateur.

Analogie : C'est la difference entre un pilote automatique qui demande confirmation a chaque virage (mode normal) et un qui suit la route jusqu'a destination (mode YOLO).

### 3.2 Trois niveaux de YOLO

Le mode YOLO ne doit pas etre binaire. Trois niveaux repondent aux trois personas identifees :

---

#### Niveau 1 : `yolo: soft` -- "Skip les gates, garde la methodo"

**Ce qui change :**
- Les **decision gates** (validations utilisateur entre etapes) sont supprimes
- Jarvis enchaine les etapes du workflow sans attendre de confirmation
- Le `_manifest.yaml` continue d'etre mis a jour en temps reel
- Si un output est manquant, Jarvis **alerte mais continue** (au lieu de bloquer)

**Ce qui ne change PAS :**
- La methodologie Spec-Driven reste appliquee pour les taches COMPLEX (spec.md, plan.md, tasks.md sont toujours produits)
- L'evaluation de complexite (TRIVIAL / MODERATE / COMPLEX) reste active
- Le `_summary.md` est produit en fin de workflow
- Le `_quality.md` est produit pour les workflows de 4+ etapes

**Cas d'usage typique :**
Alex lance `/feature ajout du dark mode`. Jarvis produit la spec, le plan, les taches, puis enchaine l'implementation et la QA -- le tout en une seule passe. Alex retrouve tous les livrables dans le dossier de sortie et les revoit apres coup.

**Metaphore :** Le GPS calcule toujours l'itineraire optimal, mais ne demande plus "Tournez a gauche ?" a chaque intersection.

---

#### Niveau 2 : `yolo: full` -- "Execution directe, pas de methodo"

**Ce qui change :**
- Pour les taches COMPLEX : **la methodologie Spec-Driven est bypassee**. Jarvis ne produit pas spec.md / plan.md / tasks.md separement. Il passe directement a l'execution du workflow.
- Pour les taches MODERATE : execution directe identique a `yolo: soft`
- Les validations utilisateur sont toutes supprimees
- Les outputs manquants sont loges mais ne bloquent jamais

**Ce qui ne change PAS :**
- L'evaluation de complexite est toujours faite (pour le logging/metrics)
- Le `_manifest.yaml` est toujours maintenu
- Le `_summary.md` est toujours produit
- Les agents font toujours leur travail complet individuellement

**Cas d'usage typique :**
Marie tape `/go MVP d'une app de suivi de lectures`. Jarvis ne passe pas par SPECIFY > PLAN > TASKS. Il lance directement le workflow `/mvp` : PM > Architect > UX > Brand > DB > Backend > Frontend > QA > DevOps. Chaque agent lit les outputs du precedent, produit les siens, et Jarvis enchaine sans interruption.

**Metaphore :** Plus de GPS -- on connait la route, on fonce.

---

#### Niveau 3 : `yolo: beast` -- "Un seul agent, zero overhead"

**Ce qui change :**
- Jarvis **ne decompose plus en workflow multi-agents**
- Il selectionne l'agent le plus polyvalent pour la demande (generalement `@mr-fantastic` pour le dev, `@storm` pour le contenu)
- L'agent travaille en mode monolithique : il fait tout lui-meme
- Pas de `_manifest.yaml`, pas de `_summary.md`, pas de structure de dossiers par etape
- Output direct dans `{assemble_output}/yolo_{timestamp}/`

**Ce qui ne change PAS :**
- La qualite du travail de l'agent individuel (ses instructions internes restent identiques)
- Le livrable est toujours produit dans le repertoire de sortie

**Cas d'usage typique :**
Karim a 8 bugfix a traiter. Pour chacun, il tape `/go fix le bug #1234` en mode `yolo: beast`. Au lieu de lancer un workflow QA > Dev > QA, `@mr-fantastic` analyse, corrige et valide en une seule passe.

**Metaphore :** Plus d'equipe, plus de process -- un commando solo.

---

### 3.3 Tableau comparatif des niveaux

| Comportement | Normal | `yolo: soft` | `yolo: full` | `yolo: beast` |
|---|---|---|---|---|
| Decision gates (validations) | Oui | Non | Non | Non |
| Methodologie Spec-Driven | Oui (COMPLEX) | Oui | Non | Non |
| Evaluation de complexite | Oui | Oui | Oui (log only) | Non |
| Multi-agents | Oui | Oui | Oui | Non (1 agent) |
| `_manifest.yaml` | Oui | Oui | Oui | Non |
| `_summary.md` | Oui | Oui | Oui | Non |
| `_quality.md` | Oui (4+ etapes) | Oui (4+ etapes) | Non | Non |
| Alerte outputs manquants | Bloquant | Non-bloquant | Non-bloquant | N/A |
| Governance compatible | Oui | Standard only | None only | None only |

---

## 4. User Stories

### US-01 : Activer YOLO via la configuration projet
**En tant que** developpeur qui configure un nouveau projet,
**je veux** definir le niveau de YOLO dans `.assemble.yaml`,
**afin que** tous les workflows de ce projet s'executent au niveau d'autonomie choisi par defaut.

**Criteres d'acceptation :**
- Le champ `yolo` dans `.assemble.yaml` accepte les valeurs : `off` (defaut), `soft`, `full`, `beast`
- Le generateur (`generate.js`) lit ce champ et l'injecte dans les instructions de Jarvis
- Si `yolo` n'est pas defini, le comportement est identique a `yolo: off`

**Metrique de succes :** 100% des configurations valides sont correctement parsees et appliquees.

---

### US-02 : Activer YOLO en runtime via commande
**En tant que** utilisateur en cours de session,
**je veux** pouvoir activer ou changer le niveau de YOLO par une commande,
**afin de** passer en mode autonome sans modifier la configuration du projet.

**Criteres d'acceptation :**
- La commande `/yolo` affiche le niveau actuel
- La commande `/yolo soft|full|beast` active le niveau correspondant pour la session en cours
- La commande `/yolo off` revient au mode normal
- Le changement de mode est effectif immediatement pour le prochain workflow
- Un message de confirmation indique clairement le niveau actif et ses implications

**Metrique de succes :** 90% des utilisateurs qui activent YOLO en runtime le font via la commande `/yolo` du premier coup (pas de confusion sur la syntaxe).

---

### US-03 : Execution sans interruption en mode soft
**En tant que** dev senior,
**je veux** que le workflow `/feature` s'execute de bout en bout sans me demander de validation,
**afin de** retrouver tous les livrables produits dans le dossier de sortie quand j'ai fini mon cafe.

**Criteres d'acceptation :**
- En `yolo: soft`, Jarvis enchaine toutes les etapes du workflow sequentiellement
- Chaque agent recoit le contexte complet (inputs des agents precedents)
- Le `_manifest.yaml` est mis a jour apres chaque etape
- Si un output est manquant, Jarvis log un warning dans le manifest et continue
- A la fin, Jarvis produit un `_summary.md` avec le resume complet
- Le temps total est reduit d'au moins 50% par rapport au mode normal (mesure : elimination du temps d'attente utilisateur)

**Metrique de succes :** Sur 100 workflows `/feature` en mode soft, moins de 5% echouent a cause d'un output manquant non-bloquant.

---

### US-04 : Bypass de la methodologie Spec-Driven en mode full
**En tant que** solo founder,
**je veux** que `/go MVP app de suivi fitness` lance directement le workflow sans passer par SPECIFY > PLAN > TASKS,
**afin d'** obtenir un prototype complet en une seule interaction.

**Criteres d'acceptation :**
- En `yolo: full`, une demande COMPLEX ne declenche pas les phases SPECIFY, PLAN, TASKS separement
- Jarvis passe directement au workflow le plus adapte (ex: `/mvp`)
- Le premier agent du workflow (PM) produit un brief condense (pas un spec.md complet)
- Les agents suivants s'appuient sur ce brief
- Le `_summary.md` inclut une mention "Mode YOLO full -- methodologie Spec-Driven bypassee"

**Metrique de succes :** Le temps entre la commande utilisateur et le debut de l'etape 1 du workflow est inferieur a 10 secondes (vs. 3-5 minutes en mode normal avec les phases de validation).

---

### US-05 : Execution mono-agent en mode beast
**En tant que** tech lead en sprint,
**je veux** que `/go fix le bug de pagination` soit traite par un seul agent polyvalent sans orchestration multi-etapes,
**afin de** traiter mes bugs en batch sans overhead.

**Criteres d'acceptation :**
- En `yolo: beast`, Jarvis selectionne un agent unique (selon le domaine de la demande)
- Cet agent produit ses livrables directement dans `{output_dir}/yolo_{timestamp}/`
- Pas de `_manifest.yaml`, pas de `_summary.md`
- Le mapping par defaut de l'agent beast est :
  - Dev (backend/frontend/fullstack/bug) -> `@mr-fantastic`
  - Contenu (SEO, article, blog) -> `@storm`
  - Marketing (campagne, ads) -> `@star-lord`
  - Security (audit) -> `@punisher`
  - Autre -> agent le plus pertinent selon le domain mapping existant

**Metrique de succes :** Le temps d'execution moyen d'un `/go` en mode beast est inferieur a 30% du temps du meme `/go` en mode normal.

---

### US-06 : Avertissement explicite a l'activation
**En tant que** utilisateur qui active YOLO pour la premiere fois,
**je veux** un avertissement clair sur ce que je desactive,
**afin de** prendre une decision eclairee.

**Criteres d'acceptation :**
- A la premiere activation de `/yolo soft|full|beast`, Jarvis affiche un message d'avertissement detaillant :
  - Ce qui est desactive a ce niveau
  - Les risques associes
  - Comment revenir en arriere (`/yolo off`)
- Le message n'est affiche qu'une seule fois par session (pas a chaque workflow)
- L'utilisateur peut bypasser l'avertissement avec `/yolo beast --confirm`

**Metrique de succes :** 100% des premieres activations declenchent l'avertissement. Moins de 10% des utilisateurs desactivent YOLO immediatement apres l'avertissement (signe que le message est informatif, pas effrayant).

---

### US-07 : Resume post-execution enrichi
**En tant qu'** utilisateur en mode YOLO (soft ou full),
**je veux** un resume de fin de workflow plus detaille qu'en mode normal,
**afin de** compenser l'absence de revue intermediaire.

**Criteres d'acceptation :**
- Le `_summary.md` en mode YOLO inclut une section supplementaire "Points de vigilance" avec :
  - Les outputs manquants ou incomplets
  - Les assumptions faites par les agents sans validation utilisateur
  - Les decisions architecturales prises sans approbation explicite
  - Une estimation du niveau de confiance par etape (high / medium / low)
- Format clair et scannable (tableau, pas de prose)

**Metrique de succes :** 80% des utilisateurs YOLO consultent le `_summary.md` dans les 5 minutes suivant la fin du workflow (mesuree via le comportement en session).

---

### US-08 : Compatibilite avec les profils
**En tant que** utilisateur du profil `startup`,
**je veux** que YOLO soit preconfigure a `soft` dans le profil startup,
**afin de** ne pas avoir a le configurer manuellement.

**Criteres d'acceptation :**
- Le profil `startup` definit `yolo: soft` comme defaut
- Le profil `enterprise` definit `yolo: off` comme defaut (non-overridable en strict)
- Le profil `agency` definit `yolo: off` comme defaut
- La valeur explicite dans `.assemble.yaml` surcharge toujours le profil

**Metrique de succes :** Les profils resolvent correctement les defauts YOLO dans 100% des cas.

---

## 5. Interaction avec la Governance

C'est le point de tension architecturale le plus important de cette spec. YOLO et governance sont des forces opposees par conception.

### 5.1 Matrice de compatibilite

| Governance | `yolo: off` | `yolo: soft` | `yolo: full` | `yolo: beast` |
|---|---|---|---|---|
| `none` | OK | OK | OK | OK |
| `standard` | OK | OK (gates desactives) | REFUSE | REFUSE |
| `strict` | OK | REFUSE | REFUSE | REFUSE |

### 5.2 Regles d'interaction

**Regle 1 -- Governance `none` : YOLO est libre**
Aucune restriction. Tous les niveaux sont disponibles.

**Regle 2 -- Governance `standard` : YOLO soft uniquement**
- `yolo: soft` est autorise : les decision gates sont supprimes, mais la methodologie reste intacte
- `yolo: full` est refuse : le bypass de la methodologie Spec-Driven contredit les exigences de risk assessment pour les workflows MEDIUM et HIGH
- `yolo: beast` est refuse : l'absence de `_manifest.yaml` et `_summary.md` contredit les quality checkpoints
- Si l'utilisateur tente `/yolo full` en governance `standard`, Jarvis affiche : "Le mode YOLO full est incompatible avec la governance standard de ce projet. Niveau maximum autorise : soft. Pour passer en full, modifiez la governance dans .assemble.yaml."

**Regle 3 -- Governance `strict` : YOLO totalement interdit**
- Tout niveau de YOLO est refuse
- Justification : en governance strict, l'audit trail (`_audit.md`), le RBAC et les approval logs sont des obligations. YOLO, meme en mode soft, supprime les decision gates qui alimentent l'approval log.
- Si l'utilisateur tente `/yolo` en governance `strict`, Jarvis affiche : "Le mode YOLO est incompatible avec la governance strict de ce projet. La tracabilite des validations est une obligation dans ce mode de gouvernance. Aucun niveau de YOLO n'est disponible."

### 5.3 Escalade : le flag `--force`

Pour les cas exceptionnels (debug urgent en prod sur un projet strict), un flag `--force` permet de bypasser la restriction de governance **pour un seul workflow** :

```
/yolo soft --force
```

Comportement avec `--force` :
- YOLO est active pour la prochaine commande uniquement (pas pour toute la session)
- Un warning explicite est affiche : "YOLO active en mode force. La governance {level} est temporairement suspendue pour le prochain workflow."
- En governance `strict`, le `_audit.md` enregistre : "YOLO force override -- governance suspended by user at {timestamp}"
- Apres le workflow, le mode revient automatiquement a `yolo: off`

---

## 6. UX -- Activation et desactivation

### 6.1 Via la configuration (`.assemble.yaml`)

```yaml
# .assemble.yaml
yolo: "soft"     # off | soft | full | beast
```

Le generateur injecte les instructions YOLO dans les regles de Jarvis via `renderCommandRegistry()` ou une nouvelle fonction dediee `renderYoloInstructions()`.

### 6.2 Via commande en session

| Commande | Action |
|---|---|
| `/yolo` | Affiche le niveau actuel |
| `/yolo soft` | Active le mode soft pour la session |
| `/yolo full` | Active le mode full pour la session |
| `/yolo beast` | Active le mode beast pour la session |
| `/yolo off` | Desactive YOLO, revient au mode normal |
| `/yolo soft --force` | Active soft pour un seul workflow (bypass governance) |
| `/yolo status` | Affiche le niveau actuel + restrictions governance |

### 6.3 Message de confirmation (premiere activation par session)

```
Mode YOLO active : SOFT

Ce qui change :
- Les validations intermediaires sont desactivees
- Jarvis enchaine les etapes sans attendre votre confirmation
- Les outputs manquants sont loges mais ne bloquent pas

Ce qui ne change pas :
- La methodologie Spec-Driven reste appliquee
- Tous les livrables sont produits normalement
- Le _summary.md est produit en fin de workflow

Pour revenir au mode normal : /yolo off
```

### 6.4 Indicateur visuel persistant

Pendant toute session avec YOLO actif, chaque reponse de Jarvis inclut un indicateur dans le header :

```
[YOLO:soft] Workflow /feature -- Etape 3/6 -- @architect
```

Cet indicateur rappelle a l'utilisateur que les validations sont desactivees.

---

## 7. Impact technique

### 7.1 Fichiers a modifier

| Fichier | Modification |
|---|---|
| `generator/lib/config-loader.js` | Parser le champ `yolo` depuis `.assemble.yaml` |
| `generator/lib/profiles.js` | Ajouter `yolo` aux defauts de profil |
| `generator/lib/template-engine.js` | Nouvelle fonction `renderYoloInstructions()` ; modifier `renderCommandRegistry()` pour inclure la commande `/yolo` |
| `generator/generate.js` | Propager `config.yolo` aux adaptateurs |
| `src/orchestrator/ORCHESTRATOR.md` | Nouvelle section "Mode YOLO" documentant le comportement par niveau |
| Tous les adaptateurs (20+) | Passer `config.yolo` dans les regles generees |
| `.assemble.yaml` (template) | Ajouter le champ `yolo: "off"` |

### 7.2 Nouvelle fonction dans template-engine.js

```javascript
function renderYoloInstructions(config) {
  if (!config.yolo || config.yolo === 'off') return '';
  // ... generer les instructions selon le niveau
}
```

### 7.3 Validation governance <> YOLO dans generate.js

```javascript
// Validate yolo <> governance compatibility
if (config.governance === 'strict' && config.yolo && config.yolo !== 'off') {
  console.warn('YOLO is incompatible with strict governance. Setting yolo: off.');
  config.yolo = 'off';
}
if (config.governance === 'standard' && ['full', 'beast'].includes(config.yolo)) {
  console.warn(`YOLO ${config.yolo} is incompatible with standard governance. Downgrading to soft.`);
  config.yolo = 'soft';
}
```

---

## 8. Risques produit et mitigations

### Risque 1 -- CRITIQUE : Utilisateur junior en YOLO beast sur un projet critique

**Scenario :** Un dev junior active `yolo: beast` sur le repo principal de l'entreprise. Un seul agent produit une architecture sans review. Le code est mauvais, non-teste, et pousse en prod.

**Probabilite :** Moyenne (si YOLO est facile a activer)
**Impact :** Eleve (dette technique, bugs en production, perte de confiance dans l'outil)

**Mitigations :**
1. En governance `standard` ou `strict`, les niveaux `full` et `beast` sont refuses (voir section 5)
2. L'avertissement a la premiere activation est obligatoire et detaille les risques
3. Le `_summary.md` enrichi en mode YOLO souligne explicitement les decisions non-validees
4. Documentation claire dans le README : "YOLO beast est reserve aux utilisateurs experimentes sur des projets non-critiques"

---

### Risque 2 -- MODERE : Qualite degradee des livrables sans feedback loop

**Scenario :** En mode normal, quand un agent produit un livrable faible, l'utilisateur le detecte a la validation et demande une correction. En mode YOLO, le livrable faible est consomme par l'agent suivant, qui construit sur une base fragile. Effet cascade.

**Probabilite :** Elevee (certains agents sont plus fiables que d'autres)
**Impact :** Modere (livrables a refaire, mais pas de dommage irreversible)

**Mitigations :**
1. En `yolo: soft` et `full`, le `_summary.md` enrichi inclut un "niveau de confiance" par etape
2. Si un agent detecte que son input est incoherent, il log un warning dans son output (ce comportement existe deja)
3. Phase 2 (post-MVP) : introduire un systeme de "quality score" automatique qui peut auto-stopper le workflow si le score descend sous un seuil

---

### Risque 3 -- MODERE : Confusion des modes entre sessions

**Scenario :** L'utilisateur active `yolo: beast` en session, oublie, et la session suivante il est surpris que les workflows ne fonctionnent pas "normalement".

**Probabilite :** Moyenne
**Impact :** Faible (confusion, pas de dommage)

**Mitigations :**
1. YOLO active via `/yolo` est **session-scoped** -- il se reinitialise a la valeur de `.assemble.yaml` a chaque nouvelle session
2. L'indicateur visuel `[YOLO:level]` est present sur chaque reponse
3. La commande `/yolo status` permet de verifier a tout moment

---

### Risque 4 -- FAIBLE : Le mode YOLO devient la norme et la qualite globale baisse

**Scenario :** Les equipes adoptent YOLO par defaut parce que "c'est plus rapide", meme sur des projets qui beneficieraient de la methodologie structuree.

**Probabilite :** Moyenne a long terme
**Impact :** Faible a modere (baisse progressive de qualite, difficilement mesurable)

**Mitigations :**
1. YOLO n'est pas le defaut dans aucun profil sauf `startup` (et encore, seulement en `soft`)
2. Les metrics (`_metrics.md`) pourraient a terme comparer la qualite des workflows YOLO vs. normaux
3. La documentation positionne clairement YOLO comme un choix contextuel, pas une recommandation

---

### Risque 5 -- FAIBLE : Incoherence des livrables en mode beast

**Scenario :** En mode beast, un seul agent fait le travail de 6. Le resultat est forcement moins specialise. Un `@mr-fantastic` qui fait du backend, du frontend et de la QA produit un travail "correct" mais pas aussi pousse que 3 agents specialises.

**Probabilite :** Certaine (c'est un compromis accepte)
**Impact :** Faible (l'utilisateur de `beast` a accepte ce compromis)

**Mitigations :**
1. L'avertissement a l'activation de `beast` mentionne explicitement ce compromis
2. Le mode `beast` est positionne pour les taches simples/moyennes, pas pour les projets ambitieux
3. Les instructions de `@mr-fantastic` (et des autres agents beast) incluent un rappel de leurs limites

---

## 9. Metriques de succes globales

| Metrique | Objectif | Comment mesurer |
|---|---|---|
| Adoption du mode YOLO | 30% des utilisateurs l'activent dans les 30 jours post-launch | Presence du champ `yolo` != `off` dans les `.assemble.yaml` collectees (opt-in telemetry) |
| Reduction du temps de workflow | -60% en soft, -75% en full, -85% en beast | `_metrics.md` : comparaison des durees avant/apres |
| Taux de completion sans erreur | > 95% en soft, > 90% en full, > 85% en beast | `_manifest.yaml` : ratio steps completed / steps total |
| Consultation du summary post-YOLO | > 80% des utilisateurs YOLO lisent le `_summary.md` | Heuristique : l'utilisateur mentionne un element du summary dans son message suivant |
| Pas de regression qualite | NPS produit stable (> 40) | Enquete utilisateur trimestrielle |
| Zero incident governance bypass | Aucun cas de YOLO actif en strict sans --force | Audit des `_audit.md` des projets strict |

---

## 10. Hors perimetre (v1)

Les elements suivants sont explicitement exclus du perimetre de la version 1 :

- **Quality score automatique** avec auto-stop du workflow -- Phase 2
- **YOLO par workflow** (ex: "YOLO sur /bugfix mais pas sur /release") -- Phase 2
- **YOLO par agent** (ex: "skip la validation de @pm mais pas de @security") -- Phase 2
- **Machine learning sur les patterns YOLO** (apprendre quand YOLO fonctionne bien) -- Phase 3
- **Integration avec les systemes de review externe** (GitHub PR review, etc.) -- Hors scope
- **Mode YOLO pour le Party Mode** -- Hors scope (le debat multi-agent necessite par nature de l'interaction)

---

## 11. Dependances

| Dependance | Type | Impact si absente |
|---|---|---|
| Champ `yolo` dans config-loader.js | Technique | Bloquant -- sans parsing, YOLO n'existe pas |
| Modification de template-engine.js | Technique | Bloquant -- sans injection d'instructions, Jarvis ne sait pas |
| Mise a jour des 20+ adaptateurs | Technique | Non-bloquant si template-engine.js centralise la logique |
| Section YOLO dans ORCHESTRATOR.md | Documentation | Non-bloquant mais fortement recommande |
| Tests unitaires et snapshots | Qualite | Non-bloquant pour le MVP, bloquant pour le merge |

---

## 12. Timeline estimee

| Phase | Duree | Contenu |
|---|---|---|
| Phase 0 -- Validation | 1 jour | Review de cette spec, feedback utilisateur, go/no-go |
| Phase 1 -- Core | 2-3 jours | config-loader, template-engine, renderYoloInstructions, ORCHESTRATOR.md |
| Phase 2 -- Adaptateurs | 1-2 jours | Propagation aux 20+ adaptateurs, tests snapshots |
| Phase 3 -- Commande runtime | 1 jour | Ajout de `/yolo` au command registry, gestion session-scoped |
| Phase 4 -- Tests & Docs | 1-2 jours | Tests unitaires, tests d'integration, documentation utilisateur |
| **Total estime** | **5-8 jours** | |

---

## 13. Decision log

| Decision | Alternative envisagee | Justification du choix |
|---|---|---|
| 3 niveaux (soft/full/beast) | 1 seul mode ON/OFF | Les personas ont des besoins differents ; un mode unique forcerait le compromis |
| YOLO interdit en strict | YOLO soft autorise en strict | La governance strict impose des approval logs ; YOLO supprime les gates qui les alimentent |
| Session-scoped par defaut | Persistent | Eviter qu'un utilisateur oublie qu'il est en YOLO |
| `--force` pour bypass governance | Pas de bypass possible | Cas d'urgence legitimes (hotfix prod en governance standard) |
| `beast` = mono-agent | `beast` = workflow accelere | Le vrai gain de vitesse vient de l'elimination de l'orchestration, pas juste des validations |

---

*Document produit par @professor-x -- Version 1.0 Draft*
*A valider avant passage en phase PLAN (@tony-stark)*
