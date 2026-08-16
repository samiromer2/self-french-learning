"""Paths and official Statistics Canada table registry."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_RAW = ROOT / "data" / "raw"
DATA_PROCESSED = ROOT / "data" / "processed"
DATA_ANALYTICS = ROOT / "data" / "analytics"
POWERBI_DIR = DATA_ANALYTICS / "powerbi"

STATCAN_ZIP = "https://www150.statcan.gc.ca/n1/tbl/csv/{table_id}-eng.zip"
WDS_DOWNLOAD = (
    "https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/{product_id}/en"
)

# product_id for WDS is the 10-digit id without the trailing view suffix logic:
# table 15-10-0004-01 → 15100004 (8 digits) for ZIP, 1510000401 for some WDS calls.
TABLES = [
    {
        "key": "knowledge_official_languages",
        "table": "15-10-0004-01",
        "zip_id": "15100004",
        "wds_id": "15100004",
        "title": "Population by knowledge of official languages and geography, 1951 to 2021",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000401",
        "required": True,
        "theme": "knowledge",
    },
    {
        "key": "mother_tongue",
        "table": "15-10-0003-01",
        "zip_id": "15100003",
        "wds_id": "15100003",
        "title": "Population by mother tongue and geography, 1951 to 2021",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000301",
        "required": True,
        "theme": "mother_tongue",
    },
    {
        "key": "first_official_language",
        "table": "15-10-0032-01",
        "zip_id": "15100032",
        "wds_id": "15100032",
        "title": "Population by first official language spoken and geography, 1971 to 2021",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510003201",
        "required": True,
        "theme": "fols",
    },
    {
        "key": "home_language",
        "table": "15-10-0033-01",
        "zip_id": "15100033",
        "wds_id": "15100033",
        "title": "Population by language spoken most often at home and geography, 1971 to 2021",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510003301",
        "required": True,
        "theme": "home",
    },
    {
        "key": "immigrant_official_languages",
        "table": "15-10-0037-01",
        "zip_id": "15100037",
        "wds_id": "15100037",
        "title": "Knowledge of official languages by immigrant status, 1951 to 2021",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510003701",
        "required": True,
        "theme": "immigrant",
    },
    {
        "key": "language_at_work",
        "table": "98-10-0533-01",
        "zip_id": "98100533",
        "wds_id": "98100533",
        "title": "Languages used at work, 2021 Census",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810053301",
        "required": False,
        "theme": "work",
    },
]

PROVINCE_CODES = {
    "Canada": "CA",
    "Canada outside Quebec": "CA-XQ",
    "Newfoundland and Labrador": "NL",
    "Prince Edward Island": "PE",
    "Nova Scotia": "NS",
    "New Brunswick": "NB",
    "Quebec": "QC",
    "Ontario": "ON",
    "Manitoba": "MB",
    "Saskatchewan": "SK",
    "Alberta": "AB",
    "British Columbia": "BC",
    "Yukon": "YT",
    "Northwest Territories": "NT",
    "Nunavut": "NU",
}

GEO_TYPE = {
    "CA": "country",
    "CA-XQ": "special",
    "NL": "province",
    "PE": "province",
    "NS": "province",
    "NB": "province",
    "QC": "province",
    "ON": "province",
    "MB": "province",
    "SK": "province",
    "AB": "province",
    "BC": "province",
    "YT": "territory",
    "NT": "territory",
    "NU": "territory",
}

USER_AGENT = (
    "SelfFrenchLearningAnalytics/1.0 "
    "(educational portfolio; +https://github.com/)"
)
