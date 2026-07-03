import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "Could not create account." },
        { status: 400 },
      );
    }

    // Application-level profile row: Supabase owns auth.users, this is our
    // app-data row keyed to the same id. Created here (not via a DB trigger)
    // since there's a single signup path — see filesrelated/task.md history.
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {},
      create: { id: data.user.id, name, email },
    });

    if (data.session) {
      // Email confirmation is off (or auto-confirmed) — the server client
      // already wrote session cookies onto this response.
      return NextResponse.json({ status: "confirmed", id: data.user.id });
    }

    return NextResponse.json({ status: "confirm_email" });
  } catch (error) {
    console.error("Signup failed:", error);

    const message = error instanceof Error ? error.message : String(error);
    const isDbIssue =
      error instanceof Error && error.constructor.name === "PrismaClientInitializationError"
        ? true
        : /DATABASE_URL|can't reach|connect|ECONNREFUSED|ENOTFOUND|timeout|prepared statement/i.test(
            message,
          );

    return NextResponse.json(
      {
        error: isDbIssue
          ? "Database connection failed — check the server configuration."
          : "Unexpected server error — check the server logs.",
      },
      { status: 500 },
    );
  }
}
