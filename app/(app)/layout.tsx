import { requireUser } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";

// Account-only app shell (dashboard, leaderboard). The guard stays on the
// layout so anything added to this group is private by default — the public
// learning area lives in app/(learn) instead. Pages still call requireUser()
// for the user object; cache() makes that share this request's single Auth
// round-trip.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
