"""Deterministic insights derived from processed Canadian language tables."""

from __future__ import annotations

from typing import Any

import pandas as pd


def _fmt_rate(value: float | None) -> str:
    if value is None or pd.isna(value):
        return "n/a"
    return f"{value:.1f}%"


def _fmt_year(value: int) -> str:
    return str(int(value))


def build_insights(
    knowledge: pd.DataFrame,
    home: pd.DataFrame,
    work: pd.DataFrame,
    immigrant: pd.DataFrame,
) -> list[dict[str, Any]]:
    insights: list[dict[str, Any]] = []
    if knowledge.empty:
        return insights

    ca = knowledge[knowledge["geo_code"] == "CA"].sort_values("year")
    if len(ca) >= 2:
        first, last = ca.iloc[0], ca.iloc[-1]
        delta = last["bilingual_rate"] - first["bilingual_rate"]
        direction = "increased" if delta > 0 else "decreased" if delta < 0 else "was unchanged"
        insights.append(
            {
                "id": "bilingualism_long_run",
                "question": "How has French-English bilingualism changed in Canada over time?",
                "text": (
                    f"English–French bilingualism in Canada {direction} from "
                    f"{_fmt_rate(first['bilingual_rate'])} in {_fmt_year(first['year'])} "
                    f"to {_fmt_rate(last['bilingual_rate'])} in {_fmt_year(last['year'])} "
                    f"(change of {delta:+.1f} percentage points)."
                ),
                "metric": "bilingual_rate",
                "geo": "Canada",
                "start_year": int(first["year"]),
                "end_year": int(last["year"]),
                "start_value": _num(first["bilingual_rate"]),
                "end_value": _num(last["bilingual_rate"]),
                "unit": "percent",
                "source_table": "15-10-0004-01",
            }
        )
        recent = ca[ca["year"] >= 2001]
        if len(recent) >= 2:
            a, b = recent.iloc[0], recent.iloc[-1]
            d2 = b["bilingual_rate"] - a["bilingual_rate"]
            insights.append(
                {
                    "id": "bilingualism_recent",
                    "question": "How has bilingualism changed since 2001?",
                    "text": (
                        f"Between {_fmt_year(a['year'])} and {_fmt_year(b['year'])}, "
                        f"the Canadian bilingualism rate changed from {_fmt_rate(a['bilingual_rate'])} "
                        f"to {_fmt_rate(b['bilingual_rate'])} ({d2:+.1f} pp)."
                    ),
                    "metric": "bilingual_rate",
                    "geo": "Canada",
                    "start_year": int(a["year"]),
                    "end_year": int(b["year"]),
                    "start_value": _num(a["bilingual_rate"]),
                    "end_value": _num(b["bilingual_rate"]),
                    "unit": "percent",
                    "source_table": "15-10-0004-01",
                }
            )

    latest_year = int(knowledge["year"].max())
    prov = knowledge[
        (knowledge["year"] == latest_year) & (knowledge["geo_type"] == "province")
    ].dropna(subset=["bilingual_rate"])
    if not prov.empty:
        top = prov.sort_values("bilingual_rate", ascending=False).iloc[0]
        insights.append(
            {
                "id": "highest_provincial_bilingualism",
                "question": "Which provinces have the highest levels of French-English bilingualism?",
                "text": (
                    f"Among provinces, {top['geo_name']} had the highest English–French bilingualism rate "
                    f"in {latest_year} at {_fmt_rate(top['bilingual_rate'])}."
                ),
                "metric": "bilingual_rate",
                "geo": top["geo_name"],
                "start_year": latest_year,
                "end_year": latest_year,
                "start_value": _num(top["bilingual_rate"]),
                "end_value": _num(top["bilingual_rate"]),
                "unit": "percent",
                "source_table": "15-10-0004-01",
            }
        )

    qc = knowledge[(knowledge["geo_code"] == "QC")].sort_values("year")
    xq = knowledge[(knowledge["geo_code"] == "CA-XQ")].sort_values("year")
    if not qc.empty and not xq.empty:
        q, x = qc.iloc[-1], xq.iloc[-1]
        insights.append(
            {
                "id": "quebec_vs_roc",
                "question": "How does French usage differ geographically?",
                "text": (
                    f"In {int(q['year'])}, English–French bilingualism was "
                    f"{_fmt_rate(q['bilingual_rate'])} in Quebec and "
                    f"{_fmt_rate(x['bilingual_rate'])} in Canada outside Quebec. "
                    f"These are different language regimes; the gap is descriptive, not a ranking of quality."
                ),
                "metric": "bilingual_rate",
                "geo": "Quebec vs Canada outside Quebec",
                "start_year": int(q["year"]),
                "end_year": int(x["year"]),
                "start_value": _num(q["bilingual_rate"]),
                "end_value": _num(x["bilingual_rate"]),
                "unit": "percent",
                "source_table": "15-10-0004-01",
            }
        )

    if not home.empty:
        home_latest = home[(home["year"] == home["year"].max()) & (home["geo_type"] == "province")]
        home_latest = home_latest.dropna(subset=["french_rate"])
        if not home_latest.empty:
            top_h = home_latest.sort_values("french_rate", ascending=False).iloc[0]
            insights.append(
                {
                    "id": "french_at_home",
                    "question": "Where is French most commonly used at home?",
                    "text": (
                        f"In {int(top_h['year'])}, {top_h['geo_name']} had the highest share of people "
                        f"speaking French most often at home among provinces "
                        f"({_fmt_rate(top_h['french_rate'])})."
                    ),
                    "metric": "french_home_rate",
                    "geo": top_h["geo_name"],
                    "start_year": int(top_h["year"]),
                    "end_year": int(top_h["year"]),
                    "start_value": _num(top_h["french_rate"]),
                    "end_value": _num(top_h["french_rate"]),
                    "unit": "percent",
                    "source_table": "15-10-0033-01",
                }
            )

    if not work.empty and not home.empty:
        merged = home[home["year"] == home["year"].max()][["geo_code", "geo_name", "french_rate"]].merge(
            work[["geo_code", "french_rate"]],
            on="geo_code",
            suffixes=("_home", "_work"),
        )
        ca_row = merged[merged["geo_code"] == "CA"]
        if not ca_row.empty:
            r = ca_row.iloc[0]
            insights.append(
                {
                    "id": "home_vs_work_canada",
                    "question": "Where is French most commonly used in the workplace?",
                    "text": (
                        f"In Canada ({int(home['year'].max())} home language; 2021 workplace), "
                        f"French spoken most often at home was {_fmt_rate(r['french_rate_home'])} "
                        f"while French used most often at work was {_fmt_rate(r['french_rate_work'])}. "
                        f"Home and workplace language measure different populations and should not be treated as the same behaviour."
                    ),
                    "metric": "french_home_rate vs french_work_rate",
                    "geo": "Canada",
                    "start_year": int(home["year"].max()),
                    "end_year": 2021,
                    "start_value": _num(r["french_rate_home"]),
                    "end_value": _num(r["french_rate_work"]),
                    "unit": "percent",
                    "source_table": "15-10-0033-01 and 98-10-0533-01",
                }
            )

    if not immigrant.empty:
        latest_i = int(immigrant["year"].max())
        focus = immigrant[
            (immigrant["year"] == latest_i)
            & (immigrant["geo_code"].isin(["CA", "QC", "CA-XQ"]))
            & (immigrant["immigrant_status_key"] == "immigrants")
        ]
        for _, row in focus.iterrows():
            insights.append(
                {
                    "id": f"immigrant_french_{row['geo_code']}_{latest_i}",
                    "question": "How does French knowledge vary among newcomers?",
                    "text": (
                        f"In {latest_i}, among immigrants in {row['geo_name']}, "
                        f"{_fmt_rate(row['french_knowledge_rate'])} could converse in French "
                        f"(French only or English and French). "
                        f"This is a Census knowledge measure, not a sample of learners in this app."
                    ),
                    "metric": "french_knowledge_rate",
                    "geo": row["geo_name"],
                    "start_year": latest_i,
                    "end_year": latest_i,
                    "start_value": _num(row["french_knowledge_rate"]),
                    "end_value": _num(row["french_knowledge_rate"]),
                    "unit": "percent",
                    "source_table": "15-10-0037-01",
                }
            )

    return insights


def _num(value) -> float | None:
    if value is None or pd.isna(value):
        return None
    return round(float(value), 2)
