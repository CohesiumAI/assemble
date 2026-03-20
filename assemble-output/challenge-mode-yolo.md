# Challenge : "Mode YOLO" -- Skip toutes les validations

**Agent** : Deadpool (@deadpool) -- Agent Contrarian / Devil's Advocate
**Date** : 2026-03-20
**Sujet** : Proposition d'implementer un "mode YOLO" dans Assemble qui skip toutes les validations et fait agir les agents de maniere autonome.

---

## Proposition challengee

L'equipe Assemble propose d'ajouter un "mode YOLO" qui :
- Desactive toutes les validations utilisateur entre les etapes
- Permet aux agents d'agir de maniere autonome de bout en bout
- Skip les decision gates de la gouvernance
- Elimine les phases de validation spec -> plan -> tasks -> implement
- Fait tourner le workflow complet sans interruption humaine

---

## Hypotheses implicites identifiees

### 1. "Les agents produisent des livrables de qualite suffisante sans supervision"

**Faux.** Toute la methodologie spec-driven existe PRECISEMENT parce que les agents IA ont des biais structurels : hallucinations, sur-generalisation, divergence progressive par rapport a l'intention utilisateur. L'ORCHESTRATOR.md dit explicitement : "Do not skip a workflow step without explicit user agreement". Ce n'est pas une suggestion. C'est un anti-pattern identifie et documente.

Les LLM ne "comprennent" pas l'intention -- ils l'approximent. Plus la chaine est longue sans correction humaine, plus l'approximation derive. Agent 1 produit un spec.md avec une interpretation legere du besoin. Agent 2 construit un plan.md sur cette interpretation. Agent 3 decoupe en taches. Agent 4 implemente. A chaque etape, l'erreur se compose. C'est de la propagation d'erreur classique, et on le sait depuis le premier cours d'analyse numerique.

### 2. "Les validations sont un cout, pas une valeur"

**Dangereux.** Les validations sont le mecanisme principal de correction d'erreur du systeme. Les retirer, c'est comme retirer les freins d'une voiture parce que "ca ralentit". Oui, ca ralentit. C'est le but. Le systeme de gouvernance (governance.md) definit trois niveaux de risque -- LOW, MEDIUM, HIGH -- avec des controles proportionnels. Ce n'est pas du bureaucratisme, c'est du risk management.

### 3. "L'utilisateur peut corriger apres coup"

**Beaucoup plus cher.** Le cout de correction augmente exponentiellement avec le nombre d'etapes executees sans validation. Corriger un spec.md, c'est modifier un document. Corriger apres implementation complete, c'est potentiellement tout refaire. C'est le principe fondamental du shift-left : detecter les erreurs tot coute 10x moins que les detecter tard.

### 4. "Ca va faire gagner du temps"

**Pas necessairement.** Si le mode YOLO produit des livrables inutilisables 30% du temps, le temps "gagne" est mange par les iterations de correction. Et on ne sait meme pas quel est le taux d'echec reel sans validation, parce que personne ne l'a mesure. On propose de supprimer les controles sans avoir de donnees sur la frequence des erreurs que ces controles rattrapent.

### 5. "Ca marche pour les taches simples, donc ca marchera pour les taches complexes"

**Non.** Le systeme gere deja les taches simples sans friction : les taches TRIVIAL n'ont aucun gate de validation, l'agent agit directement. Le mode YOLO est donc redondant pour le cas trivial et dangereux pour le cas complexe. Le seul espace ou il pourrait avoir du sens, c'est MODERATE -- et on y reviendra.

---

## Points de faiblesse

### 1. Responsabilite : zero accountability

**Faille critique.** Quand l'utilisateur valide a chaque etape, il y a un contrat implicite : "j'ai vu ca, j'approuve, on continue". En mode YOLO, qui est responsable quand l'agent produit quelque chose de faux ?

- L'agent ? Il n'a pas de conscience ni de responsabilite.
- L'utilisateur ? Il n'a rien valide, il ne peut pas etre tenu responsable de ce qu'il n'a pas vu.
- Le systeme Assemble ? On entre dans un probleme de liability non trivial.

Concretement : un `/release` en mode YOLO qui deploie du code bugge en production. Qui explique au client pourquoi ? "On a active le mode YOLO" n'est pas une reponse acceptable en contexte professionnel. L'ORCHESTRATOR.md dit : "Do not launch all agents in parallel without respecting dependencies." Le mode YOLO est philosophiquement incompatible avec cette regle.

### 2. Contradiction directe avec governance: strict et governance: standard

**Faille structurelle.** Le fichier `.assemble.yaml` du projet definit `governance: "standard"`. La gouvernance standard exige :
- Decision gates obligatoires pour MODERATE et COMPLEX
- Risk assessment pour les workflows HIGH
- Quality checkpoint pour les workflows 4+ etapes
- "Every gate requires explicit user approval before proceeding. Do not skip gates."

Le mode YOLO contredit CHAQUE LIGNE de governance.md. C'est une contradiction directe dans le systeme. Deux options, aucune bonne :

**Option A** : YOLO override la governance. Alors pourquoi avoir une governance ? Si n'importe quel utilisateur peut la contourner avec un flag, elle ne sert a rien. C'est un theatre de securite.

**Option B** : YOLO est incompatible avec governance: standard/strict. Alors il ne fonctionne qu'avec `governance: none`. Mais les projets configures en `governance: none` ont deja des workflows peu contraignants. L'espace utile du mode YOLO se reduit a presque rien.

En profil "enterprise" (c'est le profil actuel), proposer un mode qui bypass la gouvernance, c'est un signal contradictoire : "on prend la gouvernance au serieux, sauf quand on ne la prend pas au serieux."

### 3. Effet de cliquet : erosion progressive de la methodologie

**Faille insidieuse.** Si le mode YOLO existe, voici ce qui va se passer (c'est de la psychologie organisationnelle basique) :

1. Les gens l'utilisent "juste pour les trucs simples"
2. Ca marche (parce que les trucs simples marchent de toute facon)
3. Ils l'utilisent pour les trucs moyens ("la derniere fois ca a marche")
4. Ca marche parfois, echoue parfois, mais le temps gagne quand ca marche renforce le comportement
5. Ils l'utilisent pour tout ("les validations c'est pour les debutants")
6. Quand ca casse, ils blament le systeme, pas leur utilisation du mode YOLO

C'est l'effet de normalisation de la deviance (Diane Vaughan, reference : la catastrophe de Challenger). On habitue les utilisateurs a ignorer les garde-fous, et quand le garde-fou est necessaire, le reflexe est deja perdu.

La methodologie spec-driven devient du dead code : documentee, jamais executee. Et le jour ou quelqu'un essaie de l'appliquer, l'equipe la percoit comme de la friction inutile plutot que comme de la rigueur necessaire.

### 4. Cascade d'erreurs non detectees

**Faille technique.** La sequence Spec-Driven (Phase 1 a 5) est un pipeline ou chaque phase consomme les outputs de la precedente. Sans validation :

```
spec.md (erreur de scope)
  -> plan.md (architecture basee sur le mauvais scope)
    -> tasks.md (taches qui implementent le mauvais plan)
      -> code (implementation correcte du mauvais besoin)
```

Le resultat : un livrable techniquement propre qui ne repond pas au besoin. C'est le pire scenario, parce que tout a l'air de fonctionner mais rien n'est utile. L'utilisateur decouvre le probleme au moment de la livraison, quand le cout de correction est maximal.

### 5. Incompatibilite avec le cross-session memory

Le systeme de memoire (`memory: true`) enregistre les decisions cles. En mode YOLO, quelles "decisions" sont enregistrees ? L'agent a "decide" tout seul. La memoire sera remplie de decisions que personne n'a prises consciemment, polluant le contexte des sessions futures avec des faux positifs de validation.

---

## Alternatives non considerees

### 1. "Fast Track" au lieu de "YOLO"

Au lieu de SUPPRIMER les validations, les ALLEGER pour les taches MODERATE :
- Validation asynchrone : l'agent continue mais marque un checkpoint ou l'utilisateur PEUT intervenir
- Validation par exception : "je continue sauf si tu m'arretes dans les 30 secondes"
- Batch validation : grouper les validations au lieu de les faire une par une

Cela preserve la governance tout en reduisant la friction percue.

### 2. Profils de confiance par workflow

Les workflows LOW risk (/bugfix, /review, /docs) n'ont deja presque pas de friction. Au lieu d'un mode global YOLO, affiner la granularite :
- `/bugfix` : execution directe, rapport post-action (deja prevu par governance.md)
- `/feature` : spec.md auto-genere + un seul point de validation avant implementation
- `/release` : TOUJOURS la sequence complete. Pas negociable.

### 3. Ameliorer la vitesse des validations, pas les supprimer

Si le vrai probleme est "les validations sont lentes", le mode YOLO est le mauvais traitement pour le bon diagnostic. Solutions alternatives :
- Validations plus concises (resume en 3 points au lieu d'un document de 2 pages)
- Validations avec suggestion : "voici ce que je propose, taper 'ok' pour continuer"
- Auto-validation pour les etapes a faible risque, validation manuelle pour les etapes critiques

### 4. Mode "dry run"

L'agent execute tout le workflow mais ne produit rien de definitif -- il genere un preview complet que l'utilisateur valide EN UNE FOIS a la fin. C'est du YOLO avec un filet. Le cout de correction est divise par deux parce qu'on ne deploie rien avant validation.

---

## Biais cognitifs detectes

### Confirmation bias
On veut aller vite, donc on cherche des raisons de supprimer les validations. On ne cherche pas les raisons pour lesquelles les validations existent. Personne n'a demande : "combien de fois les validations ont-elles detecte une erreur ?" avant de proposer de les supprimer.

### Planning fallacy
On surestime le temps gagne par le mode YOLO et on sous-estime le temps perdu en corrections quand le YOLO produit du mauvais travail. Le gain est visible et immediat (pas de validation = plus rapide). Le cout est invisible et differe (erreur detectee plus tard = beaucoup plus cher).

### Bandwagon effect
"Tous les outils IA proposent un mode autonome" -- oui, et la plupart sont des demos qui ne tournent pas en production. Vibe coding, agentic workflows autonomes, "just let the AI do it" : c'est le hype cycle. On n'est pas oblige de suivre la mode si la mode est dangereuse.

### Sunk cost (inverse)
On a construit une methodologie spec-driven robuste, mais au lieu de l'ameliorer, on propose de la contourner. C'est un inverse sunk cost : on abandonne l'investissement au lieu de l'optimiser.

### Dunning-Kruger (au niveau systeme)
Les agents IA sont confiants dans leurs outputs. Toujours. Un LLM ne dit jamais "je ne suis pas sur". Cette confiance structurelle signifie que sans validation externe, il n'y a AUCUN mecanisme interne de detection d'erreur. Le mode YOLO retire le seul mecanisme de detection qui reste : l'humain.

---

## Scenario worst case

**Contexte** : Un utilisateur active le mode YOLO sur un `/release` pour une application enterprise en production.

**Deroulement** :
1. L'agent genere un plan de release base sur sa comprehension du codebase
2. Sans validation, il selectionne les mauvaises branches a merger (hallucination partielle sur les noms de branches)
3. L'agent de QA (@hawkeye) genere des tests mais les base sur le plan incorrect -- les tests passent parce qu'ils testent la mauvaise chose
4. L'agent DevOps (@thor) deploie en production
5. La release inclut du code non teste, une migration de base de donnees incorrecte, et casse une API utilisee par 3 clients
6. L'incident est detecte 2 heures plus tard par un client
7. Le rollback echoue parce que la migration de BDD est irreversible (personne n'a valide le rollback plan puisqu'il n'y en avait pas -- la gouvernance a ete skippee)

**Impact** : downtime, perte de donnees, perte de confiance client, penalites contractuelles potentielles.

**Cause racine** : chaque etape avait l'air correcte individuellement. L'erreur s'est propagee parce qu'aucun humain n'a regarde l'ensemble. Le mode YOLO a transforme un workflow securise en pipeline aveugle.

Et le plus beau : l'audit trail (`_manifest.yaml`) montrera que toutes les etapes sont en statut "completed". Personne ne saura OU l'erreur a commence sans une investigation manuelle complete.

---

## Le VRAI besoin derriere "YOLO"

Arretons-nous une seconde. Pourquoi quelqu'un veut un mode YOLO ? Deux hypotheses :

### Hypothese A : "Je veux aller vite"

Si c'est ca, la solution n'est pas de supprimer les validations mais de les rendre plus rapides. Le probleme n'est pas la validation, c'est la friction de la validation. Solutions :
- One-click approval ("ok" au lieu de lire 3 pages)
- Validation groupee (un seul checkpoint au lieu de 4)
- Defaults intelligents (pre-remplir les decisions, l'utilisateur ne corrige que les divergences)

### Hypothese B : "Les validations sont trop lourdes pour ce que je fais"

Si c'est ca, le probleme est dans la classification de complexite. Si une tache MODERATE exige trop de validation, c'est que le curseur TRIVIAL/MODERATE est mal place. Solutions :
- Elargir la categorie TRIVIAL
- Creer une categorie MODERATE-LIGHT avec validation allegee
- Permettre a l'utilisateur de downgrader la complexite ("traite ca comme TRIVIAL")

### Hypothese C : "Je fais confiance a l'IA"

Si c'est ca, c'est un probleme d'education. La confiance dans l'IA devrait etre proportionnelle et conditionnelle, pas absolue. Un utilisateur qui "fait confiance a l'IA" au point de ne jamais valider ne comprend pas les limites du systeme. Le mode YOLO renforce cette incomprehension au lieu de la corriger.

### Verdict sur le besoin reel

Dans les trois cas, le mode YOLO est la MAUVAISE reponse. C'est comme proposer de supprimer les ceintures de securite parce que les gens trouvent ca inconfortable. La bonne reponse, c'est de rendre les ceintures plus confortables.

---

## Verdict

**ROUGE** -- La proposition a des failles critiques.

Le mode YOLO tel que propose :

1. **Contredit directement** la governance standard/strict qui est la configuration actuelle du projet
2. **Supprime le seul mecanisme de detection d'erreur** (validation humaine) dans un systeme ou les agents n'ont aucune capacite d'auto-correction fiable
3. **Cree un precedent dangereux** d'erosion progressive de la methodologie (normalisation de la deviance)
4. **N'adresse pas le vrai besoin** qui est la reduction de friction, pas la suppression de controle
5. **Expose a des scenarios catastrophiques** sur les workflows HIGH risk sans aucun filet

### Ce que je recommande a la place

Si l'equipe veut reduire la friction sans sacrifier la qualite :

1. **Implementer un mode "Fast Track"** : validations allegees, pas supprimees
2. **Affiner la granularite des profils de risque** : plus de niveaux, controles proportionnels
3. **Mesurer d'abord** : avant de changer quoi que ce soit, tracker combien de fois les validations detectent des erreurs. Si c'est 0%, on peut alleger. Si c'est 15%, on doit garder.
4. **Mode "dry run"** : execution complete sans deploiement, validation unique en fin de pipeline

Le mode YOLO n'est pas une feature. C'est une dette de gouvernance deguisee en productivite.

---

*"Le vrai courage, c'est pas d'appuyer sur le bouton sans regarder. C'est de regarder, voir que c'est de la merde, et le dire avant que ca explose."* -- Deadpool, probablement.
