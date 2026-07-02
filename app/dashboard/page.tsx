import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Welcome, {session.user.name ?? session.user.email}</CardTitle>
          <SignOutButton />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            XP: 0 · Level: A1 · Your curriculum will appear here once course content
            is added (Phase 2).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
