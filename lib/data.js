export const experiences = [
  {
    title: "Data Analyst",
    type: "Alternance",
    company: "Groupe Henner",
    location: "Neuilly-sur-Seine, Île-de-France",
    period: "Sept. 2023 – Aujourd'hui",
    tasks: [
      "Conception et maintenance de pipelines ETL & ELT avec Talend pour l'intégration des flux de données médicales",
      "Analyse big data sur des volumes importants de documents de santé avec Apache Spark et PostgreSQL, incluant l'annulation automatique de documents via CNN",
      "Modélisation et alimentation d'un data warehouse Snowflake pour le reporting métier",
      "Création de dashboards analytiques et visualisations sous Qlik Sense",
      "Orchestration des workflows de données via Apache Airflow",
      "Administration de serveurs cloud et gestion des environnements de traitement de données",
    ],
    stack: ["Snowflake", "Talend", "Qlik", "Airflow", "Spark", "PostgreSQL", "Docker"],
  },
  {
    title: "Administrateur Systèmes / DevOps",
    type: "Alternance",
    company: "Kosmos",
    location: "Nantes, Pays de la Loire",
    period: "Août 2021 – Sept. 2023",
    tasks: [
      "Gestion du ticketing et résolution d'incidents via Jira",
      "Configuration de postes de travail et gestion du parc informatique",
      "Achat de matériel et gestion des baies de brassage",
      "Automatisation des tâches d'exploitation via scripts PowerShell et Bash",
      "Déploiement et suivi des applications en production",
      "2e année : création et gestion de conteneurs sur des environnements Kubernetes",
    ],
    stack: ["Jira", "PowerShell", "Bash", "Kubernetes", "Docker", "Linux", "Windows"],
  },
];

export const formations = [
  {
    degree: "Master Informatique",
    speciality: "Spécialisation Data Engineer",
    school: "Paris Ynov Campus",
    location: "Nanterre, Île-de-France",
    period: "2024 – 2026",
  },
  {
    degree: "Bachelor Informatique",
    speciality: "Spécialisation Data",
    school: "Paris Ynov Campus",
    location: "Nanterre, Île-de-France",
    period: "2023 – 2024",
  },
  {
    degree: "BTS Systèmes Numériques",
    speciality: "Programmation Informatique",
    school: "St Félix-La Salle",
    location: "Nantes, Pays de la Loire",
    period: "2021 – 2023",
  },
  {
    degree: "Baccalauréat Professionnel",
    speciality: "Informatique",
    school: "St Félix-La Salle",
    location: "Nantes, Pays de la Loire",
    period: "2018 – 2021",
  },
];

export const pastProjects = [
  {
    id: "transport-public",
    name: "Agrégateur de flux transport public",
    category: "École",
    description: "Plateforme web centralisant en temps réel les données de transport de France — RATP (Paris), NaoLib (Nantes), TCL (Lyon) et autres réseaux.",
    stack: ["Python", "SQL", "APIs REST"],
    highlights: ["Intégration multi-réseaux", "Données temps réel", "Interface cartographique unifiée"],
  },
  {
    id: "trafic-routier",
    name: "Prédiction du trafic routier parisien",
    category: "École",
    description: "Logiciel de prédiction de la circulation sur chaque route de Paris en fonction des événements, de l'heure et des données historiques.",
    stack: ["Python", "SQL", "Machine Learning"],
    highlights: ["Prédiction par segment de route", "Prise en compte des événements", "Entraîné sur données historiques"],
  },
  {
    id: "stats-badminton",
    name: "Statistiques de compétition badminton",
    category: "École",
    description: "Analyse statistique des performances en compétition — identification des points forts et faibles de chaque joueur sur ses séquences de jeu.",
    stack: ["Python", "SQL", "pandas", "Matplotlib"],
    highlights: ["Profil force/faiblesse par joueur", "Visualisations interactives", "Analyse de séquences de jeu"],
  },
  {
    id: "stats-esport",
    name: "Statistiques de performance esport",
    category: "Perso",
    description: "Analyse statistique des personnages d'un jeu vidéo pour évaluer leur puissance dans le méta actuel et générer une tier list basée sur les données.",
    stack: ["Python", "SQL", "pandas", "Matplotlib"],
    highlights: ["Tier list pilotée par les données", "Comparaison multi-patches", "Dashboard de performances"],
  },
  {
    id: "cnn-minimap",
    name: "CNN — Minimap depuis flux vidéo",
    category: "Perso",
    description: "Génération automatique d'une minimap de jeu en temps réel à partir de l'analyse du flux vidéo via un réseau de neurones convolutif.",
    stack: ["Python", "TensorFlow", "OpenCV", "CNN"],
    highlights: ["Analyse frame par frame", "Reconstruction de carte en temps réel", "Entraîné sur captures de jeu"],
  },
  {
    id: "flux-foule",
    name: "Analyse de flux de mouvement de foule",
    category: "Perso",
    description: "Modèle de prédiction des mouvements de foule inspiré de Fouloscopie — analyse et anticipation des dynamiques de flux piéton à partir de vidéos.",
    stack: ["Python", "SQL", "OpenCV", "scikit-learn"],
    highlights: ["Détection de flux piéton", "Prédiction de mouvement", "Visualisation des densités"],
  },
  {
    id: "alerting-prtg",
    name: "Automatisation alerting PRTG & Grafana",
    category: "Pro",
    description: "Création de capteurs personnalisés PRTG et tableaux de bord Grafana pour détecter et notifier automatiquement les problèmes majeurs d'infrastructure.",
    stack: ["Bash", "PowerShell", "Visual Basic", "PRTG", "Grafana"],
    highlights: ["Capteurs PRTG sur mesure", "Dashboards Grafana", "Alerting automatisé"],
  },
  {
    id: "gestion-batch",
    name: "Gestion de batch de données",
    category: "Pro",
    description: "Orchestration et supervision de traitements batch via GoAnywhere — automatisation des flux de données avec gestion des erreurs et reprises.",
    stack: ["Bash", "PowerShell", "Visual Basic", "GoAnywhere"],
    highlights: ["Planification de batch", "Supervision des exécutions", "Gestion des erreurs et reprises"],
  },
  {
    id: "etl-migration",
    name: "ETL de migration PostgreSQL → Snowflake",
    category: "Pro",
    description: "Pipeline ETL complet pour migrer et gérer les données d'un entrepôt PostgreSQL vers Snowflake, avec transformation et validation des données.",
    stack: ["Python", "SQL", "PostgreSQL", "Snowflake"],
    highlights: ["Migration complète des schémas", "Transformation et validation", "Pipeline reproductible"],
  },
];

export const skills = [
  {
    category: "Data & MLOps",
    items: ["ETL & pipelines (Airflow, Talend)", "MLOps (CI/CD, MLflow)", "Big Data (Spark, Kafka, Snowflake)", "Modèles ML (pandas, scikit-learn)", "Deep Learning (TensorFlow, PyTorch)"],
  },
  {
    category: "Infrastructure",
    items: ["Conteneurs (Docker, Kubernetes)", "Cloud (AWS, Azure)", "Administration Windows & Linux", "Monitoring & alerting (Grafana, PRTG)", "Automatisation de workflows (n8n)"],
  },
  {
    category: "Développement",
    items: ["Traitement de données (NumPy, Matplotlib)", "Développement applis web & mobile", "Développement de daemon", "Création de capteur embarqué", "Gestion d'équipements réseaux"],
  },
];
