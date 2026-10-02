"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startLesson, completeLesson } from "../../actions";
import { SignUpPrompt } from "@/components/sign-up-prompt";
import type { ProgressStatus } from "@/lib/generated/prisma/client";

export function LessonControls({
  lessonId,
  status,
  signedIn,
}: {
  lessonId: string;
  status: ProgressStatus;
  signedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  // These buttons only write progress, so there's nothing for them to do
  // without an account — offer the account instead.
  if (!signedIn) {
    return (
      <SignUpPrompt
        title="Track this lesson"
        description="Sign up free to mark lessons complete and earn XP."
        className="w-full"
      />
    );
  }

  if (status === "COMPLETED") {
    return null;
  }

  if (status === "NOT_STARTED") {
    return (
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await startLesson(lessonId);
            } catch {
              toast.error("Could not start this lesson. Try again.");
            }
          })
        }
      >
        {isPending ? "Starting..." : "Start lesson"}
      </Button>
    );
  }

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            const { newAchievements } = await completeLesson(lessonId);
            toast.success("Lesson completed! +10 XP");
            for (const a of newAchievements) {
              toast(`${a.icon ?? "🏅"} Achievement unlocked: ${a.title}`);
            }
          } catch {
            toast.error("Could not save this lesson. Try again.");
          }
        })
      }
    >
      {isPending ? "Saving..." : "Mark as completed"}
    </Button>
  );
}
