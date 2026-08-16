import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/supabase/server";
import { getLearningAnalytics } from "@/lib/analytics/learning";

const PUBLIC_FILES: Record<string, string> = {
  provincial_snapshot: "fact_provincial_snapshot.csv",
  knowledge: "fact_knowledge_official_languages.csv",
  mother_tongue: "fact_mother_tongue.csv",
  fols: "fact_first_official_language.csv",
  home: "fact_home_language.csv",
  work: "fact_language_at_work.csv",
  immigrant: "fact_immigrant_official_languages.csv",
  dim_geography: "dim_geography.csv",
  dim_year: "dim_year.csv",
};

function csvEscape(value: unknown) {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  const dataset = request.nextUrl.searchParams.get("dataset") ?? "provincial_snapshot";
  const format = request.nextUrl.searchParams.get("format") ?? "csv";

  if (dataset === "learning") {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const analytics = await getLearningAnalytics(user.id);
    const rows = analytics.activity.map((d) => ({
      activity_date: d.date,
      lessons_completed: d.lessons,
      minutes: d.minutes,
      avg_score_percent: d.avgScore,
    }));
    if (format === "json") {
      return NextResponse.json({
        user_id: user.id,
        kpis: {
          ...analytics.kpis,
        },
        activity: rows,
        by_skill: analytics.bySkill,
        note: "Anonymous user id only. Email and name are not exported.",
      });
    }
    const header = ["activity_date", "lessons_completed", "minutes", "avg_score_percent"];
    const body = [
      header.join(","),
      ...rows.map((r) =>
        [r.activity_date, r.lessons_completed, r.minutes ?? "", r.avg_score_percent ?? ""]
          .map(csvEscape)
          .join(","),
      ),
    ].join("\n");
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="learning_activity.csv"',
        "Cache-Control": "private, no-store",
      },
    });
  }

  const file = PUBLIC_FILES[dataset];
  if (!file) {
    return NextResponse.json(
      { error: "Unknown dataset", datasets: [...Object.keys(PUBLIC_FILES), "learning"] },
      { status: 400 },
    );
  }

  const csvPath = path.join(process.cwd(), "data/analytics/powerbi", file);
  const csv = await readFile(csvPath, "utf8");

  if (format === "json") {
    const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
    const headers = headerLine.split(",");
    const records = lines.map((line) => {
      const cols = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ""]));
    });
    return NextResponse.json(records);
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
