# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Professional portfolio for Ivan Mustière, hosted at **ivan-mustiere.com**.  
Key feature: visitors can launch live Docker containers to interact with showcased projects directly in the browser.

## Stack

- **Frontend / API routes**: Next.js 15 (JavaScript) + Tailwind CSS — App Router
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
  server.js               — Express + dockerode
  Dockerfile

docker-compose.yml        — orchestre frontend + docker-backend
```

Next.js API routes agissent en proxy sécurisé : le navigateur ne parle jamais directement au backend, donc `DOCKER_BACKEND_URL` et `DOCKER_BACKEND_SECRET` restent côté serveur.

Le backend monte `/var/run/docker.sock` pour piloter Docker sur le VPS hôte.

## Commands

### Développement local (sans Docker)
```bash
npm run dev                        # frontend sur http://localhost:3000
cd docker-backend && npm run dev   # backend sur http://localhost:4000
```

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

Every demo container must be created with:
- `Memory: 256 MB` max
- `CpuQuota: 50000` (50% of one core)
- `NetworkMode: "none"` (no outbound internet)
- `AutoRemove: true` + 15-minute TTL kill timer
