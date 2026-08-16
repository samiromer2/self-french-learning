export type GeoPoint = {
  year: number;
  geo_code: string;
  geo_name: string;
  population?: number | null;
  bilingual_count?: number | null;
  bilingual_rate?: number | null;
  total?: number | null;
  french_count?: number | null;
  french_rate?: number | null;
};

export type ProvincialSnapshot = {
  geo_code: string;
  geo_name: string;
  geo_type: string;
  year: number;
  population: number | null;
  bilingual_rate: number | null;
  bilingual_count: number | null;
  french_only_rate: number | null;
  french_mother_tongue_rate: number | null;
  french_mother_tongue_year?: number | null;
  french_fols_rate: number | null;
  french_home_rate: number | null;
  french_work_rate: number | null;
};

export type Insight = {
  id: string;
  question: string;
  text: string;
  metric: string;
  geo: string;
  start_year: number;
  end_year: number;
  start_value: number | null;
  end_value: number | null;
  unit: string;
  source_table: string;
};

export type DataSourceRef = {
  key: string;
  table: string;
  title: string;
  url: string;
  organization: string;
  licence: string;
};

export type CanadaBundle = {
  generated_at: string;
  latest_year: number;
  census_years: number[];
  sources: DataSourceRef[];
  canada_latest: {
    year: number;
    population: number | null;
    english_only: number | null;
    french_only: number | null;
    english_and_french: number | null;
    neither: number | null;
    bilingual_rate: number | null;
    french_only_rate: number | null;
    french_mother_tongue: number | null;
    french_mother_tongue_rate: number | null;
    french_mother_tongue_year: number | null;
    french_fols: number | null;
    french_fols_rate: number | null;
    french_home: number | null;
    french_home_rate: number | null;
    french_work: number | null;
    french_work_rate: number | null;
  };
  bilingualism_trend: GeoPoint[];
  mother_tongue_trend: GeoPoint[];
  fols_trend: GeoPoint[];
  home_trend: GeoPoint[];
  work_latest: GeoPoint[];
  provincial_latest: ProvincialSnapshot[];
  immigrant_trend: Array<{
    year: number;
    geo_code: string;
    geo_name: string;
    immigrant_status_key: string;
    immigrant_status: string;
    total: number | null;
    bilingual_rate: number | null;
    french_knowledge_rate: number | null;
    french_knowledge_count: number | null;
  }>;
  insights: Insight[];
  quality: {
    generated_at: string;
    records_processed: number;
    records_rejected: number;
    missing_values: number;
    duplicate_records: number;
    status: string;
    last_successful_update: string | null;
    rows_by_theme: Record<string, number>;
    ingest: Array<{
      key: string;
      table: string;
      title: string;
      source_url: string;
      ok: boolean;
      method: string | null;
      error: string | null;
    }>;
    licence: string;
    organization: string;
    issues: string[];
  };
};

export type LearningKpis = {
  totalHours: number | null;
  sessionCount: number;
  closedSessionCount: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  lessonsInProgress: number;
  vocabularyLearned: number;
  averageLessonScore: number | null;
  quizAttemptCount: number;
  averageQuizScore: number | null;
  weeklyMinutes: number | null;
  monthlyMinutes: number | null;
};

export type LearningSeriesPoint = {
  date: string;
  minutes: number | null;
  lessons: number;
  avgScore: number | null;
};

export type SkillStat = {
  skill: string;
  completed: number;
  avgScore: number | null;
};

export type HeatCell = {
  weekday: number;
  hour: number;
  count: number;
};

export type LearningAnalytics = {
  kpis: LearningKpis;
  activity: LearningSeriesPoint[];
  bySkill: SkillStat[];
  byUnit: Array<{ label: string; completed: number; avgScore: number | null }>;
  heatmap: HeatCell[];
  scoreTrend: Array<{ date: string; score: number; title: string; skill: string }>;
  hasDurationData: boolean;
  hasScoreData: boolean;
  hasQuizData: boolean;
};
