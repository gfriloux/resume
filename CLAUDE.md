# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal CV/resume for Guillaume Friloux — built with **Astro 6**, sans JavaScript côté client. Deployed to GitHub Pages via GitHub Actions.

Design : piste « Terminal sobre », cf. `docs/redesign/BRIEF.md` et `docs/redesign/maquette-piste-A.html`.

## Project structure

```
src/
  data/resume.ts          ← single source of truth for all CV content
  lib/dates.ts            ← helpers d'affichage des dates ISO (année, durée, tri)
  components/
    Header.astro          ← bandeau d'identité (prompt seul), non fixe
    Hero.astro            ← dispo · h1 · sous-titre · accroche · CTA
    StatsPanel.astro      ← panneau « $ guillaume --stats » (chiffres de basics.stats)
    ToolStrip.astro       ← 4 cadres d'outils sous le hero (resume.signature)
    Experience.astro      ← liste de postes + bloc « Débuts »
    Skills.astro          ← 3 cartes (au quotidien / maîtrisé / déjà pratiqué) + formation & langues
    Footer.astro          ← section #contact
    Icon.astro            ← <svg> inline (download, mail, github, external), tracés Lucide
    Logo.astro            ← marques des outils (terraform, ansible, nixos, docker)
  styles/global.css       ← tokens sémantiques + gabarit de section + boutons + @media print
  layouts/Layout.astro    ← <head> : @fontsource, meta, favicons, Open Graph / Twitter Card
public/                   ← copié tel quel dans dist/ (favicons, social-card.png)
scripts/pdf.mjs           ← génération PDF via Puppeteer (sert dist/ en HTTP local)
scripts/social-card.mjs   ← génération de public/social-card.png (1200×630) via Puppeteer
```

## Content source of truth

**Toujours éditer `src/data/resume.ts`** — c'est l'unique source pour le contenu (basics, experience, skills, education). Aucun texte affiché ne doit être codé en dur dans un composant.

Les dates d'expérience sont au format ISO `YYYY-MM` (`end: null` = poste en cours) ; l'affichage et le tri passent par `src/lib/dates.ts`. **Ne pas se fier à l'ordre du tableau** : `Experience.astro` trie par date de début décroissante.

## Design conventions

- Palette : **Catppuccin Mocha**, exposée via des **tokens sémantiques** dans `:root`
  (`--accent`, `--surface`, `--border`, `--text-body`, `--text-muted`, `--ok`).
  Les composants utilisent les tokens, jamais les couleurs brutes.
- **Contraste** : `--s0` / `--s1` ne servent jamais de couleur de texte, uniquement de bordure.
  Le texte le plus pâle autorisé est `--text-muted`. Pas d'`opacity` < 1 sur du texte.
- **Une seule couleur d'accent** (mauve). Le vert (`--ok`) est réservé à la pastille de disponibilité.
- Fonts : **IBM Plex Sans** + **JetBrains Mono**, auto-hébergées via `@fontsource` — aucune requête tierce.
- Taille de texte minimale : 14 px desktop, 13 px mobile.
- Pas de JS requis pour voir le contenu. Pas d'animation infinie ; `prefers-reduced-motion` coupe tout.
- Gabarits partagés dans `global.css` : `.container`, `.section` + `.section > h2`, `.btn` (`--primary`, `--secondary`, `--ghost`), `.no-print`.

### Icônes et logos

Deux composants, tous deux en SVG inline — **jamais de police d'icônes ni de CDN** :

- `Icon.astro` — icônes d'interface (`download`, `mail`, `github`, `external`), trait 2 px, `currentColor`.
  Tracés Lucide (ISC).
- `Logo.astro` — marques des outils affichées par `ToolStrip.astro`. Tracés extraits de
  **simple-icons** (données CC0) et **copiés dans le composant** : le paquet n'est pas une dépendance.
  Pour ajouter une marque : `npm i -D simple-icons`, copier le `path`, désinstaller.
  **Pas de logo AWS** — Amazon a fait retirer sa marque de simple-icons ; AWS reste présent en texte
  (accroche, ligne `cloud:` du panneau, puce d'expérience Galilée).

Les logos sont **monochromes** (`--accent`) : quatre marques aux couleurs d'origine au-dessus du nom,
ça redevient un sapin de Noël.

## Développement local

```bash
nix develop                        # entre dans le dev shell (node 22 + chromium)
just dev                           # astro dev (avec auto-install npm si besoin)
just build                         # astro build → dist/
```

## Génération PDF

```bash
nix develop --command bash -c 'npm run build && node scripts/pdf.mjs'
```

Le script `scripts/pdf.mjs` :
1. Sert `dist/` sur un serveur HTTP local (port 4322) — nécessaire car les chemins Astro (`/_astro/...`) ne fonctionnent pas en `file://`
2. Lance Chromium via `CHROME_PATH` (exporté automatiquement par le dev shell Nix)
3. Active `emulateMediaType('print')` **avant** le chargement de la page
4. Génère `dist/CV – Guillaume Friloux.pdf`

## Image Open Graph

`public/social-card.png` est un asset **commité** (le CI ne la régénère pas). À relancer si le hero
change (nom, titre, accroche, `basics.stats`) :

```bash
nix develop --command node scripts/social-card.mjs   # ou: just social-card
```

Le favicon est défini dans `public/favicon.svg` (chevron shell mauve) ; `favicon.ico` (16/32/48) et
`apple-touch-icon.png` en sont dérivés via ImageMagick :

```bash
magick -background none -density 384 public/favicon.svg -resize 48x48 /tmp/fav-48.png   # idem 16, 32
magick /tmp/fav-16.png /tmp/fav-32.png /tmp/fav-48.png public/favicon.ico
magick -background none -density 1200 public/favicon.svg -resize 180x180 -depth 8 PNG24:public/apple-touch-icon.png
```

## Déploiement

GitHub Actions (`.github/workflows/main.yml`) sur push vers `main` :
1. `npm ci` + `npm run build`
2. `node scripts/pdf.mjs` (avec `CHROME_PATH=/usr/bin/google-chrome`)
3. Deploy `dist/` → GitHub Pages (`gh-pages` branch)

## @media print — règles critiques

Le PDF doit tenir en **2 pages A4 maximum** (il tient en 1 aujourd'hui). Les blocs `@media print`
vivent dans chaque composant, à côté des styles web ; `global.css` ne porte que les règles partagées
(palette claire, `.section`, `.container`, `.no-print`).

**1. `!important` obligatoire.** Les styles scopés Astro compilent vers des sélecteurs avec attribut
data (ex: `.pitch[data-astro-cid-xxx]`), de **spécificité plus élevée** que les sélecteurs globaux de
`global.css`. Sans `!important`, les valeurs web (paddings de 96 px, etc.) cassent la mise en page PDF.

```css
@media print {
  .pitch { font-size: 9pt !important; line-height: 1.45 !important; }
}
```

**2. Les éléments d'interface portent `.no-print`** (nav, CTA du hero et du footer, pastille de
disponibilité). Le hero affiche à la place `.print-contact` — e-mail, site, GitHub en clair.

**3. Aucun visuel ne doit dépendre d'un aplat.** Par défaut, le Ctrl+P d'un navigateur imprime
**sans les arrière-plans** : tout ce qui est dessiné avec un `background` disparaît, seules les
`border` survivent. C'est pour ça que les filets du `StatsPanel` passent en `border-right` dans le
bloc print au lieu du `gap: 1px` sur fond coloré utilisé en web. `pdf.mjs` génère donc avec
`printBackground: false` — le PDF déployé est exactement ce qu'obtient quelqu'un qui imprime la page.

**4. Les composants enfants ne portent pas le scope du parent.** Le `<svg>` rendu par `Icon.astro`
n'a pas le `data-astro-cid` de `Experience.astro` : pour le cibler depuis le parent il faut
`:global(svg)`, sinon la règle ne s'applique jamais (ni en web, ni en print).

## Points à trancher avec Guillaume

- `resume.json` (format JSON Resume) n'est importé nulle part et diverge du site : à supprimer ou à
  générer depuis `resume.ts`.
- `public/CV – Guillaume Friloux.pdf` est un artefact commité obsolète ; le PDF déployé est celui que
  la CI régénère dans `dist/`.
## Contraintes sur `resume.ts`

`scripts/social-card.mjs` importe `src/data/resume.ts` **directement avec Node** (type-stripping
natif). Le fichier ne doit donc contenir **aucun `import`** : Node exige une extension explicite
dans les spécificateurs relatifs, là où Vite et TypeScript l'acceptent sans. Les valeurs dérivées
(ex. `linuxYears`) se calculent sur place, pas via `src/lib/`.

Le « N ans sur Linux » du panneau se déduit de `LINUX_SINCE = 1997` au moment du build : le chiffre
ne se périme plus, chaque déploiement le remet à jour.
