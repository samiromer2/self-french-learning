import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    // Full details go to the server log (Vercel → Logs); the client gets a
    // hint about the category without leaking internals.
    console.error("Signup failed:", error);

    const message = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.constructor.name : "";
    const isDbIssue =
      errorName === "PrismaClientInitializationError" ||
      /DATABASE_URL|can't reach|connect|ECONNREFUSED|ENOTFOUND|timeout|prepared statement/i.test(
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
