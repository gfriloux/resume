/**
 * Unique source de vérité pour le contenu du CV.
 * Aucun texte affiché ne doit être codé en dur dans les composants.
 *
 * Dates au format ISO `YYYY-MM` ; `end: null` = poste en cours.
 * Helpers d'affichage : src/lib/dates.ts
 *
 * Ce fichier est aussi importé tel quel par Node (`scripts/social-card.mjs`) :
 * il ne doit contenir **aucun import** — Node exigerait une extension explicite
 * que Vite et TypeScript traitent différemment.
 */

/** Première install Linux. Le « N ans » du panneau s'en déduit au build. */
const LINUX_SINCE = 1997;
const linuxYears = new Date().getFullYear() - LINUX_SINCE;

export const resume = {
  basics: {
    name: "Guillaume Friloux",
    title: "Administrateur système Linux",
    subtitle: "Infrastructure as Code",
    availability: "En poste · ouvert aux opportunités en télétravail",
    pitch:
      "Je fais tourner plus de 200 serveurs, sur site et sur AWS, entièrement décrits en code : Terraform, Ansible et Nix pour des environnements reproductibles. Développeur C/Rust de 2007 à 2021, je sais descendre au bas niveau quand quelque chose casse.",
    email: "guillaume@friloux.me",
    website: "https://guillaume.friloux.me",
    github: "https://github.com/gfriloux",
    pdf: "https://guillaume.friloux.me/CV%20%E2%80%93%20Guillaume%20Friloux.pdf",
    location: "Landes (40)",
    remote: "100 % remote",
    languages: [
      { lang: "Français", level: "natif" },
      { lang: "Anglais", level: "lu et écrit" },
    ],
    linuxSince: LINUX_SINCE,
    stats: [
      { value: "200+",                          label: "serveurs gérés aujourd'hui", accent: true },
      { value: `${linuxYears} ans`,             label: "sur Linux" },
      { value: "1 500",                         label: "serveurs supervisés par un outil que j'ai écrit" },
      { value: "C → Rust",                      label: "migrations menées" },
    ],
    cloud: "AWS · sur site",
    contactTitle: "Un poste en télétravail à pourvoir ?",
  },

  /**
   * Signature visuelle sous le hero : les outils touchés tous les jours.
   * `icon` doit exister dans src/components/Logo.astro.
   */
  signature: [
    { name: "Terraform", icon: "terraform", note: "toute l'infra AWS en code" },
    { name: "Ansible",   icon: "ansible",   note: "configuration du parc" },
    { name: "NixOS",     icon: "nixos",     note: "systèmes reproductibles" },
    { name: "Docker",    icon: "docker",    note: "images & conteneurs" },
  ] as const,

  experience: [
    {
      role: "Administrateur système Linux",
      company: "Galilée / DATASOLUTION",
      url: "https://www.datasolution.fr",
      start: "2022-03",
      end: null,
      highlights: [
        "Infrastructure de 200+ serveurs, dont une part croissante migrée sur AWS : VPC, EC2, Lambda, KMS, Secrets Manager et CloudFront décrits en Terraform.",
        "Environnements de dev Nix / Devbox pour les équipes de développement.",
        "Images Docker construites avec Nix : builds 100 % reproductibles.",
      ],
      tags: ["Ansible", "Terraform", "AWS", "Nix Flakes", "Devbox", "GitLab CI/CD"],
    },
    {
      role: "Architecte logiciel",
      company: "ASP France / AMTrust IT / DSIIG",
      url: "https://www.amtrust.fr",
      start: "2013-11",
      end: "2021-12",
      highlights: [
        "Portage d'applications sur macOS, FreeBSD, GNU/Linux et Windows.",
        "Migration de projets C vers Rust.",
        "Auteur d'un système de supervision par XMPP couvrant plusieurs centaines de serveurs ; API REST pour l'ensemble des projets.",
      ],
      tags: ["C", "Rust", "Docker", "Rancher", "API REST"],
    },
    {
      role: "Analyste développeur C",
      company: "ASP64",
      start: "2007-09",
      end: "2013-11",
      highlights: [
        "Supervision XMPP déployée sur jusqu'à 1 500 serveurs.",
        "Installation automatisée de serveurs par PXE boot ; travail sur la performance et la sécurité.",
      ],
      tags: ["C", "XMPP", "EFL", "MySQL"],
    },
    {
      role: "Développeur web",
      company: "Mairie d'Ustaritz",
      url: "http://www.ustaritz.fr/",
      start: "2007-04",
      end: "2007-06",
      early: true,
    },
    {
      role: "Administrateur réseau",
      company: "Base aérienne 118",
      url: "https://fr.wikipedia.org/wiki/Base_a%C3%A9rienne_118_Mont-de-Marsan",
      start: "2006-03",
      end: "2006-06",
      early: true,
    },
    {
      role: "Développeur web (projet scolaire)",
      company: "5e Régiment d'Hélicoptères de Combat",
      start: "2005-01",
      end: "2005-06",
      early: true,
    },
  ],

  /** Phrase unique qui résume les expériences `early: true`. */
  earlyTitle: "Débuts",
  earlyNote:
    "Stage d'administration réseau à la Base aérienne 118 (routeurs sur réseaux classifiés défense, proxy filtrant) · Développement web pour la mairie d'Ustaritz et le 5e RHC.",

  skills: {
    daily:      ["Terraform", "Ansible", "NixOS", "Nix Flakes", "AWS", "Docker", "GitLab CI/CD"],
    proficient: ["C", "Rust", "Shell", "Debian", "Arch Linux", "FreeBSD", "Devbox", "Traefik", "iptables"],
    familiar:   ["Rancher", "Gentoo", "XMPP", "Squid", "MySQL", "Cisco"],
  },

  education: [
    {
      school: "IUT des Pays de l'Adour",
      degree: "Licence Réseaux & Télécommunications",
      end: "2006",
    },
  ],
};
