import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LeaderboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const top = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 10,
    select: { id: true, name: true, xp: true, currentStreak: true },
  });

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top learners by XP</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="divide-y">
            {top.map((user, i) => (
              <li
                key={user.id}
                className={cn(
                  "flex items-center justify-between gap-4 py-3",
                  user.id === currentUser.id && "font-semibold",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 text-right text-muted-foreground">
                    {i + 1}.
                  </span>
                  {user.name ?? "Anonymous"}
                  {user.id === currentUser.id && (
                    <span className="text-xs text-muted-foreground">(you)</span>
                  )}
                </span>
                <span className="flex items-center gap-4 text-sm">
                  {user.currentStreak > 0 && <span>🔥 {user.currentStreak}</span>}
                  <span>{user.xp} XP</span>
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
