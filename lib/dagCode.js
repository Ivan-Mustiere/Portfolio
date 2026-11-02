// Python source shown in the "Code" tab of the pipeline. Matches TASKS/EDGES in PipelineDag.js.
export const DAG_CODE = `from datetime import datetime, timedelta

from airflow import DAG
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from airflow.providers.common.sql.operators.sql import SQLCheckOperator, SQLExecuteQueryOperator
from airflow.providers.http.operators.http import HttpOperator
from airflow.providers.snowflake.operators.snowflake import SnowflakeOperator
from airflow.operators.python import PythonOperator

from reporting import refresh_qlik_app, retrain_and_register  # internal helpers

default_args = {
    "owner": "data-platform",
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="daily_reporting",
    schedule="0 5 * * *",  # every day at 05:00
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["reporting", "snowflake"],
) as dag:
    extract_crm_api = HttpOperator(
        task_id="extract_crm_api",
        http_conn_id="crm_api",
        endpoint="/v2/exports/daily",
        response_filter=lambda r: r.json()["file_url"],
    )

    extract_postgres = SQLExecuteQueryOperator(
        task_id="extract_postgres",
        conn_id="postgres_prod",
        sql="sql/extract_documents.sql",
    )

    transform_spark = SparkSubmitOperator(
        task_id="transform_spark",
        application="jobs/transform_documents.py",
        conf={"spark.sql.shuffle.partitions": "64"},
    )

    quality_checks = SQLCheckOperator(
        task_id="quality_checks",
        conn_id="snowflake_dwh",
        sql="SELECT COUNT(*) > 0 AND COUNT_IF(patient_id IS NULL) = 0 FROM staging.documents",
    )

    load_snowflake = SnowflakeOperator(
        task_id="load_snowflake",
        snowflake_conn_id="snowflake_dwh",
        sql="sql/merge_into_dwh.sql",
    )

    refresh_qlik = PythonOperator(task_id="refresh_qlik", python_callable=refresh_qlik_app)
    retrain_model = PythonOperator(task_id="retrain_model", python_callable=retrain_and_register)

    [extract_crm_api, extract_postgres] >> transform_spark >> quality_checks >> load_snowflake
    load_snowflake >> [refresh_qlik, retrain_model]
`;

const KEYWORDS = new Set(["from", "import", "with", "as", "lambda", "def", "return", "and", "or", "not", "is", "in", "if", "else", "for", "None", "True", "False"]);

// Minimal Python tokenizer for display: comments, strings, numbers, keywords, classes, calls,
// and keyword arguments (an identifier followed by "=" inside brackets)
export function highlightPython(code) {
  const tokens = [];
  const re = /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d"'#]+)/g;
  let depth = 0;
  let m;
  while ((m = re.exec(code))) {
    const [text, comment, string, number, ident, , punct] = m;
    let kind = "plain";
    if (comment) kind = "comment";
    else if (string) kind = "string";
    else if (number) kind = "number";
    else if (ident) {
      const next = code.slice(re.lastIndex).match(/^\s*(==|=|\()?/)[1];
      if (KEYWORDS.has(ident)) kind = "keyword";
      else if (next === "=" && depth > 0) kind = "kwarg";
      else if (next === "(") kind = /^[A-Z]/.test(ident) ? "class" : "call";
      else if (/^[A-Z]/.test(ident)) kind = "class";
    } else if (punct) {
      for (const ch of punct) depth += "([{".includes(ch) ? 1 : ")]}".includes(ch) ? -1 : 0;
    }
    tokens.push({ text, kind });
  }
  return tokens;
}
