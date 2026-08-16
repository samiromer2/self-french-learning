#!/usr/bin/env python3
"""Source → raw → clean → transform → analytics.

Usage (from the repository root):

    python3 -m analytics.run_pipeline
    python3 analytics/run_pipeline.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd

from analytics.clean import clean_historical, clean_work
from analytics.config import DATA_ANALYTICS, DATA_PROCESSED, DATA_RAW, TABLES
from analytics.ingest import ingest_all
from analytics.insights import build_insights
from analytics.sqlite_load import load_sqlite
from analytics.transform import (
    build_bundle,
    dim_geography,
    fact_immigrant,
    fact_knowledge,
    fact_simple,
    write_outputs,
)
from analytics.validate import validate_long


def _path_for(record: dict) -> Path | None:
    if not record.get("ok") or not record.get("path"):
        return None
    return Path(record["path"])


def main() -> int:
    DATA_RAW.mkdir(parents=True, exist_ok=True)
    DATA_PROCESSED.mkdir(parents=True, exist_ok=True)
    DATA_ANALYTICS.mkdir(parents=True, exist_ok=True)

    print("=== 1. Ingest ===")
    ingest_records = ingest_all()
    by_key = {r["key"]: r for r in ingest_records}

    print("=== 2. Clean ===")
    frames: list[pd.DataFrame] = []
    work = pd.DataFrame()
    for table in TABLES:
        record = by_key[table["key"]]
        path = _path_for(record)
        if path is None:
            continue
        if table["theme"] == "work":
            if path.name == "work_province_extract.csv":
                print("  loading processed work extract")
                frames.append(pd.read_csv(path))
                continue
            print(f"  cleaning work table {table['table']} (chunked)")
            work = clean_work(path)
            if not work.empty:
                frames.append(work)
            else:
                print("  work table produced no usable province-level rows")
            continue
        print(f"  cleaning {table['table']}")
        frames.append(clean_historical(path, table["theme"]))

    long_df = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
    print(f"  long table rows: {len(long_df):,}")

    print("=== 3. Validate ===")
    quality = validate_long(long_df, ingest_records)
    print(f"  status={quality['status']} processed={quality['records_processed']} issues={quality['issues']}")

    print("=== 4. Transform ===")
    knowledge = fact_knowledge(long_df) if not long_df.empty else pd.DataFrame()
    mother = fact_simple(long_df, "mother_tongue", ["french"], "15-10-0003-01")
    fols = fact_simple(long_df, "fols", ["french"], "15-10-0032-01")
    home = fact_simple(long_df, "home", ["french"], "15-10-0033-01")
    immigrant = fact_immigrant(long_df)
    work = fact_simple(long_df, "work", ["french"], "98-10-0533-01")

    print("=== 5. Insights ===")
    insights = build_insights(knowledge, home, work, immigrant)
    quality["insight_count"] = len(insights)

    bundle = build_bundle(knowledge, mother, fols, home, immigrant, work, quality)
    bundle["insights"] = insights
    write_outputs(long_df, knowledge, mother, fols, home, immigrant, work, bundle)

    print("=== 6. SQLite analytics store ===")
    sqlite_path = load_sqlite(knowledge, mother, fols, home, immigrant, work, dim_geography())
    print(f"  {sqlite_path}")

    (DATA_ANALYTICS / "insights.json").write_text(json.dumps(insights, indent=2), encoding="utf-8")
    print("Pipeline complete.")
    return 0 if quality["status"] != "error" else 1


if __name__ == "__main__":
    raise SystemExit(main())
