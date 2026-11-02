// English mirror of lib/data.js (homepage sections only). Keep both in sync.

export const experiences = [
  {
    title: "Data Analyst",
    type: "Work-study",
    company: "Groupe Henner",
    // ISO months: used for durations and the timeline bars (end: null = ongoing)
    start: "2023-09",
    end: null,
    location: "Neuilly-sur-Seine, Île-de-France",
    period: "Sept. 2023 – Present",
    tasks: [
      "Designed and maintained ETL & ELT pipelines with Talend to integrate medical data flows",
      "Big data analysis on large volumes of health documents with Apache Spark and PostgreSQL, including automated document cancellation with a CNN",
      "Modelled and loaded a Snowflake data warehouse for business reporting",
      "Built analytical dashboards and visualisations in Qlik Sense",
      "Orchestrated data workflows with Apache Airflow",
      "Administered cloud servers and managed data processing environments",
    ],
    stack: ["Snowflake", "Talend", "Qlik", "Airflow", "Spark", "PostgreSQL", "Docker"],
  },
  {
    title: "Systems Administrator → DevOps",
    type: "Work-study",
    company: "Kosmos",
    start: "2021-08",
    end: "2023-07",
    location: "Nantes, Pays de la Loire",
    period: "Aug. 2021 – July 2023",
    // Successive positions in the same work-study, shown inside one card (newest first)
    roles: [
      {
        title: "DevOps",
        period: "Dec. 2022 – June 2023",
        tasks: [
          "Created and managed containers on Kubernetes environments",
          "Deployed and monitored applications in production",
          "Automated deployments and operations with Bash and PowerShell scripts",
        ],
      },
      {
        title: "Systems Administrator",
        period: "Aug. 2021 – Dec. 2022",
        tasks: [
          "Automated operations tasks with PowerShell and Bash scripts",
          "Ticketing and incident resolution with Jira",
          "IT asset management: workstations, hardware purchasing and patch panels",
        ],
      },
    ],
    stack: ["Kubernetes", "Docker", "Bash", "PowerShell", "Jira", "Linux", "Windows"],
  },
];

export const formations = [
  // Successive programs in the same school are grouped into one card (`programs`, newest first)
  {
    degree: "Bachelor's → Master's in Data",
    school: "Paris Ynov Campus",
    location: "Nanterre, Île-de-France",
    period: "2023 – 2026",
    programs: [
      { degree: "Master's in Data Engineering", period: "2024 – 2026" },
      { degree: "Bachelor's in Data", period: "2023 – 2024" },
    ],
  },
  {
    degree: "Vocational Baccalaureate → BTS",
    school: "St Félix-La Salle",
    location: "Nantes, Pays de la Loire",
    period: "2018 – 2023",
    // Ends with the Kosmos work-study (default would be September)
    end: "2023-07",
    programs: [
      { degree: "BTS in Software Programming (2-year degree)", period: "2021 – 2023" },
      { degree: "Vocational Baccalaureate in Computer Science", period: "2018 – 2021" },
    ],
  },
];

// Same ids, categories (keys of i18n past.categories) and stacks as lib/data.js
export const pastProjects = [
  {
    id: "transport-public",
    name: "Public transport feed aggregator",
    category: "École",
    description: "Web platform gathering real-time public transport data from across France: RATP (Paris), NaoLib (Nantes), TCL (Lyon) and other networks.",
    stack: ["Python", "SQL", "APIs REST"],
    highlights: ["Multi-network integration", "Real-time data", "Unified map interface"],
  },
  {
    id: "trafic-routier",
    name: "Paris road traffic prediction",
    category: "École",
    description: "Software predicting traffic on every road in Paris based on events, time of day and historical data.",
    stack: ["Python", "SQL", "Machine Learning"],
    highlights: ["Per-segment prediction", "Event-aware", "Trained on historical data"],
  },
  {
    id: "stats-badminton",
    name: "Badminton competition statistics",
    category: "École",
    description: "Statistical analysis of competition performance, identifying each player’s strengths and weaknesses across their rallies.",
    stack: ["Python", "SQL", "pandas", "Matplotlib"],
    highlights: ["Strength/weakness profile per player", "Interactive visualisations", "Rally sequence analysis"],
  },
  {
    id: "stats-esport",
    name: "Esports performance statistics",
    category: "Perso",
    description: "Statistical analysis of a video game’s characters to rate their strength in the current meta and build a data-driven tier list.",
    stack: ["Python", "SQL", "pandas", "Matplotlib"],
    highlights: ["Data-driven tier list", "Cross-patch comparison", "Performance dashboard"],
  },
  {
    id: "cnn-minimap",
    name: "CNN — Minimap from a video feed",
    category: "Perso",
    description: "Real-time generation of a game minimap by analysing the video feed with a convolutional neural network.",
    stack: ["Python", "TensorFlow", "OpenCV", "CNN"],
    highlights: ["Frame-by-frame analysis", "Real-time map reconstruction", "Trained on game captures"],
  },
  {
    id: "flux-foule",
    name: "Crowd movement flow analysis",
    category: "Perso",
    description: "Crowd movement prediction model inspired by Fouloscopie, analysing and anticipating pedestrian flow dynamics from videos.",
    stack: ["Python", "SQL", "OpenCV", "scikit-learn"],
    highlights: ["Pedestrian flow detection", "Movement prediction", "Density visualisation"],
  },
  {
    id: "alerting-prtg",
    name: "PRTG & Grafana alerting automation",
    category: "Pro",
    description: "Custom PRTG sensors and Grafana dashboards to automatically detect and report major infrastructure issues.",
    stack: ["Bash", "PowerShell", "Visual Basic", "PRTG", "Grafana"],
    highlights: ["Custom PRTG sensors", "Grafana dashboards", "Automated alerting"],
  },
  {
    id: "gestion-batch",
    name: "Data batch management",
    category: "Pro",
    description: "Orchestrating and monitoring batch jobs with GoAnywhere: automated data flows with error handling and restarts.",
    stack: ["Bash", "PowerShell", "Visual Basic", "GoAnywhere"],
    highlights: ["Batch scheduling", "Run monitoring", "Error handling and restarts"],
  },
  {
    id: "etl-migration",
    name: "PostgreSQL → Snowflake migration ETL",
    category: "Pro",
    description: "End-to-end ETL pipeline migrating and managing a PostgreSQL warehouse’s data in Snowflake, with transformation and validation.",
    stack: ["Python", "SQL", "PostgreSQL", "Snowflake"],
    highlights: ["Full schema migration", "Transformation and validation", "Reproducible pipeline"],
  },
];

export const skills = [
  {
    category: "Data & MLOps",
    // Keys of lib/techIcons.js
    logos: ["snowflake", "airflow", "spark", "kafka", "talend", "qlik", "postgresql", "python", "pandas", "numpy", "scikitlearn", "tensorflow", "pytorch", "mlflow"],
    items: ["ETL & pipelines (Airflow, Talend)", "MLOps (CI/CD, MLflow)", "Big Data (Spark, Kafka, Snowflake)", "ML models (pandas, scikit-learn)", "Deep Learning (TensorFlow, PyTorch)"],
  },
  {
    category: "Infrastructure",
    logos: ["docker", "kubernetes", "linux", "windows", "aws", "azure", "grafana", "prtg", "bash", "powershell", "nginx", "n8n", "jira", "git"],
    items: ["Containers (Docker, Kubernetes)", "Cloud (AWS, Azure)", "Windows & Linux administration", "Monitoring & alerting (Grafana, PRTG)", "Workflow automation (n8n)"],
  },
  {
    category: "Development",
    // No brand logos here: one card per skill, `icon` = key of SKILL_ICONS (app/components/SkillCards.js)
    cards: [
      { icon: "chart", label: "Data processing", detail: "NumPy, Matplotlib" },
      { icon: "mobile", label: "Web & mobile apps" },
      { icon: "terminal", label: "Daemon development" },
      { icon: "chip", label: "Embedded sensor" },
      { icon: "server", label: "Network equipment" },
    ],
  },
];
