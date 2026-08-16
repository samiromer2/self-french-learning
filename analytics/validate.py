"""Data-quality checks on cleaned Statistics Canada extracts."""

from __future__ import annotations

from datetime import datetime, timezone

import pandas as pd

from .config import PROVINCE_CODES

VALID_GEOS = set(PROVINCE_CODES.values())


def validate_long(df: pd.DataFrame, ingest_records: list[dict]) -> dict:
    issues: list[str] = []
    rejected = 0

    if df.empty:
        issues.append("Processed long table is empty.")

    missing_geo = int(df["geo_code"].isna().sum()) if not df.empty else 0
    unknown_geo = int((~df["geo_code"].isin(VALID_GEOS)).sum()) if not df.empty else 0
    if missing_geo:
        issues.append(f"{missing_geo} rows missing geo_code.")
        rejected += missing_geo
    if unknown_geo:
        issues.append(f"{unknown_geo} rows with unknown geo_code.")
        rejected += unknown_geo

    if not df.empty:
        if (df["value"] < 0).any():
            n = int((df["value"] < 0).sum())
            issues.append(f"{n} negative values.")
            rejected += n
        pct = df[df["measure"] == "percent"]
        if not pct.empty and (pct["value"] > 100.0001).any():
            n = int((pct["value"] > 100.0001).sum())
            issues.append(f"{n} percent values above 100.")
            rejected += n
        years = df["year"]
        if (years < 1900).any() or (years > datetime.now().year + 1).any():
            issues.append("Invalid years present.")
        dups = int(df.duplicated().sum())
        if dups:
            issues.append(f"{dups} duplicate rows in long table.")

    by_theme = (
        df.groupby("theme").size().to_dict() if not df.empty else {}
    )
    missing_values = int(df.isna().sum().sum()) if not df.empty else 0

    required_ok = all(r["ok"] for r in ingest_records if r.get("required"))
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "records_processed": int(len(df)),
        "records_rejected": rejected,
        "missing_values": missing_values,
        "duplicate_records": int(df.duplicated().sum()) if not df.empty else 0,
        "unknown_geo_rows": unknown_geo,
        "issues": issues,
        "rows_by_theme": {str(k): int(v) for k, v in by_theme.items()},
        "ingest": ingest_records,
        "last_successful_update": datetime.now(timezone.utc).isoformat() if required_ok else None,
        "status": "ok" if required_ok and not issues else ("warning" if required_ok else "error"),
        "licence": "Open Government Licence – Canada",
        "organization": "Statistics Canada",
    }
