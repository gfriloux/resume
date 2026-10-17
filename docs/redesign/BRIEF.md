# Brief de refonte — piste A « Terminal sobre »

Ce document s'adresse à Claude Code. Il explique **quoi** changer dans ce dépôt (site Astro du CV, déployé sur https://guillaume.friloux.me) et **pourquoi**, pour appliquer la piste de design A validée par Guillaume.

La maquette de référence est `docs/redesign/maquette-piste-A.html`. Ouvre-la dans un navigateur : c'est une page statique autonome. Elle sert de cible visuelle, pas de code à copier tel quel. Le site doit rester en Astro, avec ses composants et les données dans `src/data/resume.ts`.

---

## 1. Objectif

Un recruteur qui ouvre le site doit comprendre **en 5 secondes, sans scroller** :

1. qui est Guillaume : administrateur système Linux, Infrastructure as Code ;
2. ce qu'il apporte : 200+ serveurs décrits en code (Terraform, Ansible, Nix), passé de développeur C/Rust ;
3. qu'il est disponible : en poste, ouvert aux opportunités en télétravail ;
4. comment agir : télécharger le PDF ou envoyer un e-mail.

On garde l'identité actuelle (palette Catppuccin Mocha, touches de terminal, police mono). On retire le bruit visuel et le contenu factice.

## 2. Problèmes constatés dans la version actuelle (à corriger)

| # | Problème | Où |
|---|----------|----|
| 1 | Le premier écran ne contient ni proposition de valeur ni disponibilité. Le panneau `uptime/load/coffee ∞` attire l'œil sur une blague. | `Hero.astro`, `StatusPanel.astro` |
| 2 | Les 5 badges du hero restent à `opacity: 0` : l'animation GSAP `.from('.badge')` ne finit jamais (constaté dans Chromium headless). La visibilité du contenu ne doit jamais dépendre du JS. | `Hero.astro` |
| 3 | La section XaC est un faux terminal (`api.example.com`, « 47 to add ») tapé lettre par lettre, et ses 4 cartes répètent les compétences. | `XaC.astro` |
| 4 | Trop d'effets simultanés : particules three.js (qui passent sur le texte), grille pulsante, scanline, barre de progression, LED clignotantes, points de timeline pulsants, halos au survol. Pas de `prefers-reduced-motion`. | `Layout.astro`, `global.css`, `ParticleNetwork.astro`, `Experience.astro`, `Nav.astro` |
| 5 | Double titre par section (« 02 · PROFIL » + « PROFIL »), en 11 px majuscules, plus petit que les titres des cartes. Il n'y a aucun vrai `<h2>`. | tous les composants de section |
| 6 | Contraste insuffisant : `--s1` (#45475a) et `opacity: .7` sur #1e1e2e donnent environ 2:1. | `.fact-label`, `.k` du StatusPanel, `.section-eyebrow`, `.footer-copy`, `.group-num` |
| 7 | Ordre chronologique faux : BA 118 (2006) affichée avant Mairie d'Ustaritz (2007). Les stages et projets scolaires ont le même poids visuel que 8 ans d'architecte logiciel. | `resume.ts` → `experience` |
| 8 | « 28 ans » apparaît 4 fois, alors que le résumé dit « plus de 25 ans ». Le « 40 » (département) en gros chiffre ne parle à personne. Le meilleur chiffre, 1 500 serveurs supervisés, est noyé dans un paragraphe. | `resume.ts`, `About.astro` |
| 9 | Compétences à plat (Terraform = Squid), NixOS en double. | `resume.ts` → `skills`, `Skills.astro` |
| 10 | Mobile : la nav pilule déborde (« Compétences » et « Contact » invisibles), le curseur du typewriter se détache, la citation `// …` se coupe mal. | `Nav.astro`, `Hero.astro`, `About.astro` |
| 11 | Icônes chargées en hotlink depuis `https://www.nerdfonts.com/assets/css/webfont.css` (pas un CDN, lourd, fragile). Quand il ne charge pas, il reste des carrés vides (Formation) et des liens sans icône. | `Layout.astro` + toutes les `<i class="nf …">` |

## 3. Design tokens

À mettre dans `src/styles/global.css` (`:root`). On garde les variables Catppuccin existantes et on ajoute des **tokens sémantiques**, que les composants utilisent à la place des couleurs brutes.

```css
:root {
  /* Catppuccin Mocha (inchangé) */
  --bg: #1e1e2e; --mantle: #181825; --crust: #11111b;
  --s0: #313244; --s1: #45475a;
  --text: #cdd6f4; --sub1: #bac2de; --sub0: #a6adc8;
  --mauve: #cba6f7; --green: #a6e3a1; /* … */

  /* Sémantique */
  --accent:        var(--mauve);   /* une seule couleur d'accent */
  --on-accent:     var(--crust);   /* texte sur bouton accent */
  --surface:       var(--mantle);  /* cartes, panneau stats */
  --border:        var(--s0);      /* séparateurs, bordures de cartes */
  --border-strong: var(--s1);      /* bordures de boutons secondaires */
  --text-body:     var(--sub1);    /* paragraphes */
  --text-muted:    var(--sub0);    /* dates, méta, libellés. MINIMUM pour du texte */
  --ok:            var(--green);   /* pastille de disponibilité uniquement */

  --font: 'IBM Plex Sans', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;

  --container: 1120px;
  --gutter: clamp(20px, 5vw, 48px);
  --radius: 10px;      /* boutons */
  --radius-lg: 14px;   /* cartes, panneau */
}
```

**Règle de contraste** : `--s1` et `--s0` ne servent **jamais** de couleur de texte, seulement de bordure. Le texte le plus pâle autorisé est `--text-muted` (#a6adc8, ≈ 7:1 sur #1e1e2e). Plus d'`opacity` < 1 sur du texte.

**Couleur unique** : l'accent mauve est la seule couleur « décorative ». On supprime les accents par élément : `accent` dans `xac[]` et `skills[]`, `dotColors` de la timeline, `fact-teal/blue/green`. Le vert est réservé à la pastille « disponible ».

### Typographie

- Polices : **IBM Plex Sans** (texte) + **JetBrains Mono** (dates, tags, méta, accents « terminal »). Inter est retiré.
- Auto-héberger plutôt que Google Fonts : `npm i @fontsource/ibm-plex-sans @fontsource/jetbrains-mono`, puis importer les graisses 400/500/600/700 et 400/500/600 dans `Layout.astro`. Le rendu PDF devient déterministe et on évite une requête tierce.

| Rôle | Taille | Graisse | Police |
|------|--------|---------|--------|
| Nom (h1) | `clamp(44px, 6vw, 76px)`, line-height 1, letter-spacing -0.03em | 700 | sans |
| Sous-titre du hero | `clamp(18px, 2vw, 22px)`, couleur `--accent` | 400 | mono |
| Accroche du hero | 19 px (17 px en mobile), line-height 1.6, max 640 px | 400 | sans |
| Titre de section (h2) | 32 px (26 px en mobile), letter-spacing -0.01em | 600 | sans |
| Titre de poste (h3) | 21 px (18 px en mobile) | 600 | sans |
| Corps | 16 px, line-height 1.65, `--text-body` | 400 | sans |
| Dates, tags, méta | 14 px, `--text-muted` | 400 | mono |

Minimum absolu : **13 px** en mobile, **14 px** en desktop. Plus aucun 10–11 px.

## 4. Structure de la page (nouvel ordre)

```
<header>   barre fine : « guillaume@friloux.me ~$ » + nav (Expérience · Compétences · Contact)
<section#hero>        badge dispo · h1 · sous-titre · accroche · 3 CTA  |  panneau « $ guillaume --stats »
<section#experience>  h2 · 3 postes détaillés + 1 ligne « Débuts »
<section#competences> h2 · 3 cartes (au quotidien / maîtrisé / déjà pratiqué) · ligne formation + langues
<footer#contact>      « Un poste en télétravail à pourvoir ? » · [M'écrire] [CV en PDF]
```

Les sections XaC, Profil (About), Formation et la grille de « facts » disparaissent **en tant que sections**. Leur contenu utile est redistribué : voir §5.

## 5. Changements fichier par fichier

### `src/layouts/Layout.astro`
- Retirer `#progress`, `.bg-grid`, `.scanline`, `<canvas id="bg-canvas">` et le script de la barre de progression.
- Retirer le `<link>` Nerd Fonts et les `<link>` Google Fonts (remplacés par `@fontsource`).
- Ajouter les balises de partage : `og:title`, `og:description`, `og:url`, `og:type=profile`, `twitter:card=summary_large_image` et une `og:image` (1200×630, peut être une capture du hero, à placer dans `public/og.png`). Si l'image n'existe pas encore, laisser un TODO plutôt qu'inventer un visuel.
- Ajouter `<link rel="canonical" href="https://guillaume.friloux.me/">`.

### `src/styles/global.css`
- Ajouter les tokens du §3.
- Supprimer `.bg-grid`, `.scanline`, `#progress`, `.section-eyebrow` et leurs keyframes.
- Ajouter un style commun de section (`.section`, `.section h2`, `.container`) pour arrêter de dupliquer `.section-title` dans chaque composant.
- Ajouter le bloc mouvement réduit :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  }
  ```
- Ajouter un style de focus visible : `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }`.
- Mettre à jour le bloc `@media print` (voir §8).

### `src/components/ParticleNetwork.astro` → **supprimer**
Retirer aussi l'import dans `index.astro`, puis désinstaller `three` et `@types/three` si plus rien ne les utilise.

### `src/components/Nav.astro`
- Remplacer la pilule flottante centrée par une **barre d'en-tête simple** en haut de page, sous forme de `<header>` avec bordure basse `--border`, non fixe. Elle n'a plus besoin d'être sticky : la page est courte.
- À gauche : `guillaume@friloux.me <span accent>~$</span>` en mono 14 px, couleur `--text-muted`.
- À droite : `<nav aria-label="Sections">` avec 3 liens : Expérience, Compétences, Contact. « Accueil » est inutile, « XaC » et « Profil » disparaissent.
- Liens en mono 14 px, `padding: 12px`, ce qui donne une zone tactile ≥ 44 px. `flex-wrap: wrap` : en mobile, la nav passe à la ligne au lieu de déborder. Pas de menu burger nécessaire avec 3 liens.
- Supprimer la LED clignotante et l'IntersectionObserver d'état actif. On peut garder un `aria-current` simple si on y tient, sans animation.

### `src/components/StatusPanel.astro` → remplacer par `StatsPanel.astro`
Le panneau garde le clin d'œil terminal, mais avec des **vrais chiffres**. Il se place à droite du hero en desktop et passe sous le texte en mobile (il ne disparaît plus).

```
┌ $ guillaume --stats ───────────────┐   ← mono 14px, --text-muted, bordure basse
│ 200+                │ 28 ans       │   ← mono 28px/600, white-space: nowrap (le 1er en --accent)
│ serveurs gérés      │ sur Linux    │   ← sans 14px --text-muted
│ aujourd'hui         │              │
├─────────────────────┼──────────────┤
│ 1 500               │ C → Rust     │
│ serveurs supervisés │ migrations   │
│ par un outil que    │ menées       │
│ j'ai écrit          │              │
├────────────────────────────────────┤
│ stack: Terraform · Ansible · NixOS · AWS │
│ lieu:  Landes (40) · 100 % remote        │
└────────────────────────────────────┘
```

Implémentation : `<aside aria-label="En bref">`, fond `--surface`, bordure `--border`, `--radius-lg`. Grille `repeat(2, 1fr)` avec `gap: 1px` sur fond `--border` pour obtenir les filets. Données lues depuis `resume.basics.stats` (voir §6).

### `src/components/Hero.astro`
- Plus de `min-height: 100vh`, de flèche « Scroll », de typewriter ni de curseur clignotant.
- Mise en page : `display: flex; flex-wrap: wrap; gap: 56px`. Colonne texte `flex: 999 1 560px`, panneau stats `flex: 1 1 380px` (en dessous, « 28 ans » et « C → Rust » passent à la ligne). En dessous de ~900 px, le panneau passe naturellement sous le texte. Padding `96px var(--gutter) 80px`.
- Contenu, dans l'ordre :
  1. **Pastille de disponibilité** : pilule bordure `--border-strong`, point vert 8 px + « En poste · ouvert aux opportunités en télétravail », 14 px, couleur `--ok`. Texte issu de `basics.availability`.
  2. `<h1>` nom.
  3. Sous-titre mono accent : « Administrateur système Linux · Infrastructure as Code » (`basics.title` + `basics.subtitle`).
  4. Accroche (`basics.pitch`) : « Je fais tourner plus de 200 serveurs, sur site et sur AWS, entièrement décrits en code : Terraform, Ansible et Nix pour des environnements reproductibles. Développeur C/Rust de 2007 à 2021, je sais descendre au bas niveau quand quelque chose casse. »
  5. CTA :
     - **Primaire** : `<a>` « Télécharger le CV (PDF) » avec icône download, fond `--accent`, texte `--on-accent`, 600, hauteur ≥ 48 px, `--radius`.
     - **Secondaire** : `mailto:` avec l'adresse e-mail visible, bordure `--border-strong`.
     - **Tertiaire** : lien texte `github.com/gfriloux`.
- Supprimer les badges codés en dur (`['28 ans Linux', …]`) : l'info est déjà dans les stats.
- Supprimer l'animation GSAP d'entrée. Si on veut une entrée douce, la faire **en CSS seulement** (fade de 300 ms, désactivé par `prefers-reduced-motion`), avec un état final visible même si le JS ne s'exécute pas.

### `src/components/XaC.astro` → **supprimer**
Le faux terminal et les cartes disparaissent. Leur contenu réel (Terraform, Ansible, NixOS, Nix Flakes) est couvert par l'accroche, le panneau stats et la carte « au quotidien » des compétences.

### `src/components/About.astro` → **supprimer** (contenu redistribué)
- Résumé → devient l'accroche du hero (réécrite, plus courte).
- Localisation et télétravail → panneau stats (ligne `lieu:`).
- Langues → une ligne sous les compétences.
- Citation `// rigoureux · passionné…`, grille « facts » et lien vers l'ancien site → supprimés.

### `src/components/Experience.astro`
- Supprimer la ligne verticale dégradée, les points colorés pulsants, l'animation d'apparition `translateX` et les halos au survol.
- Nouveau gabarit par poste : `<article>` en `display:flex; flex-wrap:wrap; gap: 8px 40px; padding: 28px 0; border-bottom: 1px solid var(--border)`. Le dernier poste n'a pas de bordure.
  - Colonne gauche `flex: 0 0 200px` : dates en mono 14 px `--text-muted`, avec la **durée** pour les postes longs (« 2013 — 2021 · 8 ans »). Format année seule ; « aujourd'hui » pour le poste en cours.
  - Colonne droite `flex: 999 1 480px; min-width: 0` :
    - `<h3>` : intitulé, puis ` · Entreprise` en `--accent`, graisse 400. Lien vers le site de l'entreprise si `url`.
    - `<ul>` de 2–3 puces orientées résultat (champ `highlights`), 16 px, `--text-body`.
    - Ligne de techno en mono 14 px `--text-muted`, séparées par ` · ` : du texte simple, sans pastilles.
- Les postes marqués `early: true` (2005–2007) ne sont **pas** rendus comme des postes : ils sont regroupés dans un dernier `<article>` « Débuts » (titre 17 px `--text-body`, une seule phrase 15 px `--text-muted`).
- Trier par date de début décroissante **dans le code** (ne pas se fier à l'ordre du tableau) : c'est ce qui corrige le bug BA 118 / Ustaritz.
- En mobile (< 640 px), dates au-dessus du titre et entreprise sur sa propre ligne.

### `src/components/Skills.astro`
- 3 cartes en `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px`, fond `--surface`, bordure `--border`, `--radius`, padding 24 px.
- Chaque carte : libellé mono 14 px (« au quotidien » en `--accent`, les deux autres en `--text-muted`), puis une **liste en texte courant** séparée par des virgules :
  - au quotidien : 18 px, 500, `--text` ;
  - maîtrisé : 16 px, `--text-body` ;
  - déjà pratiqué : 16 px, `--text-muted`.
- Sous les cartes, une ligne 16 px `--text-muted` : « Licence Réseaux & Télécommunications — IUT des Pays de l'Adour, 2006 · Français natif, anglais lu et écrit ».
- Retirer `group-num`, l'IntersectionObserver et les pastilles.

### `src/components/Education.astro` → **supprimer**
L'unique diplôme tient sur la ligne ci-dessus. Le carré d'icône vide disparaît du même coup.

### `src/components/Footer.astro`
- `<footer id="contact">`, bordure haute `--border`, conteneur flex wrap `space-between` :
  - à gauche : « Un poste en télétravail à pourvoir ? », 24 px, 600 ;
  - à droite : bouton primaire « M'écrire » (`mailto:`) + bouton secondaire « CV en PDF ».
- Ligne discrète en dessous : © année · lien GitHub, 14 px `--text-muted`.

### Icônes
Créer `src/components/Icon.astro`, qui rend un `<svg>` inline (trait 2 px, `currentColor`, `aria-hidden="true"`), pour les seules icônes nécessaires : `download`, `mail`, `github`, `external`. Les tracés peuvent venir de Lucide (licence ISC) : copier les `path`, sans ajouter de dépendance. Supprimer toutes les `<i class="nf …">`.

### `src/pages/index.astro`
```astro
<Layout>
  <Nav />          <!-- devient l'en-tête -->
  <Hero data={resume.basics} />
  <Experience data={resume.experience} />
  <Skills data={resume.skills} basics={resume.basics} education={resume.education} />
  <Footer data={resume.basics} />
</Layout>
```

### Dépendances
Si plus aucun composant ne les importe après la refonte, retirer `gsap`, `three` et `@types/three` de `package.json`. Ajouter `@fontsource/ibm-plex-sans` et `@fontsource/jetbrains-mono`.

## 6. Modèle de données (`src/data/resume.ts`)

Le contenu doit vivre **uniquement** ici : plus de textes codés en dur dans les composants. Changements proposés :

```ts
export const resume = {
  basics: {
    name: "Guillaume Friloux",
    title: "Administrateur système Linux",
    subtitle: "Infrastructure as Code",
    availability: "En poste · ouvert aux opportunités en télétravail",
    pitch: "Je fais tourner plus de 200 serveurs, sur site et sur AWS, entièrement décrits en code : Terraform, Ansible et Nix pour des environnements reproductibles. Développeur C/Rust de 2007 à 2021, je sais descendre au bas niveau quand quelque chose casse.",
    email: "guillaume@friloux.me",
    website: "https://guillaume.friloux.me",
    github: "https://github.com/gfriloux",
    pdf: "…", // inchangé
    location: "Landes (40)",
    remote: true,
    languages: [ { lang: "Français", level: "natif" }, { lang: "Anglais", level: "lu et écrit" } ],
    stats: [
      { value: "200+",     label: "serveurs gérés aujourd'hui", accent: true },
      { value: "28 ans",   label: "sur Linux" },
      { value: "1 500",    label: "serveurs supervisés par un outil que j'ai écrit" },
      { value: "C → Rust", label: "migrations menées" },
    ],
    stack: ["Terraform", "Ansible", "NixOS", "AWS"],
  },
  experience: [
    {
      role: "Administrateur système Linux",
      company: "Galilée / DATASOLUTION",
      url: "https://www.datasolution.fr",
      start: "2022-03", end: null,                 // null = aujourd'hui
      highlights: [
        "Infrastructure de 200+ serveurs, dont une part croissante migrée sur AWS avec Terraform.",
        "Environnements de dev Nix / Devbox pour les équipes de développement.",
        "Images Docker construites avec Nix : builds 100 % reproductibles.",
      ],
      tags: ["Ansible","Terraform","AWS","Nix Flakes","Devbox","GitLab CI/CD"],
    },
    // Architecte logiciel 2013-11 → 2021-12, Analyste développeur C 2007-09 → 2013-11 : même forme
    // Les 3 expériences 2005–2007 : ajouter `early: true`
  ],
  skills: {
    daily:     ["Terraform","Ansible","NixOS","Nix Flakes","AWS","Docker","GitLab CI/CD"],
    proficient:["C","Rust","Shell","Debian","Arch Linux","FreeBSD","Devbox","Traefik","iptables"],
    familiar:  ["Rancher","Gentoo","XMPP","Squid","MySQL","Cisco"],
  },
  education: [ { school: "IUT des Pays de l'Adour", degree: "Licence Réseaux & Télécommunications", end: "2006" } ],
};
```

- Dates au format ISO `YYYY-MM`, avec un petit helper pour l'affichage (année) et le calcul de durée (« 8 ans »).
- Calculer les années d'expérience Linux depuis une date de début plutôt que de coder « 28 » en dur, si Guillaume confirme l'année de départ. Sinon, garder la valeur et la mettre à un seul endroit.
- Supprimer `status`, `quote`, `facts`, `xac` et les champs `accent`.
- **Ne pas inventer de contenu.** Les textes ci-dessus reprennent les faits déjà présents dans le dépôt. Toute nouvelle réalisation chiffrée doit venir de Guillaume.

> `resume.json` (format JSON Resume) n'est importé nulle part et diverge du site. Ne pas le modifier dans cette refonte, mais signaler à Guillaume qu'il faudrait le supprimer ou le générer depuis `resume.ts`. Même remarque pour `CV – Guillaume Friloux.pdf` et `index.html` à la racine, qui semblent obsolètes (le PDF déployé est régénéré par la CI).

## 7. Accessibilité et mouvement

- Un seul `<h1>`. Un `<h2>` par section. Un `<h3>` par poste et par carte de compétences.
- Liens et boutons : zone cliquable ≥ 44 × 44 px, `:focus-visible` visible.
- Liens externes : `rel="noopener"`, et pas de `target="_blank"` sur le PDF ni sur le mailto.
- Contraste texte ≥ 4.5:1 partout (voir la règle du §3).
- Aucune animation infinie. Pas de JS nécessaire pour voir le contenu.
- Tester au clavier : Tab parcourt nav → CTA → liens d'entreprise → footer, dans l'ordre visuel.

## 8. Impression / PDF (`@media print` + `scripts/pdf.mjs`)

Le PDF est généré par `scripts/pdf.mjs` (Puppeteer, `emulateMediaType('print')`) et doit continuer à fonctionner.

- Simplifier fortement le bloc print : la nouvelle structure est déjà sobre, donc la plupart des `!important` disparaissent.
- Palette claire conservée : fond blanc, texte `#1a1a2e`, accent `#6d28d9`.
- Masquer : `header` (nav), CTA du hero et du footer, pastille de disponibilité.
- Afficher en clair dans l'en-tête du PDF : e-mail, site, GitHub (le texte des liens est déjà visible).
- Panneau stats : 4 colonnes sur une ligne, bordures fines grises.
- `break-inside: avoid` sur chaque `<article>` et chaque carte.
- Viser **2 pages A4 maximum**.
- Retirer de `pdf.mjs` la mesure de `#xac`, qui n'existe plus.

## 9. Hors périmètre — ne pas faire

- Pas de changement de framework, de déploiement ou de CI.
- Pas de nouvelle section (projets, blog, photo…) sans demande explicite.
- Pas de thème clair ni de sélecteur de thème pour l'instant.
- Ne pas réintroduire d'effets décoratifs (dégradés, glow, particules) « pour faire vivant ».

## 10. Ordre de travail conseillé (1 commit par étape)

1. `feat(data)`: nouveau modèle `resume.ts` + helpers de dates (le site peut casser temporairement).
2. `feat(style)`: tokens, polices auto-hébergées, `Icon.astro`, suppression Nerd Fonts.
3. `feat(layout)`: suppression des fonds animés + `ParticleNetwork` + nouvel en-tête `Nav`.
4. `feat(hero)`: nouveau hero + `StatsPanel` ; suppression `StatusPanel`, `XaC`, `About`.
5. `feat(experience)`: nouvelle liste, tri, regroupement « Débuts ».
6. `feat(skills)`: 3 niveaux + ligne formation/langues ; suppression `Education`.
7. `feat(footer)`: nouveau contact.
8. `fix(print)`: feuille d'impression + `pdf.mjs`.
9. `chore(deps)`: retrait `gsap`/`three` si inutilisés.

## 11. Critères d'acceptation

- [ ] À 1440 × 900, sans scroller : nom, sous-titre, accroche, disponibilité, bouton PDF et panneau stats visibles.
- [ ] À 390 × 844 : rien ne déborde horizontalement, les 3 liens de nav sont visibles, et le bouton PDF est visible sans scroller (ou juste sous la ligne de flottaison).
- [ ] Le contenu est entièrement visible avec JavaScript désactivé.
- [ ] Aucune requête vers `nerdfonts.com` ni `fonts.googleapis.com`.
- [ ] Expériences triées par date décroissante ; 2005–2007 regroupées dans « Débuts ».
- [ ] Aucun texte sous 4.5:1 de contraste (vérifier avec l'onglet Accessibilité de Chrome DevTools ou axe).
- [ ] `prefers-reduced-motion: reduce` → aucune animation.
- [ ] `npm run build` passe, et `node scripts/pdf.mjs` produit un PDF de 2 pages max, lisible, sans éléments d'interface.
- [ ] Captures avant/après (desktop + mobile + PDF) jointes à la PR.
