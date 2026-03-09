const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const saveProgressSchema = z.object({
  lastPositionSecs: z.number().min(0).default(0),
  isCompleted: z.boolean().optional(),
});

router.use(requireAuth);

router.get("/courses/:courseId", async (req, res, next) => {
  try {
    const [lessons, progress] = await Promise.all([
      prisma.lesson.findMany({
        where: { courseId: req.params.courseId },
        select: { id: true },
      }),
      prisma.lessonProgress.findMany({
        where: {
          userId: req.user.id,
          lesson: { courseId: req.params.courseId },
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const totalLessons = lessons.length;
    const completedLessons = progress.filter((item) => item.isCompleted).length;

    return res.json({
      totalLessons,
      completedLessons,
      percentComplete:
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      lastLessonId: progress[0]?.lessonId || null,
      lastPositionSecs: progress[0]?.lastPositionSecs || 0,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/lessons/:lessonId", async (req, res, next) => {
  try {
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: req.params.lessonId,
        },
      },
    });

    return res.json({
      progress: progress || {
        lessonId: req.params.lessonId,
        lastPositionSecs: 0,
        isCompleted: false,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/lessons/:lessonId", async (req, res, next) => {
  try {
    const payload = saveProgressSchema.parse(req.body);
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: req.params.lessonId,
        },
      },
      update: {
        lastPositionSecs: payload.lastPositionSecs,
        isCompleted: payload.isCompleted ?? undefined,
        completedAt: payload.isCompleted ? new Date() : undefined,
      },
      create: {
        userId: req.user.id,
        lessonId: req.params.lessonId,
        lastPositionSecs: payload.lastPositionSecs,
        isCompleted: Boolean(payload.isCompleted),
        completedAt: payload.isCompleted ? new Date() : null,
      },
    });

    return res.json({ progress });
  } catch (error) {
    next(error);
  }
});

module.exports = { progressRoutes: router };
