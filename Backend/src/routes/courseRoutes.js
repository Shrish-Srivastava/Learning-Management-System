const express = require("express");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { buildCourseTree, getAdjacentLessonIds } = require("../utils/courseAccess");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              select: { id: true, isFreePreview: true },
            },
          },
        },
        _count: {
          select: { lessons: true, sections: true, purchases: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return res.json({
      courses: courses.map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        thumbnail: course.thumbnail,
        price: course.price,
        lessonCount: course._count.lessons,
        sectionCount: course._count.sections,
        studentCount: course._count.purchases,
        previewLessonId:
          course.sections.flatMap((section) => section.lessons).find((lesson) => lesson.isFreePreview)?.id || null,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                title: true,
                durationLabel: true,
                isFreePreview: true,
              },
            },
          },
        },
        _count: { select: { lessons: true, sections: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    return res.json({
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        thumbnail: course.thumbnail,
        price: course.price,
        lessonCount: course._count.lessons,
        sectionCount: course._count.sections,
        sections: course.sections,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:courseId/purchase", requireAuth, async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const purchase = await prisma.purchase.upsert({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: course.id,
        },
      },
      update: {
        amountPaid: course.price,
      },
      create: {
        userId: req.user.id,
        courseId: course.id,
        amountPaid: course.price,
      },
    });

    return res.json({
      message: "Course unlocked successfully.",
      purchase,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/tree", requireAuth, async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const [progress, purchase] = await Promise.all([
      prisma.lessonProgress.findMany({
        where: { userId: req.user.id, lesson: { courseId: course.id } },
      }),
      prisma.purchase.findUnique({
        where: {
          userId_courseId: { userId: req.user.id, courseId: course.id },
        },
      }),
    ]);

    const tree = buildCourseTree({
      course,
      progress,
      purchased: Boolean(purchase),
      isAdmin: req.user.role === "ADMIN",
    });

    return res.json({ course: tree });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/lessons/:lessonId", requireAuth, async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const lesson = course.sections
      .flatMap((section) => section.lessons)
      .find((entry) => entry.id === req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const [progress, purchase] = await Promise.all([
      prisma.lessonProgress.findMany({
        where: { userId: req.user.id, lesson: { courseId: course.id } },
      }),
      prisma.purchase.findUnique({
        where: {
          userId_courseId: { userId: req.user.id, courseId: course.id },
        },
      }),
    ]);

    const tree = buildCourseTree({
      course,
      progress,
      purchased: Boolean(purchase),
      isAdmin: req.user.role === "ADMIN",
    });
    const treeLesson = tree.sections
      .flatMap((section) => section.lessons)
      .find((entry) => entry.id === req.params.lessonId);

    const adjacency = getAdjacentLessonIds(course.sections, req.params.lessonId);

    return res.json({
      lesson: {
        ...treeLesson,
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        price: course.price,
        purchased: tree.purchased,
        previousLessonId: adjacency.previousLessonId,
        nextLessonId: adjacency.nextLessonId,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { courseRoutes: router };
