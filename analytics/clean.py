"""Clean Statistics Canada extracts into normalized long tables."""

from __future__ import annotations

import re
from pathlib import Path

import numpy as np
import pandas as pd

from .config import DATA_PROCESSED, GEO_TYPE, PROVINCE_CODES

META_COLS = {
    "REF_DATE",
    "GEO",
    "DGUID",
    "UOM",
    "UOM_ID",
    "SCALAR_FACTOR",
    "SCALAR_ID",
    "VECTOR",
    "COORDINATE",
    "VALUE",
    "STATUS",
    "SYMBOL",
    "TERMINATED",
    "DECIMALS",
}

GEO_ALIASES = {
    "québec": "Quebec",
    "quebec": "Quebec",
    "newfoundland and labrador": "Newfoundland and Labrador",
    "newfoundland": "Newfoundland and Labrador",
    "prince edward island": "Prince Edward Island",
    "nova scotia": "Nova Scotia",
    "new brunswick": "New Brunswick",
    "ontario": "Ontario",
    "manitoba": "Manitoba",
    "saskatchewan": "Saskatchewan",
    "alberta": "Alberta",
    "british columbia": "British Columbia",
    "yukon": "Yukon",
    "northwest territories": "Northwest Territories",
    "nunavut": "Nunavut",
    "canada": "Canada",
    "canada outside quebec": "Canada outside Quebec",
    "canada outside québec": "Canada outside Quebec",
}


def read_statcan_csv(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, encoding="utf-8-sig", low_memory=False)
    df.columns = [re.sub(r"\s+", " ", str(c)).strip() for c in df.columns]
    return df


def normalize_geo(value: object) -> str | None:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return None
    text = str(value).strip()
    text = re.sub(r"\s*\[[^\]]+\]\s*$", "", text).strip()
    key = re.sub(r"\s+", " ", text.lower()).strip()
    if "including nunavut" in key:
        return None
    if key in GEO_ALIASES:
        return GEO_ALIASES[key]
    if "," in text or " part" in key:
        return None
    return GEO_ALIASES.get(key)


def is_percent_row(row: pd.Series) -> bool:
    uom = str(row.get("UOM", "")).lower()
    stats = str(row.get("Statistics", row.get("Statistics (3)", ""))).lower()
    return "percent" in uom or "percent" in stats or "percentage" in stats


def _dimension_columns(df: pd.DataFrame) -> list[str]:
    skip = META_COLS | {"Statistics", "Multiple responses"}
    return [c for c in df.columns if c not in skip]


def _usable_value(df: pd.DataFrame) -> pd.Series:
    status = df["STATUS"].astype(str).str.strip() if "STATUS" in df.columns else ""
    values = pd.to_numeric(df["VALUE"], errors="coerce")
    if isinstance(status, pd.Series):
        suppressed = status.isin(["..", "...", "x", "X", "F", "F."])
        values = values.mask(suppressed)
    return values


def _collapse_category(label: str) -> str | None:
    t = re.sub(r"\s+", " ", str(label)).strip().lower()
    t = re.sub(r"\[\d+\]$", "", t).strip()
    t = t.replace("(s)", "").strip()
    mapping = {
        "total": "total",
        "english only": "english_only",
        "french only": "french_only",
        "english and french": "english_and_french",
        "both english and french": "english_and_french",
        "neither english nor french": "neither",
        "neither": "neither",
        "english": "english",
        "french": "french",
        "non-official languages": "non_official",
        "non-official language": "non_official",
        "english and non-official language": "english_and_non_official",
        "french and non-official language": "french_and_non_official",
        "english, french and non-official language": "english_french_and_non_official",
        "multiple non-official languages": "multiple_non_official",
        "immigrants": "immigrants",
        "non-immigrants": "non_immigrants",
        "non-permanent residents": "non_permanent_residents",
        "total - language used most often at work": "total",
    }
    if t in mapping:
        return mapping[t]
    if t.startswith("total"):
        return "total"
    if "english and french" in t and "non-official" not in t:
        return "english_and_french"
    if t.startswith("english only"):
        return "english_only"
    if t.startswith("french only"):
        return "french_only"
    if t in {"english", "french"}:
        return t
    return None


def _immigrant_status_key(label: object) -> str | None:
    t = re.sub(r"\s+", " ", str(label)).strip().lower()
    if t.startswith("total"):
        return "total"
    if t == "non-immigrants":
        return "non_immigrants"
    if t == "immigrants":
        return "immigrants"
    if t == "non-permanent residents":
        return "non_permanent_residents"
    return None


def _work_category_from_column(col: str) -> tuple[str, str] | None:
    if "language used most often at work" not in col.lower():
        return None
    if col.lower().startswith("symbol"):
        return None
    label = col.split(":", 1)[-1]
    label = re.sub(r"\[\d+\]$", "", label).strip()
    key = _collapse_category(label)
    if key is None:
        return None
    return key, label


def clean_historical(path: Path, theme: str) -> pd.DataFrame:
    df = read_statcan_csv(path)
    df["geo_name"] = df["GEO"].map(normalize_geo)
    df = df[df["geo_name"].notna()].copy()
    df["geo_code"] = df["geo_name"].map(PROVINCE_CODES)
    df = df[df["geo_code"].notna()].copy()
    df["year"] = pd.to_numeric(df["REF_DATE"], errors="coerce")
    df = df[df["year"].notna()].copy()
    df["year"] = df["year"].astype(int)
    df["value"] = _usable_value(df)
    df = df[df["value"].notna()].copy()

    if "Multiple responses" in df.columns:
        multi = df["Multiple responses"].astype(str).str.strip().str.lower()
        if (multi == "distributed").any():
            df = df[multi.eq("distributed")].copy()

    dims = _dimension_columns(df)
    primary_dim = dims[0] if dims else None

    if theme == "immigrant":
        for candidate in dims:
            if "knowledge of official" in candidate.lower():
                primary_dim = candidate
                break
        status_col = next((c for c in dims if "immigrant" in c.lower()), None)
        raw_status = (
            df[status_col].astype(str) if status_col else pd.Series("Total", index=df.index)
        )
        df["immigrant_status"] = raw_status
        df["immigrant_status_key"] = raw_status.map(_immigrant_status_key)
        df = df[df["immigrant_status_key"].notna()].copy()
    else:
        df["immigrant_status"] = "Total"
        df["immigrant_status_key"] = "total"

    if primary_dim:
        df["category_raw"] = df[primary_dim].astype(str)
    else:
        df["category_raw"] = "total"
    df["category"] = df["category_raw"].map(_collapse_category)
    df = df[df["category"].notna()].copy()

    df["measure"] = np.where(df.apply(is_percent_row, axis=1), "percent", "count")
    df["theme"] = theme
    df["geo_type"] = df["geo_code"].map(GEO_TYPE)
    out = df[
        [
            "theme",
            "year",
            "geo_code",
            "geo_name",
            "geo_type",
            "category",
            "category_raw",
            "measure",
            "value",
            "immigrant_status_key",
            "immigrant_status",
        ]
    ].drop_duplicates()
    out = out[out["value"] >= 0]
    pct = out["measure"].eq("percent")
    out = out[~(pct & (out["value"] > 100.0001))]
    return out.reset_index(drop=True)


def _is_total_label(value: object) -> bool:
    t = str(value).strip().lower()
    return t.startswith("total")


def clean_work(path: Path) -> pd.DataFrame:
    """Extract Canada/province totals from the wide 2021 language-of-work cube."""
    cache = DATA_PROCESSED / "work_province_extract.csv"
    if cache.exists() and cache.stat().st_size > 0:
        print(f"  using cached work extract {cache}")
        return pd.read_csv(cache)

    header = pd.read_csv(path, encoding="utf-8-sig", nrows=0)
    header.columns = [re.sub(r"\s+", " ", str(c)).strip() for c in header.columns]
    work_cols = []
    keep = []
    for col in header.columns:
        if col in {
            "GEO",
            "Mother tongue (9)",
            "Language spoken most often at home (9)",
            "Knowledge of official languages (5)",
            "First official language spoken (5)",
            "Labour force status (2)",
            "Statistics (3)",
            "Other language(s) used regularly at work (10)",
        }:
            keep.append(col)
        parsed = _work_category_from_column(col)
        if parsed:
            keep.append(col)
            work_cols.append(col)

    if not work_cols:
        print("  work table: no language-at-work columns found")
        return pd.DataFrame()

    dim_cols = [
        "Mother tongue (9)",
        "Language spoken most often at home (9)",
        "Knowledge of official languages (5)",
        "First official language spoken (5)",
        "Other language(s) used regularly at work (10)",
    ]
    rows = []
    reader = pd.read_csv(
        path,
        encoding="utf-8-sig",
        usecols=keep,
        chunksize=100_000,
        low_memory=True,
    )
    for chunk in reader:
        chunk.columns = [re.sub(r"\s+", " ", str(c)).strip() for c in chunk.columns]
        chunk["geo_name"] = chunk["GEO"].map(normalize_geo)
        chunk = chunk[chunk["geo_name"].notna()]
        if chunk.empty:
            continue
        for col in dim_cols:
            if col in chunk.columns:
                chunk = chunk[chunk[col].map(_is_total_label)]
        if "Statistics (3)" in chunk.columns:
            stats = chunk["Statistics (3)"].astype(str).str.lower()
            chunk = chunk[stats.eq("count")]
        if "Labour force status (2)" in chunk.columns:
            lf = chunk["Labour force status (2)"].astype(str).str.lower()
            chunk = chunk[lf.str.contains("worked since")]
        if chunk.empty:
            continue
        chunk["geo_code"] = chunk["geo_name"].map(PROVINCE_CODES)
        chunk = chunk[chunk["geo_code"].notna()]
        rows.append(chunk)

    if not rows:
        return pd.DataFrame()

    wide = pd.concat(rows, ignore_index=True).drop_duplicates(subset=["geo_code"])
    long_rows = []
    for _, row in wide.iterrows():
        for col in work_cols:
            parsed = _work_category_from_column(col)
            if not parsed:
                continue
            category, label = parsed
            value = pd.to_numeric(row.get(col), errors="coerce")
            if pd.isna(value) or value < 0:
                continue
            long_rows.append(
                {
                    "theme": "work",
                    "year": 2021,
                    "geo_code": row["geo_code"],
                    "geo_name": row["geo_name"],
                    "geo_type": GEO_TYPE.get(row["geo_code"]),
                    "category": category,
                    "category_raw": label,
                    "measure": "count",
                    "value": float(value),
                    "immigrant_status_key": "total",
                    "immigrant_status": "Total",
                }
            )
    out = pd.DataFrame(long_rows)
    if out.empty:
        return out
    DATA_PROCESSED.mkdir(parents=True, exist_ok=True)
    out.to_csv(cache, index=False)
    return out
