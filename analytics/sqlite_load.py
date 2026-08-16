"""Load processed facts into SQLite for analytical SQL (separate from the app database)."""

from __future__ import annotations

import sqlite3
from pathlib import Path

import pandas as pd

from .config import DATA_ANALYTICS


def load_sqlite(
    knowledge: pd.DataFrame,
    mother: pd.DataFrame,
    fols: pd.DataFrame,
    home: pd.DataFrame,
    immigrant: pd.DataFrame,
    work: pd.DataFrame,
    geography: pd.DataFrame,
) -> Path:
    path = DATA_ANALYTICS / "french_canada.sqlite"
    if path.exists():
        path.unlink()
    conn = sqlite3.connect(path)
    try:
        knowledge.to_sql("fact_knowledge", conn, index=False, if_exists="replace")
        if not mother.empty:
            mother.to_sql("fact_mother_tongue", conn, index=False, if_exists="replace")
        if not fols.empty:
            fols.to_sql("fact_fols", conn, index=False, if_exists="replace")
        if not home.empty:
            home.to_sql("fact_home_language", conn, index=False, if_exists="replace")
        if not immigrant.empty:
            immigrant.to_sql("fact_immigrant", conn, index=False, if_exists="replace")
        if not work.empty:
            work.to_sql("fact_work", conn, index=False, if_exists="replace")
        geography.to_sql("dim_geography", conn, index=False, if_exists="replace")
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_knowledge_year_geo ON fact_knowledge(year, geo_code)"
        )
    finally:
        conn.close()
    return path
