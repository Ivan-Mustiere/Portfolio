export const projects = [
  {
    slug: "pipeline-temps-reel",
    title: "Pipeline temps réel",
    description: "Ingestion et transformation de flux événementiels avec Kafka et Spark Streaming.",
    longDescription:
      "Mise en place d'un pipeline de données en temps réel permettant d'ingérer des flux événementiels à haute fréquence, de les transformer et de les exposer aux équipes analytiques.",
    tags: ["Kafka", "Spark", "Python"],
    github: "https://github.com/Ivan-Mustiere",
    highlights: [
      "Ingestion de flux via Kafka avec gestion des partitions et des offsets",
      "Transformation en temps réel avec Spark Streaming",
      "Écriture en sortie vers un data lake (format Parquet)",
      "Monitoring des consommateurs Kafka avec Grafana",
    ],
  },
  {
    slug: "data-warehouse-dbt",
    title: "Data warehouse dbt",
    description: "Modélisation dimensionnelle et tests de qualité automatisés sur BigQuery.",
    longDescription:
      "Construction d'un data warehouse analytique sur BigQuery avec dbt, incluant une modélisation en étoile, des tests de qualité automatisés et une documentation générée.",
    tags: ["dbt", "BigQuery", "SQL"],
    github: "https://github.com/Ivan-Mustiere",
    highlights: [
      "Modélisation dimensionnelle (faits / dimensions)",
      "Tests de qualité des données (unicité, non-nullité, relations)",
      "Documentation auto-générée avec dbt docs",
      "Orchestration des runs dbt via Airflow",
    ],
  },
  {
    slug: "orchestration-airflow",
    title: "Orchestration Airflow",
    description: "DAGs de traitement batch avec alerting et retry automatique.",
    longDescription:
      "Conception et déploiement de DAGs Airflow pour orchestrer des pipelines batch complexes, avec gestion des dépendances, retry automatique et alerting en cas d'échec.",
    tags: ["Airflow", "Docker", "Python"],
    github: "https://github.com/Ivan-Mustiere",
    highlights: [
      "DAGs paramétrés et réutilisables",
      "Retry automatique avec backoff exponentiel",
      "Alerting par email et webhook en cas d'échec",
      "Déploiement Airflow conteneurisé avec Docker Compose",
    ],
  },
  {
    slug: "observabilite-donnees",
    title: "Observabilité données",
    description: "Monitoring de la qualité des données avec Great Expectations et dashboards Grafana.",
    longDescription:
      "Mise en place d'un système d'observabilité des données combinant Great Expectations pour les tests de qualité et Grafana pour la visualisation des métriques.",
    tags: ["Great Expectations", "Grafana", "PostgreSQL"],
    github: "https://github.com/Ivan-Mustiere",
    highlights: [
      "Suites de tests Great Expectations sur les tables critiques",
      "Stockage des résultats de validation en base PostgreSQL",
      "Dashboards Grafana avec alertes seuils",
      "Rapport de qualité automatisé à chaque run de pipeline",
    ],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}
