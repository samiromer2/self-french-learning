# External data sources

All public figures on the Analytics dashboards come from official Canadian statistical products. Nothing is scraped. Personal learning data is **not** listed here; it lives in the application database and is never published.

Licence for every Statistics Canada table below: [Open Government Licence – Canada](https://open.canada.ca/en/open-government-licence-canada). Citation is required; do not present the figures as Statistics Canada endorsement of this app.

Refresh cadence is “after each Census of Population language release” (typically every five years) unless a table is updated off-cycle. The pipeline records `last_downloaded_at` in `data/analytics/data_quality.json`. **Do not label a chart “current-year” unless that year exists in the file.**

---

## 1. Population by knowledge of official languages and geography, 1951 to 2021

| Field | Value |
| --- | --- |
| **Dataset name** | Population by knowledge of official languages and geography, 1951 to 2021 |
| **Table** | 15-10-0004-01 |
| **Organization** | Statistics Canada |
| **Official URL** | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000401 |
| **Open Government** | https://open.canada.ca/data/en/dataset/ca075a79-5962-4fc0-9a51-7439f659ea62 |
| **CSV (English)** | https://www150.statcan.gc.ca/n1/tbl/csv/15100004-eng.zip |
| **Description** | Counts and percentages of people who know English only, French only, both official languages, or neither, for Canada, Canada outside Quebec, and each province/territory. Primary source for English–French bilingualism trends. |
| **Date range** | Census years 1951–2021 |
| **Geographic coverage** | Canada, Canada outside Quebec, provinces, territories |
| **Important columns** | `REF_DATE` (census year), `GEO`, `Knowledge of official languages`, `Statistics` / `UOM`, `VALUE`, `STATUS` |
| **Update frequency** | Occasional (Census of Population) |
| **How imported** | `analytics/ingest.py` downloads the official ZIP; `clean.py` keeps Number and Percent rows with a usable `VALUE` |
| **Refresh** | Re-run `python3 analytics/run_pipeline.py`. Next expected structural update: 2026 Census language release |

**Used for:** bilingualism trend, provincial comparison, Overview KPIs.

---

## 2. Population by mother tongue and geography, 1951 to 2021

| Field | Value |
| --- | --- |
| **Dataset name** | Population by mother tongue and geography, 1951 to 2021 |
| **Table** | 15-10-0003-01 |
| **Organization** | Statistics Canada |
| **Official URL** | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000301 |
| **CSV (English)** | https://www150.statcan.gc.ca/n1/tbl/csv/15100003-eng.zip |
| **Description** | Mother tongue (English, French, non-official, multiple responses) by geography over census years. |
| **Date range** | 1951–2016 in the English CSV downloaded for this project (table title mentions 2021; do not backfill) |
| **Geographic coverage** | Canada, Canada outside Quebec, provinces, territories |
| **Important columns** | `REF_DATE`, `GEO`, mother-tongue dimension, `VALUE`, `STATUS` |
| **Update frequency** | Occasional (Census) |
| **How imported** | Same ZIP download path as table 1 |
| **Refresh** | Pipeline re-run after Census updates |

**Used for:** French mother-tongue counts and rates; historical change.

---

## 3. Population by first official language spoken and geography, 1971 to 2021

| Field | Value |
| --- | --- |
| **Dataset name** | Population by first official language spoken and geography, 1971 to 2021 |
| **Table** | 15-10-0032-01 |
| **Organization** | Statistics Canada |
| **Official URL** | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510003201 |
| **Open Government** | https://open.canada.ca/data/en/dataset/bb3a35ec-ff1b-4f8c-b3bd-83ed1fdf575e |
| **CSV (English)** | https://www150.statcan.gc.ca/n1/tbl/csv/15100032-eng.zip |
| **Description** | First official language spoken (English, French, both, neither) — the concept used in official-languages policy. |
| **Date range** | 1971–2021 |
| **Geographic coverage** | Canada, Canada outside Quebec, provinces, territories |
| **Important columns** | `REF_DATE`, `GEO`, first-official-language dimension, `VALUE`, `STATUS` |
| **Update frequency** | Occasional (Census) |
| **How imported** | Official ZIP |
| **Refresh** | Pipeline re-run |

**Used for:** French FOLS KPI; Geography page; Trends.

---

## 4. Population by language spoken most often at home and geography, 1971 to 2021

| Field | Value |
| --- | --- |
| **Dataset name** | Population by language spoken most often at home and geography, 1971 to 2021 |
| **Table** | 15-10-0033-01 |
| **Organization** | Statistics Canada |
| **Official URL** | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510003301 |
| **CSV (English)** | https://www150.statcan.gc.ca/n1/tbl/csv/15100033-eng.zip |
| **Description** | Language spoken most often at home, including English, French, non-official languages, and multiple responses. |
| **Date range** | 1971–2021 |
| **Geographic coverage** | Canada, Canada outside Quebec, provinces, territories |
| **Important columns** | `REF_DATE`, `GEO`, home-language dimension, `VALUE`, `STATUS` |
| **Update frequency** | Occasional (Census) |
| **How imported** | Official ZIP |
| **Refresh** | Pipeline re-run |

**Used for:** French at home; home vs workplace comparison when work data is present.

---

## 5. Knowledge of official languages by immigrant status, 1951 to 2021

| Field | Value |
| --- | --- |
| **Dataset name** | Population by knowledge of official languages, immigrant status, period of immigration and geography, 1951 to 2021 |
| **Table** | 15-10-0037-01 |
| **Organization** | Statistics Canada |
| **Official URL** | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510003701 |
| **Release note** | https://www150.statcan.gc.ca/n1/daily-quotidien/240123/dq240123c-eng.htm |
| **CSV (English)** | https://www150.statcan.gc.ca/n1/tbl/csv/15100037-eng.zip |
| **Description** | Official-language knowledge crossed with immigrant status and period of immigration. Supports questions about French knowledge among immigrants vs non-immigrants — **without inferring ethnicity, religion, or other attributes that are not in the table.** |
| **Date range** | 1951–2021 (immigrant status); period-of-immigration detail varies by year |
| **Geographic coverage** | Canada, Canada outside Quebec, provinces, territories |
| **Important columns** | `REF_DATE`, `GEO`, immigrant status, period of immigration, knowledge of official languages, `VALUE`, `STATUS` |
| **Update frequency** | Occasional (Census) |
| **How imported** | Official ZIP; pipeline keeps Total period-of-immigration rows unless a specific period is requested |
| **Refresh** | Pipeline re-run |

**Used for:** newcomer vs non-immigrant French / bilingualism charts. Personal app progress is **never** treated as a sample of Canadian immigrants.

---

## 6. Languages used at work (2021 Census) — optional / best-effort

| Field | Value |
| --- | --- |
| **Dataset name** | Languages used at work by mother tongue and knowledge of official languages: Canada, provinces and territories and census metropolitan areas with parts |
| **Table** | 98-10-0533-01 |
| **Organization** | Statistics Canada |
| **Official URL** | https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810053301 |
| **CSV (English)** | https://www150.statcan.gc.ca/n1/tbl/csv/98100533-eng.zip |
| **Description** | Language used most often at work for people aged 15+ who worked since 1 January 2020. Many cross-tab dimensions; the pipeline keeps **province/territory/Canada totals** only (all other dimensions = Total) so the extract stays small and comparable. |
| **Date range** | 2021 Census (not a long historical series) |
| **Geographic coverage** | Canada, provinces, territories, selected CMAs (CMA rows are dropped in cleaning) |
| **Important columns** | Geography, Language used most often at work, Count |
| **Update frequency** | Census of Population |
| **How imported** | Official ZIP, streamed/chunked; skipped automatically if the download fails or the file is unusable |
| **Refresh** | Pipeline re-run. If skipped, workplace charts show an honest empty/unavailable state |
| **API alternative** | Statistics Canada [Web Data Service](https://www.statcan.gc.ca/en/developers/wds/user-guide) `getFullTableDownloadCSV/{productId}/en` |

**Used for:** French at work by province; home vs work. Not used to claim which jobs “require” French — occupation-level demand is a documented future extension.

---

## Sources considered but not ingested (limitations)

| Topic | Why it is not in v1 |
| --- | --- |
| **French immersion / minority-language instruction** | 2021 Census products exist (instruction in the minority official language) but they are large cross-tabs with concepts that are easy to misread. Documented as a future extension rather than a decorative chart. |
| **Occupation / industry “French required”** | Job Bank postings and census industry × language-of-work cubes need extra methodology (what counts as “required”). Not inferred from language-used-at-work counts. |
| **IRCC settlement language training** | Some open datasets exist but coverage, definitions, and geography often do not align with Census concepts. Better as a later join than a forced mash-up. |
| **Office québécois de la langue française** | Valuable for Quebec-specific regulation and surveys; not used here so national series stay on one methodology (Census). |
| **Census Profile SDMX API** | Suitable later for automated characteristic pulls by DGUID. Full table ZIPs are used first because they are complete, citable, and licence-clear. |

## Import design

1. Prefer the static English ZIP on `www150.statcan.gc.ca/n1/tbl/csv/{id}-eng.zip`.
2. Fall back to WDS `getFullTableDownloadCSV` if the static ZIP URL fails.
3. Store untouched files under `data/raw/` (gitignored).
4. Write cleaned long tables under `data/processed/`.
5. Write dashboard JSON + Power BI CSVs under `data/analytics/`.
6. Record source URL, table id, download timestamp, and row counts in `data/analytics/data_quality.json`.

No website HTML scraping. No invented API responses.
