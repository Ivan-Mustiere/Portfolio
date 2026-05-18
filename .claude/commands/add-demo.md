---
description: Scaffolde une nouvelle démo Docker interactive (Dockerfile, API backend, composant UI de lancement).
---

Délègue immédiatement à l'agent `demo-builder` pour scaffolder la démo.

## Ce que l'agent fera

1. Demander le nom du projet démo et le programme à containeriser
2. Créer `demos/<nom>/Dockerfile` avec les contraintes de sécurité obligatoires
3. Ajouter la config dans `docker-backend/server.js`
4. Créer la route API proxy dans `app/api/demos/<nom>/route.js`
5. Créer le composant UI dans `app/components/demos/<nom>/DemoLauncher.js`

## Rappel sécurité

Chaque démo doit tourner avec : 256 MB RAM max, 50% CPU max, réseau désactivé, TTL 15 min.
