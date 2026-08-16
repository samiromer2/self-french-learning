# Power BI

The web dashboard is a Next.js app over pre-aggregated JSON. Power BI is the desktop/service BI tool you can point at the same star schema.

Do **not** embed Power BI in this app. Import the CSVs instead.

## Files to import

From `data/analytics/powerbi/` after `python3 -m analytics.run_pipeline`:

| File | Role |
| --- | --- |
| `dim_geography.csv` | Geography dimension |
| `dim_year.csv` | Census year dimension |
| `fact_knowledge_official_languages.csv` | Bilingualism / official-language knowledge |
| `fact_first_official_language.csv` | French FOLS |
| `fact_home_language.csv` | French at home |
| `fact_language_at_work.csv` | French at work (2021) |
| `fact_immigrant_official_languages.csv` | Knowledge by immigrant status |
| `fact_mother_tongue.csv` | Mother tongue (series currently through 2016) |
| `fact_provincial_snapshot.csv` | Wide 2021 snapshot for a simple first page |

Refresh: re-run the pipeline, then refresh the Power BI queries. HTTP alternative while the app is running:

`/api/analytics/export?dataset=knowledge&format=csv`

Learning data: `/api/analytics/export?dataset=learning&format=csv` (signed-in user only, no email).

## Recommended relationships

```
dim_geography[geo_code] 1—* fact_knowledge[geo_code]
dim_year[year]          1—* fact_knowledge[year]
```

Repeat the same two relationships for `fact_home_language`, `fact_first_official_language`, `fact_language_at_work`, `fact_immigrant_official_languages`.

Do **not** relate personal learning exports to Census facts. There is no statistical key that makes one learner comparable to a provincial rate.

## Recommended measures

```dax
Bilingual rate % = AVERAGE(fact_knowledge[bilingual_rate])
French home %     = AVERAGE(fact_home_language[french_rate])
French work %     = AVERAGE(fact_language_at_work[french_rate])
Bilingual people  = SUM(fact_knowledge[english_and_french])
YoY bilingual pp  =
    [Bilingual rate %]
    - CALCULATE([Bilingual rate %], DATEADD(dim_year[year], -1, YEAR))
```

Use `year` as a numeric column, not a Date hierarchy, unless you build a date table from 1 July of each census year.

## Recommended pages

1. **Canada overview** — KPI cards + bilingualism line + provincial bar
2. **Geography** — slicer on `geo_name` + trend + home vs work
3. **Immigration** — immigrants vs non-immigrants, Quebec vs Canada outside Quebec
4. **Sources** — table of `docs/data-sources.md` (or a static text box with table ids and the Open Government Licence)

## Recommended visuals

- Line: bilingualism by year
- Clustered bar: provinces (sorted descending, not alphabetically)
- Ribbon or line (not pie) for home vs work
- Map only if you use Statistics Canada boundary files; the web app uses an equal-area **tile map** to avoid land-area bias
- KPI cards: bilingual rate, FOLS French, French at home, French at work

Avoid 3D charts, exploding pies, and dual axes with unrelated units.

## How this differs from the web dashboard

| | Web app | Power BI |
| --- | --- | --- |
| Personal learning | Postgres, session-scoped | Optional CSV export per user |
| Canadian data | `dashboard_bundle.json` | Star-schema CSVs |
| Interactivity | React filters on a precomputed extract | Slicers, DAX, model relationships |
| Hosting | Vercel / Node | Power BI Desktop or Service |
| Auth | Supabase | Workspace permissions |

Both layers should tell the same story because they share the Python pipeline.
