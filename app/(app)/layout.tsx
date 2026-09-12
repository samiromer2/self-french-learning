import { requireUser } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";

// Authenticated app shell: the auth guard runs once here for every page in
// the group (pages still call requireUser() for the user object — cache()
// makes that share this request's single Auth round-trip).
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
