import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    // Create the account pre-confirmed via the admin API — no confirmation
    // email is sent, so this doesn't depend on the project's "Confirm
    // email" setting or its email-sending rate limit.
    const admin = createAdminClient();
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (createError || !created.user) {
      const isDuplicate = /already.*registered|already exists|email_exists/i.test(
        createError?.message ?? "",
      );
      return NextResponse.json(
        {
          error: isDuplicate
            ? "An account with this email already exists."
            : (createError?.message ?? "Could not create account."),
        },
        { status: isDuplicate ? 409 : 400 },
      );
    }

    // Application-level profile row: Supabase owns auth.users, this is our
    // app-data row keyed to the same id.
    await prisma.user.upsert({
      where: { id: created.user.id },
      update: {},
      create: { id: created.user.id, name, email },
    });

    // Sign the new user in immediately, writing session cookies onto this
    // response via the cookie-aware server client.
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Account exists and is confirmed; this would only fail on an
      // unrelated transient error. Let them log in manually.
      return NextResponse.json({ status: "created_please_login" });
    }

    return NextResponse.json({ status: "confirmed" });
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
