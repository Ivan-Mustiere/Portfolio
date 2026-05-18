---
description: Ajoute un nouveau projet au portfolio. Crée la page projet, le composant carte, et met à jour la liste des projets.
---

Aide l'utilisateur à ajouter un nouveau projet à son portfolio.

## Étapes

1. **Collecter les informations** — demande à l'utilisateur :
   - Nom du projet
   - Description courte (1-2 phrases)
   - Stack technique utilisée
   - Lien GitHub et/ou URL de démo (si dispo)
   - Y a-t-il une démo Docker interactive ? (si oui, utiliser l'agent `demo-builder`)

2. **Créer la page projet** dans `app/projects/<slug>/page.js`
   - Titre, description, stack sous forme de badges, captures d'écran si fournies
   - Bouton "Lancer la démo" si une démo Docker existe

3. **Créer ou mettre à jour** le fichier de données `app/data/projects.js` avec le nouveau projet

4. **Vérifier** que la carte du projet apparaît bien sur la page d'accueil / page projets

Utilise l'agent `portfolio-content` pour rédiger les textes si l'utilisateur n'en fournit pas.
Utilise l'agent `ui-designer` pour créer les composants visuels.
