---
name: deploy-check
version: 1.0.0
description: "Checklist pré-déploiement pour ivan-mustiere.com — vérifie code, env, Docker, git et SEO. Utiliser quand : l'utilisateur dit 'prêt à déployer', 'check avant deploy', 'on pousse en prod'."
trigger: /deploy-check
---

# /deploy-check — Checklist pré-déploiement

Vérifie que tout est prêt avant de pousser sur ivan-mustiere.com. Exécute chaque check et rapporte ✅ ou ❌.

---

## Check 1 — Code

```bash
cd /home/van-pc_ivan/Portfolio && npm run lint 2>&1
```
✅ Aucune erreur ESLint  
❌ Lister les fichiers et règles en erreur

```bash
cd /home/van-pc_ivan/Portfolio && npm run build 2>&1 | tail -20
```
✅ Build termine avec succès  
❌ Afficher l'erreur complète

```bash
grep -r "console\.log" /home/van-pc_ivan/Portfolio/app /home/van-pc_ivan/Portfolio/docker-backend --include="*.js" -l 2>/dev/null
```
✅ Aucun fichier retourné  
❌ Lister les fichiers avec console.log de debug

---

## Check 2 — Variables d'environnement

```bash
[ -f /home/van-pc_ivan/Portfolio/.env ] && echo "OK" || echo "MANQUANT"
grep -q "change-me" /home/van-pc_ivan/Portfolio/.env 2>/dev/null && echo "SECRET PAR DEFAUT" || echo "OK"
grep "DOCKER_BACKEND_URL" /home/van-pc_ivan/Portfolio/.env 2>/dev/null | grep -q "localhost" && echo "POINTE LOCALHOST" || echo "OK"
```

✅ `.env` existe, secret modifié, URL pointe vers le VPS  
❌ Corriger avant de continuer

```bash
[ -f /home/van-pc_ivan/Portfolio/docker-backend/.env ] && echo "OK" || echo "MANQUANT"
```

---

## Check 3 — Docker

```bash
cd /home/van-pc_ivan/Portfolio && docker compose build 2>&1 | tail -10
```
✅ Les deux services buildent sans erreur

Vérifier dans `docker-backend/server.js` que chaque `createContainer` a bien les 5 contraintes :
- `Memory: 256 * 1024 * 1024`
- `CpuQuota: 50000`
- `NetworkMode: "none"`
- `AutoRemove: true`
- Timer `setTimeout` ≤ 15 min

```bash
grep -c "Memory\|CpuQuota\|NetworkMode\|AutoRemove" /home/van-pc_ivan/Portfolio/docker-backend/server.js
```
✅ Au moins 4 occurrences par bloc `createContainer`

---

## Check 4 — Git

```bash
cd /home/van-pc_ivan/Portfolio && git status --short
git log --oneline -5
```
✅ Aucun fichier sensible non commité (`.env`, `*.pem`, `*.key`)

```bash
git ls-files | grep -E "\.env$|\.pem$|\.key$|credentials"
```
✅ Aucun résultat — aucun secret traqué par git

---

## Check 5 — SEO & accessibilité

Vérifier dans `app/layout.js` :
- `<title>` contient "Ivan Mustière"
- `<meta name="description">` est définie et fait 150-160 caractères

```bash
grep -n "alt=" $(find /home/van-pc_ivan/Portfolio/app -name "*.js") | grep 'alt=""' 
```
✅ Aucune image avec `alt=""` vide

---

## Rapport final

Présenter un tableau récapitulatif :

| Check | Statut | Action requise |
|-------|--------|----------------|
| ESLint | ✅/❌ | ... |
| Build | ✅/❌ | ... |
| Variables d'env | ✅/❌ | ... |
| Docker build | ✅/❌ | ... |
| Sécurité conteneurs | ✅/❌ | ... |
| Secrets git | ✅/❌ | ... |
| SEO | ✅/❌ | ... |

Si tous ✅ → "Prêt pour `git push` et `docker compose up -d --build` sur le VPS."  
Sinon → lister les actions correctives par ordre de priorité.
