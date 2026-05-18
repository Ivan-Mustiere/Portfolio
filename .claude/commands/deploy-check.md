---
description: Checklist pré-déploiement — vérifie que tout est prêt avant de pousser en production sur ivan-mustiere.com.
---

Effectue les vérifications suivantes et rapporte un statut OK / KO pour chacune :

## Checks à effectuer

### Code
- [ ] `npm run lint` passe sans erreur
- [ ] `npm run build` termine sans erreur
- [ ] Aucun `console.log` de debug dans `app/` et `docker-backend/`

### Environnement
- [ ] `.env` existe à la racine avec `DOCKER_BACKEND_SECRET` défini et différent de `change-me`
- [ ] `docker-backend/.env` existe avec `BACKEND_SECRET` correspondant
- [ ] `DOCKER_BACKEND_URL` pointe vers l'URL VPS de production (pas `localhost`)

### Docker
- [ ] `docker compose build` réussit pour les deux services
- [ ] Les deux Dockerfiles utilisent `node:20-alpine`
- [ ] `docker-backend/server.js` : chaque conteneur démo a les 5 contraintes de sécurité

### Git
- [ ] Aucun fichier sensible suivi (`.env`, `*.pem`, credentials)
- [ ] Branche à jour avec `main`

### SEO & accessibilité
- [ ] `app/layout.js` a un `<title>` et une `<meta name="description">` pour Ivan Mustière
- [ ] Toutes les images `next/image` ont un `alt` non vide

Résume les résultats avec un tableau ✅ / ❌ et liste les actions correctives nécessaires.
