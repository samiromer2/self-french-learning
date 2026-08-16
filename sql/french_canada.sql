-- Analytical SQL against data/analytics/french_canada.sqlite
-- Built by analytics/sqlite_load.py from processed Statistics Canada extracts.
-- This is the OLAP store. It is not the Next.js PostgreSQL database.

-- Provincial bilingualism, latest year
SELECT
  k.year,
  g.geo_name,
  g.region,
  k.bilingual_rate,
  k.english_and_french AS bilingual_count,
  k.total AS population
FROM fact_knowledge k
JOIN dim_geography g ON g.geo_code = k.geo_code
WHERE k.geo_code NOT IN ('CA', 'CA-XQ')
  AND k.year = (SELECT MAX(year) FROM fact_knowledge)
ORDER BY k.bilingual_rate DESC;

-- Historical bilingualism, Canada
SELECT year, bilingual_rate, english_and_french, total AS population
FROM fact_knowledge
WHERE geo_code = 'CA'
ORDER BY year;

-- French at home vs French at work (2021)
SELECT
  h.geo_name,
  h.french_rate AS french_home_rate,
  w.french_rate AS french_work_rate,
  w.french_rate - h.french_rate AS work_minus_home_pp
FROM fact_home_language h
LEFT JOIN fact_work w
  ON w.geo_code = h.geo_code AND w.year = 2021
WHERE h.year = (SELECT MAX(year) FROM fact_home_language)
ORDER BY h.french_rate DESC;

-- Immigrants vs non-immigrants: knowledge of French, Canada
SELECT
  year,
  immigrant_status_key,
  french_knowledge_rate,
  bilingual_rate,
  total
FROM fact_immigrant
WHERE geo_code = 'CA'
  AND immigrant_status_key IN ('immigrants', 'non_immigrants')
ORDER BY year, immigrant_status_key;

-- Year-over-year change in bilingualism (window function)
SELECT
  geo_code,
  year,
  bilingual_rate,
  bilingual_rate - LAG(bilingual_rate) OVER (
    PARTITION BY geo_code ORDER BY year
  ) AS change_pp
FROM fact_knowledge
WHERE geo_code IN ('CA', 'QC', 'ON', 'NB', 'CA-XQ')
ORDER BY geo_code, year;

-- Highest / lowest provincial bilingualism with CASE banding
SELECT
  geo_name,
  bilingual_rate,
  CASE
    WHEN bilingual_rate >= 40 THEN '40%+'
    WHEN bilingual_rate >= 15 THEN '15–40%'
    WHEN bilingual_rate >= 5 THEN '5–15%'
    ELSE 'under 5%'
  END AS band
FROM fact_knowledge k
JOIN dim_geography g ON g.geo_code = k.geo_code
WHERE k.year = 2021
  AND g.geo_type = 'province'
ORDER BY bilingual_rate DESC;
