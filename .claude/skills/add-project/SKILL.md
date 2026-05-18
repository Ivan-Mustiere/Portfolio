---
name: add-project
version: 1.0.0
description: "Ajoute un nouveau projet au portfolio d'Ivan Mustière — page projet, carte, données. Utiliser quand : l'utilisateur dit 'ajoute un projet', 'nouveau projet', 'intègre ce projet'."
trigger: /add-project
---

# /add-project — Ajouter un projet au portfolio

Scaffold complet d'un nouveau projet : fichier de données, page dédiée, et carte sur la page projets.

---

## Étape 1 : Collecter les informations

Si l'utilisateur n'a pas fourni ces infos, demande-les **en une seule fois** :

```
- Nom du projet
- Description courte (1-2 phrases)
- Stack technique (langages, frameworks, outils)
- Lien GitHub (optionnel)
- URL de démo en ligne (optionnel)
- Ce projet a-t-il une démo Docker interactive ? (oui/non)
- Une image / capture d'écran à afficher ? (chemin ou URL)
```

Ne commence à créer des fichiers qu'une fois ces infos obtenues.

---

## Étape 2 : Générer le slug

```js
// Exemple : "Mon Super Projet" → "mon-super-projet"
const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
```

---

## Étape 3 : Mettre à jour `app/data/projects.js`

Si le fichier n'existe pas, le créer :

```js
// app/data/projects.js
export const projects = [
  {
    slug: "mon-super-projet",
    name: "Mon Super Projet",
    description: "Description courte du projet.",
    stack: ["Next.js", "Docker", "Tailwind CSS"],
    github: "https://github.com/ivan-mustiere/...",
    demo: null,          // URL externe ou null
    hasDockerDemo: false, // true si démo Docker interactive
    image: "/projects/mon-super-projet/cover.png", // ou null
  },
]
```

Ajouter l'entrée au tableau existant, ne pas écraser les projets déjà présents.

---

## Étape 4 : Créer la page projet

Créer `app/projects/[slug]/page.js` si ce n'est pas déjà un layout dynamique, sinon créer `app/projects/<slug>/page.js` :

```js
// app/projects/<slug>/page.js
import { projects } from "@/app/data/projects"

export const metadata = {
  title: "<Nom du projet> — Ivan Mustière",
  description: "<Description courte, 150 char max>",
}

export default function ProjectPage() {
  const project = projects.find(p => p.slug === "<slug>")
  return (
    <main>
      {/* Titre, stack badges, description, liens, démo */}
    </main>
  )
}
```

Si `hasDockerDemo: true` → ajouter un bouton "Lancer la démo" qui appelle `app/api/demos/<slug>/route.js`.

---

## Étape 5 : Vérification

```bash
cd /home/van-pc_ivan/Portfolio && npm run lint
```

Confirmer à l'utilisateur :
- Les fichiers créés / modifiés
- L'URL de la page : `/projects/<slug>`
- La prochaine étape si une démo Docker est prévue (`/add-demo`)
