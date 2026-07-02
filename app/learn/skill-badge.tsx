import { BookOpen, Headphones, Mic, PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/lib/generated/prisma/client";

const config: Record<Skill, { label: string; Icon: typeof BookOpen }> = {
  READING: { label: "Reading", Icon: BookOpen },
  WRITING: { label: "Writing", Icon: PenLine },
  LISTENING: { label: "Listening", Icon: Headphones },
  SPEAKING: { label: "Speaking", Icon: Mic },
};

export function SkillBadge({ skill }: { skill: Skill }) {
  const { label, Icon } = config[skill];
  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
