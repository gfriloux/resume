# resume

CV de Guillaume Friloux — administrateur système Linux, Infrastructure as Code.

[![Main](https://github.com/gfriloux/resume/actions/workflows/main.yml/badge.svg)](https://github.com/gfriloux/resume/actions/workflows/main.yml)

**[guillaume.friloux.me](https://guillaume.friloux.me)** · [CV en PDF](https://guillaume.friloux.me/CV%20%E2%80%93%20Guillaume%20Friloux.pdf)

Site statique [Astro](https://astro.build), déployé sur GitHub Pages. Le même document sert
d'écran et de papier : la feuille d'impression le ramène à **une page A4**, et la CI régénère le
PDF à chaque déploiement.

Pas de JavaScript côté client, polices auto-hébergées, icônes en SVG inline — aucune requête
vers un tiers, et le contenu reste lisible si les scripts sont coupés.

## Contenu

Tout le contenu vit dans **`src/data/resume.ts`**. Les composants n'affichent que ce qu'on leur
passe en props : pour corriger une date ou ajouter une expérience, ce fichier suffit.

## Développement

Le dev shell Nix fournit node 22 et chromium (ce dernier pour la génération du PDF) :

```bash
nix develop        # ou `direnv allow` une fois pour toutes
just dev           # serveur de dev
just build         # build → dist/
just pdf           # build + génération du PDF dans dist/
just social-card   # régénère public/social-card.png (image des previews)
```

## Déploiement

Un push sur `main` déclenche `.github/workflows/main.yml` : build, génération du PDF, puis
publication de `dist/` sur la branche `gh-pages`.

## Pour aller plus loin

- `CLAUDE.md` — conventions du projet : tokens, règles de contraste, pièges de la feuille
  d'impression, contraintes sur `resume.ts`.
- `docs/redesign/BRIEF.md` — le brief de la refonte v2 et ses critères d'acceptation.
