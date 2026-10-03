# Mon site — Next.js

Projet web créé avec [Next.js](https://nextjs.org/), TypeScript et Tailwind CSS.

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre ensuite [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## Structure du projet

```
site-sport/
├── app/
│   ├── components/     # Tes composants React
│   ├── globals.css     # Styles globaux (Tailwind)
│   ├── layout.tsx      # Layout racine (métadonnées, polices)
│   └── page.tsx        # Page d'accueil (route "/")
├── public/             # Images, fichiers statiques
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Publier sur GitHub

```powershell
git add .
git commit -m "Ma modification"
git push origin main
```

> **Raccourci** : le fichier `PUBLIER.txt` contient la commande complète avec date automatique.
