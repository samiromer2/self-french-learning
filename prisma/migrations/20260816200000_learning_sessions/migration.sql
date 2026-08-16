-- CreateTable
CREATE TABLE "LearningSession" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "lessonId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationMinutes" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningSession_userId_startedAt_idx" ON "LearningSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "LearningSession_userId_lessonId_endedAt_idx" ON "LearningSession"("userId", "lessonId", "endedAt");

-- CreateIndex
CREATE INDEX "Progress_userId_completedAt_idx" ON "Progress"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_completedAt_idx" ON "QuizAttempt"("userId", "completedAt");

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
