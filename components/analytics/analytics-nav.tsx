"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/analytics", label: "Overview" },
  { href: "/analytics/learning", label: "My Learning" },
  { href: "/analytics/canada", label: "French in Canada" },
  { href: "/analytics/geography", label: "Geography" },
  { href: "/analytics/trends", label: "Trends" },
  { href: "/analytics/sources", label: "Data Sources" },
];

export function AnalyticsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b pb-px text-sm">
      {items.map((item) => {
        const active =
          item.href === "/analytics"
            ? pathname === "/analytics"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground hover:text-foreground",
              active && "bg-muted font-medium text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
