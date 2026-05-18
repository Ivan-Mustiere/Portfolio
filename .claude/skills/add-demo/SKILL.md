---
name: add-demo
version: 1.0.0
description: "Scaffolde une démo Docker interactive complète (Dockerfile, API backend, route Next.js, composant UI). Utiliser quand : l'utilisateur dit 'ajoute une démo', 'démo Docker', 'intègre une démo interactive'."
trigger: /add-demo
---

# /add-demo — Scaffolder une démo Docker interactive

Crée tous les fichiers nécessaires pour qu'un visiteur puisse lancer un conteneur démo depuis le portfolio.

---

## ⚠️ Règles de sécurité — NON NÉGOCIABLES

Chaque conteneur démo DOIT avoir ces 5 contraintes dans `dockerode` :

```js
HostConfig: {
  Memory: 256 * 1024 * 1024,  // 256 MB max
  CpuQuota: 50000,              // 50% d'un cœur
  NetworkMode: "none",          // zéro accès réseau
  AutoRemove: true,             // nettoyage auto
}
// + timer kill après 15 min max
setTimeout(() => container.stop().catch(() => {}), 15 * 60 * 1000)
```

Ne jamais utiliser `--privileged`, monter des volumes hôte, ou exposer des ports hôte.

---

## Étape 1 : Collecter les informations

Demander en une seule fois si non fourni :

```
- Slug du projet (doit correspondre à un projet dans app/data/projects.js)
- Image Docker à utiliser (nom:tag) ou programme à containeriser
- Le conteneur expose-t-il un port HTTP ? (oui → port:XXXX / non → affichage logs)
- Durée max de la démo ? (défaut : 15 min)
```

---

## Étape 2 : Créer le Dockerfile de la démo

```
demos/<slug>/Dockerfile
```

Exemple minimal :

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
EXPOSE 8080
CMD ["node", "index.js"]
```

---

## Étape 3 : Enregistrer la démo dans le backend

Dans `docker-backend/server.js`, ajouter au tableau `demos` :

```js
const DEMOS = [
  {
    id: "<slug>",
    image: "demo-<slug>",   // nom de l'image buildée
    port: 8080,             // null si pas de port HTTP
  },
]
```

Mettre à jour l'endpoint `GET /demos` pour retourner ce tableau.

---

## Étape 4 : Créer la route API Next.js

```
app/api/demos/<slug>/start/route.js
```

```js
const BACKEND_URL = process.env.DOCKER_BACKEND_URL
const BACKEND_SECRET = process.env.DOCKER_BACKEND_SECRET

export async function POST() {
  const res = await fetch(`${BACKEND_URL}/demos/<slug>/start`, {
    method: "POST",
    headers: { "x-backend-secret": BACKEND_SECRET },
  })
  const data = await res.json()
  return Response.json(data)
}
```

---

## Étape 5 : Créer le composant UI

```
app/components/demos/<slug>/DemoLauncher.js
```

Comportements attendus :
- Bouton "Lancer la démo" → appelle `POST /api/demos/<slug>/start`
- Pendant le démarrage : spinner + message "Démarrage en cours…"
- Une fois lancé : iframe (si port HTTP) ou affichage des logs (si CLI)
- Compteur de temps restant visible (TTL)
- Bouton "Arrêter" pour stopper le conteneur manuellement

---

## Étape 6 : Vérification

```bash
cd /home/van-pc_ivan/Portfolio && npm run lint
```

Confirmer :
- Les 5 fichiers créés / modifiés
- Commande pour builder l'image : `docker build -t demo-<slug> ./demos/<slug>/`
- Rappeler de mettre `hasDockerDemo: true` dans `app/data/projects.js` pour ce projet
