export const resume = {
  basics: {
    name: "Guillaume Friloux",
    title: "Administrateur Système Linux",
    age: 43,
    yearsExp: 28,
    location: "Landes (40)",
    remote: true,
    email: "guillaume@friloux.me",
    website: "https://guillaume.friloux.me",
    github: "https://github.com/gfriloux",
    legacy: "https://legacy.guillaume.friloux.me/",
    pdf: "https://guillaume.friloux.me/CV%20%E2%80%93%20Guillaume%20Friloux.pdf",
    summary: "Administrateur Linux depuis plus de 25 ans, avec une expérience récente sur des infrastructures AWS. À l'aise avec l'automatisation (Ansible, Terraform), les environnements Docker, et la gestion de configurations reproductibles avec Nix. Profil atypique avec un background développeur C/Rust, utile pour diagnostiquer des problèmes bas niveau ou outiller l'équipe.",
    languages: [
      { lang: "Français", level: "Natif" },
      { lang: "Anglais", level: "Lu / Écrit" }
    ],
    status: {
      uptime: "28y",
      role: "sysadmin",
      stack: "NixOS / Terraform",
      load: "0.42",
      remote: "yes",
      coffee: "∞"
    },
    quote: "// rigoureux · passionné · pragmatique · remote-native",
    facts: [
      { label: "Expérience",      value: "28",   unit: "ans", sub: "Linux & systèmes",          color: "mauve" },
      { label: "Serveurs gérés",  value: "200+", unit: "",    sub: "Infrastructure Galilée",     color: "teal"  },
      { label: "Localisation",    value: "40",   unit: "",    sub: "Landes · Remote-first",      color: "blue"  },
      { label: "Disponibilité",   value: "now",  unit: "",    sub: "Ouvert aux opportunités",    color: "green" },
    ]
  },
  xac: [
    { tool: "Terraform", accent: "#cba6f7", icon: "nf-dev-terraform", tag: "IaC", desc: "Provisionnement AWS en code versionné. 200+ serveurs gérés." },
    { tool: "Ansible", accent: "#f38ba8", icon: "nf-dev-ansible", tag: "Automation", desc: "Configuration et déploiement idempotent sur l'ensemble du parc." },
    { tool: "NixOS", accent: "#89b4fa", icon: "nf-linux-nixos", tag: "OS", desc: "Système reproductible déclaratif. Rollbacks atomiques, builds déterministes." },
    { tool: "Nix Flakes", accent: "#94e2d5", icon: "nf-md-snowflake", tag: "Reproducible", desc: "Envs dev portables (Devbox). Images Docker buildées via Nix." }
  ],
  experience: [
    {
      role: "Administrateur Système Linux",
      company: "Galilée / DATASOLUTION",
      url: "https://www.datasolution.fr",
      start: "Mar 2022", end: "Déc 2025",
      desc: "Gestion d'une infrastructure de plus de 200 serveurs, dont une portion grandissante sur AWS. Écriture d'environnements nix/devbox pour les équipes dev. Construction de projets et images Docker via Nix pour des builds 100% reproductibles.",
      tags: ["Ansible","Terraform","AWS","Nix Flakes","Devbox","Gitlab CI/CD"]
    },
    {
      role: "Architecte Logiciel",
      company: "ASP France / AMTrust IT / DSIIG",
      url: "https://www.amtrust.fr",
      start: "Nov 2013", end: "Déc 2021",
      desc: "Portage d'applications sous Mac OSX, FreeBSD, GNU/Linux, Windows. Migration de projets C vers Rust. Auteur d'un système de monitoring via XMPP gérant jusqu'à plusieurs centaines de serveurs. Conception d'API REST pour l'ensemble des projets.",
      tags: ["C","Rust","Docker","Rancher","API REST"]
    },
    {
      role: "Analyste Développeur C",
      company: "ASP64",
      start: "Sep 2007", end: "Nov 2013",
      desc: "Recherche de performances et sécurité. Développement d'une solution de monitoring XMPP déployée sur jusqu'à 1 500 serveurs. Projet d'installation automatisée de serveurs via PXE boot. Intégration des librairies EFL.",
      tags: ["C","XMPP","EFL","MySQL"]
    },
    {
      role: "Administrateur Réseau",
      company: "Base Aérienne 118",
      url: "https://fr.wikipedia.org/wiki/Base_a%C3%A9rienne_118_Mont-de-Marsan",
      start: "Mar 2006", end: "Jun 2006",
      desc: "Stage de fin d'études. Configuration de routeurs sur réseaux confidentiel et classifié défense. Remplacement de la passerelle internet avec proxy authentifié et filtrage.",
      tags: ["Cisco","iptables","Squid"]
    },
    {
      role: "Développeur Web",
      company: "Mairie d'Ustaritz",
      url: "http://www.ustaritz.fr/",
      start: "Avr 2007", end: "Jun 2007",
      desc: "Ré-écriture complète du site internet.",
      tags: ["PHP"]
    },
    {
      role: "Développeur Web (Projet scolaire)",
      company: "5e Régiment d'Hélicoptères de Combat",
      start: "Jan 2005", end: "Jun 2005",
      desc: "Logiciel de gestion de stock informatique.",
      tags: ["PHP","MySQL"]
    }
  ],
  skills: [
    { group: "Infrastructure as Code", accent: "#cba6f7", items: ["Terraform","Ansible","NixOS","Nix Flakes","Devbox","Gitlab CI/CD"] },
    { group: "Cloud & Containers",     accent: "#89b4fa", items: ["AWS","Docker","Docker Compose","Rancher","Traefik"] },
    { group: "Systèmes",               accent: "#a6e3a1", items: ["Archlinux","Debian","FreeBSD","Gentoo","NixOS"] },
    { group: "Programmation",          accent: "#f38ba8", items: ["C","Rust","Shellscript","MySQL"] },
    { group: "Protocoles & Outils",    accent: "#94e2d5", items: ["XMPP","HTTP","REST API","iptables","Squid"] }
  ],
  education: [
    {
      school: "IUT des Pays de l'Adour",
      degree: "Licence — Réseaux & Télécommunications",
      start: "Sep 2005", end: "Jul 2006"
    }
  ]
};
