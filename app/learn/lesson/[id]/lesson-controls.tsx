"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startLesson, completeLesson } from "../../actions";
import type { ProgressStatus } from "@/lib/generated/prisma/client";

export function LessonControls({
  lessonId,
  status,
}: {
  lessonId: string;
  status: ProgressStatus;
}) {
  const [isPending, startTransition] = useTransition();

  if (status === "COMPLETED") {
    return null;
  }

  if (status === "NOT_STARTED") {
    return (
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await startLesson(lessonId);
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
          await completeLesson(lessonId);
          toast.success("Lesson completed! +10 XP");
        })
      }
    >
      {isPending ? "Saving..." : "Mark as completed"}
    </Button>
  );
}
