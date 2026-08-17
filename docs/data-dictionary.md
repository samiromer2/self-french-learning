# Data dictionary

Fields used in analytics extracts and in the application database. Personal learning fields are never published in `data/analytics/`.

## Application (PostgreSQL)

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| user_id | Internal account id (UUID, matches Supabase Auth). Not an email. | UUID | Application |
| learning_date | UTC date of a completed lesson or closed session | Date | Application |
| session_started_at | When a lesson sitting began | Datetime | `LearningSession.startedAt` |
| session_ended_at | When a lesson sitting ended | Datetime | `LearningSession.endedAt` |
| session_duration | Minutes spent in that sitting | Numeric | `LearningSession.durationMinutes` |
| lesson_status | NOT_STARTED / IN_PROGRESS / COMPLETED | String | `Progress.status` |
| lesson_score | Share correct on lesson exercises (0–1 in DB, shown as %) | Numeric | `Progress.score` |
| lessons_completed | Count of COMPLETED progress rows | Numeric | Derived |
| vocabulary_learned | Words marked known on flashcards (falls back to words on completed lessons if the review table is missing) | Numeric | `UserVocabulary` (KNOWN) |
| current_streak | Consecutive active UTC days | Integer | `User.currentStreak` |
| quiz_score | Unit quiz score if attempts exist (0–1 in DB, shown as %) | Numeric | `QuizAttempt.score` |
| skill | READING / WRITING / LISTENING / SPEAKING | String | `Lesson.skill` |
| category | Unit title or scenario title | String | `Unit.title` / `Scenario.title` |

`QuizAttempt.score` is stored as 0–1. The dashboard shows a percentage and leaves the field empty until the signed-in user has submitted a unit quiz.

## Public Canadian extracts

Normalized long table: `data/processed/official_languages_long.csv`

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| theme | knowledge / mother_tongue / fols / home / immigrant / work | String | Pipeline |
| year | Census year | Integer | `REF_DATE` |
| geo_code | CA, CA-XQ, ON, QC, … | String | Mapped from `GEO` |
| geo_name | Display name | String | Statistics Canada `GEO` |
| geo_type | country / province / territory / special | String | Pipeline |
| category | english_only, french, english_and_french, … | String | Mapped dimension |
| measure | count or percent | String | `Statistics` / `UOM` |
| value | Count of people or percent | Numeric | `VALUE` |
| immigrant_status_key | total / immigrants / non_immigrants / non_permanent_residents | String | Table 15-10-0037 |

### Knowledge of official languages (15-10-0004)

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| total | Population in the table universe | Numeric | Statistics Canada |
| english_only | Knows English only | Numeric | Statistics Canada |
| french_only | Knows French only | Numeric | Statistics Canada |
| english_and_french | Knows both official languages (bilingual count) | Numeric | Statistics Canada |
| bilingual_rate | english_and_french / total × 100 | Numeric | Derived from counts |

### First official language spoken (15-10-0032)

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| french_count | French FOLS (distributed multiple responses) | Numeric | Statistics Canada |
| french_fols_rate | french_count / total × 100 | Numeric | Derived |

### Language spoken most often at home (15-10-0033)

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| french_home | People speaking French most often at home | Numeric | Statistics Canada |
| french_home_rate | Share (%) | Numeric | Derived |

### Language used most often at work (98-10-0533, 2021)

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| french_work | Workers using French most often at work | Numeric | Statistics Canada |
| french_work_rate | Share of workers 15+ who worked since 1 Jan 2020 | Numeric | Derived |
| province | Canadian province or territory | String | `GEO` |

Universe is **not** the same as the home-language table. Do not treat the two rates as one behaviour.

### Mother tongue (15-10-0003)

| Field | Description | Type | Source |
| --- | --- | --- | --- |
| french_mother_tongue | French mother tongue count | Numeric | Statistics Canada |
| french_mother_tongue_year | Latest year present in the downloaded file | Integer | Pipeline |

The published table title includes 2021, but the English CSV extract available at ingest time ended in **2016**. Dashboards that show mother tongue must label that year. Do not present 2016 mother-tongue rates as 2021 Census figures.

### Quality report (`data/analytics/data_quality.json`)

| Field | Description |
| --- | --- |
| records_processed | Rows in the long table after cleaning |
| records_rejected | Rows dropped for invalid geo, negatives, or percent > 100 |
| missing_values | Remaining null cells |
| duplicate_records | Duplicate long-table rows |
| last_successful_update | UTC timestamp of a successful required-table ingest |
