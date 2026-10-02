import { SiteHeader } from "@/components/site-header";

// Public area: landing, login, signup — marketing header only.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
