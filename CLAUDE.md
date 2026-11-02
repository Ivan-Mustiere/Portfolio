# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Professional portfolio for Ivan Mustière, hosted at **ivan-mustiere.com**.  
Key feature: visitors can launch live Docker containers to interact with showcased projects directly in the browser.

## Stack

- **Frontend / API routes**: Next.js 16 (JavaScript) + React 19 + Tailwind CSS — App Router
- **Déploiement**: Docker Compose sur VPS (ou Vercel pour le frontend seul)
- **Docker backend**: `docker-backend/` — Node.js + Express, accède au daemon Docker via socket monté

## Architecture

```
/                         — Next.js frontend
  app/                    — App Router pages et layouts
  app/api/                — API routes (proxy vers docker-backend, secrets côté serveur)
  public/                 — assets statiques
  Dockerfile              — build multi-stage standalone Next.js

docker-backend/           — API de gestion des conteneurs démo
  server.js               — Express, pilote `docker compose` via la CLI (execFile)
  test/                   — tests node:test (`npm test`)
  Dockerfile

docker-compose.yml        — orchestre frontend + docker-backend

projets/<id>/             — une démo = docker-compose.yml + portfolio.json
```

Next.js API routes agissent en proxy sécurisé : le navigateur ne parle jamais directement au backend, donc `DOCKER_BACKEND_URL` et `DOCKER_BACKEND_SECRET` restent côté serveur.

Le backend monte `/var/run/docker.sock` pour piloter Docker sur le VPS hôte : c'est l'équivalent d'un accès root. Il ne doit **jamais** publier de port (seul le frontend le joint via le réseau compose) et refuse de démarrer sans `DOCKER_BACKEND_SECRET`.

Une seule instance par projet : un second visiteur qui lance la même démo rejoint la session existante. Limites : `MAX_SESSIONS` démos simultanées, 5 lancements / 10 min par IP (IP transmise par la route Next via `x-client-ip`, lue depuis `X-Real-IP`). Au démarrage, le backend supprime les conteneurs `demo-*` orphelins.

### nginx (VPS)

Les ports des démos sont publiés sur `DEMO_BIND_IP` (passerelle docker0, `172.17.0.1` par défaut), jamais sur `0.0.0.0`, et le frontend sur `127.0.0.1:3002`. Dans la config nginx existante :
- l'upstream des `location /demo/<port>/` doit viser `172.17.0.1:<port>` (et non plus `127.0.0.1`) ;
- le `location /` vers le frontend doit transmettre l'IP client : `proxy_set_header X-Real-IP $remote_addr;` (sert au rate-limit des lancements).

## Commands

### Développement local (sans Docker)
```bash
npm run dev                        # frontend sur http://localhost:3000
cd docker-backend && npm run dev   # backend sur http://localhost:4000 (lit docker-backend/.env)
cd docker-backend && npm test      # tests backend
```

En local il n'y a pas de nginx : `app/demo/[port]/[[...path]]/route.js` proxifie `/demo/<port>/` vers le conteneur (dev uniquement, ports 20000-59999). Mettre `VPS_URL_PREFIX=http://localhost:3000` dans `docker-backend/.env`. Docker Desktop doit avoir l'intégration WSL activée, et le backend doit être relancé après l'avoir activée (groupe `docker`).

### Docker Compose (production / VPS)
```bash
cp .env.example .env               # puis remplir DOCKER_BACKEND_SECRET
docker compose up -d --build       # build et démarre tout
docker compose logs -f             # voir les logs
docker compose down                # arrêter
```

### Build individuel
```bash
docker build -t portfolio-frontend .
docker build -t portfolio-backend ./docker-backend
```

## Variables d'environnement

Copier `.env.example` → `.env` à la racine :
```
DOCKER_BACKEND_SECRET=change-me   # partagé entre frontend et backend via compose
```

En développement local, créer `.env.local` à la racine :
```
DOCKER_BACKEND_URL=http://localhost:4000
DOCKER_BACKEND_SECRET=change-me
```

## Container Security Rules

Chaque démo (`projets/<id>/docker-compose.yml`) doit :
- déclarer `mem_limit` (256m par défaut ; exception documentée : Airflow à 1536m, il ne démarre pas en dessous) et `cpus: "0.5"`
- utiliser une image à version figée (jamais `latest`)

Dans `portfolio.json`, chaque service servi sous `/demo/<port>/` doit le savoir via `env_overrides` (`{{URL}}` = URL publique avec `/` final, `{{BASE}}` = sans) — ex. `GF_SERVER_ROOT_URL={{URL}}`, `AIRFLOW__WEBSERVER__BASE_URL={{BASE}}`. `health_path` (ex. `{{PATH}}/health`) est l'URL HTTP sondée pour déclarer la démo prête : un simple test TCP ne suffit pas, le proxy Docker accepte la connexion avant que l'appli n'écoute.

Le backend ajoute automatiquement via un fichier override :
- ports publiés sur `DEMO_BIND_IP` uniquement
- réseau sans NAT sortant (`enable_ip_masquerade: false`) : pas d'accès Internet, mais le port publié reste joignable (`NetworkMode: none` empêcherait toute publication de port)
  - ⚠️ Inefficace sous Docker Desktop (WSL/Mac), dont la VM fait son propre NAT : l'isolation ne vaut que sur un Docker Linux natif (VPS). Vérifier après déploiement :
    `docker exec <conteneur-demo> wget -q -T 5 -O /dev/null https://example.com && echo "FUITE" || echo "bloqué"`
- `pids_limit: 256` et `no-new-privileges`
- TTL de 15 min (3 prolongations max), puis `docker compose down -v`
