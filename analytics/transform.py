"""Build analytics-ready star schema files and the dashboard JSON bundle."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd

from .config import DATA_ANALYTICS, DATA_PROCESSED, GEO_TYPE, POWERBI_DIR, PROVINCE_CODES, TABLES


def _pivot_counts(df: pd.DataFrame) -> pd.DataFrame:
    counts = df[df["measure"] == "count"].copy()
    if counts.empty:
        return pd.DataFrame()
    wide = counts.pivot_table(
        index=["year", "geo_code", "geo_name", "geo_type"],
        columns="category",
        values="value",
        aggfunc="first",
    )
    wide.columns = [str(c) for c in wide.columns]
    return wide.reset_index()


def _pivot_percents(df: pd.DataFrame) -> pd.DataFrame:
    percents = df[df["measure"] == "percent"].copy()
    if percents.empty:
        return pd.DataFrame()
    wide = percents.pivot_table(
        index=["year", "geo_code", "geo_name", "geo_type"],
        columns="category",
        values="value",
        aggfunc="first",
    )
    wide.columns = [f"{c}_pct" for c in wide.columns]
    return wide.reset_index()


def _rate(num, den) -> float | None:
    if den is None or pd.isna(den) or den == 0 or num is None or pd.isna(num):
        return None
    return round(float(num) / float(den) * 100, 2)


def _series_rate(num: pd.Series, den: pd.Series) -> pd.Series:
    out = np.where((den > 0) & num.notna() & den.notna(), num / den * 100, np.nan)
    return pd.Series(out, index=num.index).round(2)


def fact_knowledge(df: pd.DataFrame) -> pd.DataFrame:
    subset = df[(df["theme"] == "knowledge") & (df["immigrant_status_key"] == "total")]
    wide = _pivot_counts(subset)
    if wide.empty:
        return wide
    if "total" not in wide.columns:
        parts = [c for c in ["english_only", "french_only", "english_and_french", "neither"] if c in wide.columns]
        wide["total"] = wide[parts].sum(axis=1, min_count=1)
    wide["bilingual_rate"] = _series_rate(wide.get("english_and_french", pd.Series(index=wide.index, dtype=float)), wide["total"])
    wide["french_only_rate"] = _series_rate(wide.get("french_only", pd.Series(index=wide.index, dtype=float)), wide["total"])
    wide["english_only_rate"] = _series_rate(wide.get("english_only", pd.Series(index=wide.index, dtype=float)), wide["total"])
    pct = _pivot_percents(subset)
    if not pct.empty and wide["bilingual_rate"].isna().any():
        wide = wide.merge(pct, on=["year", "geo_code", "geo_name", "geo_type"], how="left")
        if "english_and_french_pct" in wide.columns:
            wide["bilingual_rate"] = wide["bilingual_rate"].fillna(wide["english_and_french_pct"])
    wide["source_table"] = "15-10-0004-01"
    return wide


def fact_simple(df: pd.DataFrame, theme: str, french_keys: list[str], source: str) -> pd.DataFrame:
    subset = df[(df["theme"] == theme) & (df["immigrant_status_key"] == "total")]
    wide = _pivot_counts(subset)
    if wide.empty:
        return wide
    if "total" not in wide.columns:
        numeric = wide.select_dtypes(include=[np.number]).drop(columns=["year"], errors="ignore")
        wide["total"] = numeric.sum(axis=1, min_count=1)
    french_col = next((k for k in french_keys if k in wide.columns), None)
    wide["french_count"] = wide[french_col] if french_col else np.nan
    wide["french_rate"] = _series_rate(wide["french_count"], wide["total"])
    pct = _pivot_percents(subset)
    if not pct.empty:
        wide = wide.merge(pct, on=["year", "geo_code", "geo_name", "geo_type"], how="left")
        pct_col = next((c for c in wide.columns if c.startswith("french") and c.endswith("_pct")), None)
        if pct_col:
            wide["french_rate"] = wide["french_rate"].fillna(wide[pct_col])
    wide["source_table"] = source
    wide["theme"] = theme
    return wide


def fact_immigrant(df: pd.DataFrame) -> pd.DataFrame:
    subset = df[df["theme"] == "immigrant"]
    counts = subset[subset["measure"] == "count"]
    if counts.empty:
        return pd.DataFrame()
    wide = counts.pivot_table(
        index=["year", "geo_code", "geo_name", "geo_type", "immigrant_status_key", "immigrant_status"],
        columns="category",
        values="value",
        aggfunc="first",
    )
    wide.columns = [str(c) for c in wide.columns]
    wide = wide.reset_index()
    if "total" not in wide.columns:
        parts = [c for c in ["english_only", "french_only", "english_and_french", "neither"] if c in wide.columns]
        wide["total"] = wide[parts].sum(axis=1, min_count=1)
    wide["bilingual_rate"] = _series_rate(wide.get("english_and_french", pd.Series(index=wide.index, dtype=float)), wide["total"])
    french_know = pd.Series(0.0, index=wide.index)
    if "french_only" in wide.columns:
        french_know = french_know.add(wide["french_only"].fillna(0), fill_value=0)
    if "english_and_french" in wide.columns:
        french_know = french_know.add(wide["english_and_french"].fillna(0), fill_value=0)
    wide["french_knowledge_count"] = french_know
    wide["french_knowledge_rate"] = _series_rate(wide["french_knowledge_count"], wide["total"])
    wide["source_table"] = "15-10-0037-01"
    return wide


def dim_geography() -> pd.DataFrame:
    rows = []
    region = {
        "CA": "National",
        "CA-XQ": "National",
        "NL": "Atlantic",
        "PE": "Atlantic",
        "NS": "Atlantic",
        "NB": "Atlantic",
        "QC": "Central",
        "ON": "Central",
        "MB": "Prairies",
        "SK": "Prairies",
        "AB": "Prairies",
        "BC": "West",
        "YT": "North",
        "NT": "North",
        "NU": "North",
    }
    for name, code in PROVINCE_CODES.items():
        rows.append(
            {
                "geo_code": code,
                "geo_name": name,
                "geo_type": GEO_TYPE[code],
                "region": region[code],
            }
        )
    return pd.DataFrame(rows)


def _row_lookup(df: pd.DataFrame, year: int, geo: str) -> pd.Series | None:
    hit = df[(df["year"] == year) & (df["geo_code"] == geo)]
    if hit.empty:
        return None
    return hit.iloc[0]


def build_bundle(
    knowledge: pd.DataFrame,
    mother: pd.DataFrame,
    fols: pd.DataFrame,
    home: pd.DataFrame,
    immigrant: pd.DataFrame,
    work: pd.DataFrame,
    quality: dict,
) -> dict:
    latest = int(knowledge["year"].max()) if not knowledge.empty else 2021
    canada = _row_lookup(knowledge, latest, "CA")
    mother_year = int(mother["year"].max()) if not mother.empty else None
    mother_ca = _row_lookup(mother, mother_year, "CA") if mother_year else None
    fols_ca = _row_lookup(fols, latest, "CA") if not fols.empty else None
    home_ca = _row_lookup(home, latest, "CA") if not home.empty else None
    work_ca = _row_lookup(work, 2021, "CA") if not work.empty else None

    def rec(series: pd.Series | None, fields: dict) -> dict:
        if series is None:
            return {k: None for k in fields}
        return {k: (None if pd.isna(series.get(src)) else series.get(src)) for k, src in fields.items()}

    canada_latest = {
        "year": latest,
        "population": None if canada is None else _num(canada.get("total")),
        **rec(
            canada,
            {
                "english_only": "english_only",
                "french_only": "french_only",
                "english_and_french": "english_and_french",
                "neither": "neither",
                "bilingual_rate": "bilingual_rate",
                "french_only_rate": "french_only_rate",
            },
        ),
        "french_mother_tongue": None if mother_ca is None else _num(mother_ca.get("french_count")),
        "french_mother_tongue_rate": None if mother_ca is None else _num(mother_ca.get("french_rate")),
        "french_mother_tongue_year": mother_year,
        "french_fols": None if fols_ca is None else _num(fols_ca.get("french_count")),
        "french_fols_rate": None if fols_ca is None else _num(fols_ca.get("french_rate")),
        "french_home": None if home_ca is None else _num(home_ca.get("french_count")),
        "french_home_rate": None if home_ca is None else _num(home_ca.get("french_rate")),
        "french_work": None if work_ca is None else _num(work_ca.get("french_count")),
        "french_work_rate": None if work_ca is None else _num(work_ca.get("french_rate")),
    }

    bilingualism_trend = _records(
        knowledge[["year", "geo_code", "geo_name", "total", "english_and_french", "bilingual_rate"]].rename(
            columns={"total": "population", "english_and_french": "bilingual_count"}
        )
    )
    provincial_latest = []
    geos = knowledge[knowledge["year"] == latest]
    for _, row in geos.iterrows():
        code = row["geo_code"]
        m = _row_lookup(mother, mother_year, code) if mother_year else None
        f = _row_lookup(fols, latest, code) if not fols.empty else None
        h = _row_lookup(home, latest, code) if not home.empty else None
        w = _row_lookup(work, 2021, code) if not work.empty else None
        provincial_latest.append(
            {
                "geo_code": code,
                "geo_name": row["geo_name"],
                "geo_type": row["geo_type"],
                "year": latest,
                "population": _num(row.get("total")),
                "bilingual_rate": _num(row.get("bilingual_rate")),
                "bilingual_count": _num(row.get("english_and_french")),
                "french_only_rate": _num(row.get("french_only_rate")),
                "french_mother_tongue_rate": None if m is None else _num(m.get("french_rate")),
                "french_mother_tongue_year": mother_year,
                "french_fols_rate": None if f is None else _num(f.get("french_rate")),
                "french_home_rate": None if h is None else _num(h.get("french_rate")),
                "french_work_rate": None if w is None else _num(w.get("french_rate")),
            }
        )

    immigrant_trend = []
    if not immigrant.empty:
        keep = immigrant[immigrant["immigrant_status_key"].isin(["immigrants", "non_immigrants", "total"])]
        immigrant_trend = _records(
            keep[
                [
                    "year",
                    "geo_code",
                    "geo_name",
                    "immigrant_status_key",
                    "immigrant_status",
                    "total",
                    "bilingual_rate",
                    "french_knowledge_rate",
                    "french_knowledge_count",
                ]
            ]
        )

    sources = [
        {
            "key": t["key"],
            "table": t["table"],
            "title": t["title"],
            "url": t["url"],
            "organization": "Statistics Canada",
            "licence": "Open Government Licence – Canada",
        }
        for t in TABLES
    ]

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "latest_year": latest,
        "census_years": sorted(knowledge["year"].dropna().unique().tolist()) if not knowledge.empty else [],
        "sources": sources,
        "canada_latest": canada_latest,
        "bilingualism_trend": bilingualism_trend,
        "mother_tongue_trend": _records(
            mother[["year", "geo_code", "geo_name", "total", "french_count", "french_rate"]]
        )
        if not mother.empty
        else [],
        "fols_trend": _records(fols[["year", "geo_code", "geo_name", "total", "french_count", "french_rate"]])
        if not fols.empty
        else [],
        "home_trend": _records(home[["year", "geo_code", "geo_name", "total", "french_count", "french_rate"]])
        if not home.empty
        else [],
        "work_latest": _records(work[["year", "geo_code", "geo_name", "total", "french_count", "french_rate"]])
        if not work.empty
        else [],
        "provincial_latest": provincial_latest,
        "immigrant_trend": immigrant_trend,
        "quality": quality,
    }


def _num(value) -> float | int | None:
    if value is None or (isinstance(value, float) and np.isnan(value)) or pd.isna(value):
        return None
    if isinstance(value, (int, np.integer)):
        return int(value)
    f = float(value)
    if f.is_integer() and abs(f) >= 1:
        return int(f)
    return round(f, 2)


def _records(df: pd.DataFrame) -> list[dict]:
    if df is None or df.empty:
        return []
    clean = df.replace({np.nan: None})
    return json.loads(clean.to_json(orient="records"))


def write_outputs(
    long_df: pd.DataFrame,
    knowledge: pd.DataFrame,
    mother: pd.DataFrame,
    fols: pd.DataFrame,
    home: pd.DataFrame,
    immigrant: pd.DataFrame,
    work: pd.DataFrame,
    bundle: dict,
) -> None:
    DATA_PROCESSED.mkdir(parents=True, exist_ok=True)
    DATA_ANALYTICS.mkdir(parents=True, exist_ok=True)
    POWERBI_DIR.mkdir(parents=True, exist_ok=True)

    long_df.to_csv(DATA_PROCESSED / "official_languages_long.csv", index=False)
    knowledge.to_csv(DATA_PROCESSED / "fact_knowledge_official_languages.csv", index=False)
    if not mother.empty:
        mother.to_csv(DATA_PROCESSED / "fact_mother_tongue.csv", index=False)
    if not fols.empty:
        fols.to_csv(DATA_PROCESSED / "fact_first_official_language.csv", index=False)
    if not home.empty:
        home.to_csv(DATA_PROCESSED / "fact_home_language.csv", index=False)
    if not immigrant.empty:
        immigrant.to_csv(DATA_PROCESSED / "fact_immigrant_official_languages.csv", index=False)
    if not work.empty:
        work.to_csv(DATA_PROCESSED / "fact_language_at_work.csv", index=False)

    geo = dim_geography()
    geo.to_csv(POWERBI_DIR / "dim_geography.csv", index=False)
    years = sorted(long_df["year"].dropna().unique().astype(int).tolist())
    pd.DataFrame({"year": years, "census_cycle": years}).to_csv(POWERBI_DIR / "dim_year.csv", index=False)

    knowledge.to_csv(POWERBI_DIR / "fact_knowledge_official_languages.csv", index=False)
    if not mother.empty:
        mother.to_csv(POWERBI_DIR / "fact_mother_tongue.csv", index=False)
    if not fols.empty:
        fols.to_csv(POWERBI_DIR / "fact_first_official_language.csv", index=False)
    if not home.empty:
        home.to_csv(POWERBI_DIR / "fact_home_language.csv", index=False)
    if not immigrant.empty:
        immigrant.to_csv(POWERBI_DIR / "fact_immigrant_official_languages.csv", index=False)
    if not work.empty:
        work.to_csv(POWERBI_DIR / "fact_language_at_work.csv", index=False)
    pd.DataFrame(bundle["provincial_latest"]).to_csv(POWERBI_DIR / "fact_provincial_snapshot.csv", index=False)

    bundle_path = DATA_ANALYTICS / "dashboard_bundle.json"
    bundle_path.write_text(json.dumps(bundle, indent=2), encoding="utf-8")
    (DATA_ANALYTICS / "data_quality.json").write_text(json.dumps(bundle.get("quality", {}), indent=2), encoding="utf-8")
    print(f"Wrote {bundle_path}")
