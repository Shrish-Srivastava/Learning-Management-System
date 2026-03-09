const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAdmin, requireAuth } = require("../middleware/auth");

const router = express.Router();

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  category: z.string().min(2),
  level: z.string().min(2),
  duration: z.string().min(2),
  thumbnail: z.url(),
  price: z.number().int().min(0),
  playlistId: z.string().min(6),
  isPublished: z.boolean().default(true),
});

const sectionSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2),
  orderIndex: z.number().int().min(1),
});

const lessonSchema = z.object({
  courseId: z.string().min(1),
  sectionId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10),
  orderIndex: z.number().int().min(1),
  sectionOrder: z.number().int().min(1),
  courseOrder: z.number().int().min(1),
  playlistIndex: z.number().int().min(0),
  durationLabel: z.string().min(2),
  isFreePreview: z.boolean().default(false),
  playlistId: z.string().min(6),
  youtubeUrl: z.url(),
});

router.use(requireAuth, requireAdmin);

router.get("/courses", async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
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
      orderBy: { createdAt: "asc" },
    });

    return res.json({ courses });
  } catch (error) {
    next(error);
  }
});

router.post("/courses", async (req, res, next) => {
  try {
    const payload = courseSchema.parse(req.body);
    const course = await prisma.course.create({ data: payload });
    return res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
});

router.put("/courses/:courseId", async (req, res, next) => {
  try {
    const payload = courseSchema.parse(req.body);
    const course = await prisma.course.update({
      where: { id: req.params.courseId },
      data: payload,
    });
    return res.json({ course });
  } catch (error) {
    next(error);
  }
});

router.delete("/courses/:courseId", async (req, res, next) => {
  try {
    await prisma.course.delete({ where: { id: req.params.courseId } });
    return res.json({ message: "Course deleted." });
  } catch (error) {
    next(error);
  }
});

router.post("/sections", async (req, res, next) => {
  try {
    const payload = sectionSchema.parse(req.body);
    const section = await prisma.section.create({ data: payload });
    return res.status(201).json({ section });
  } catch (error) {
    next(error);
  }
});

router.put("/sections/:sectionId", async (req, res, next) => {
  try {
    const payload = sectionSchema.parse(req.body);
    const section = await prisma.section.update({
      where: { id: req.params.sectionId },
      data: payload,
    });
    return res.json({ section });
  } catch (error) {
    next(error);
  }
});

router.delete("/sections/:sectionId", async (req, res, next) => {
  try {
    await prisma.section.delete({ where: { id: req.params.sectionId } });
    return res.json({ message: "Section deleted." });
  } catch (error) {
    next(error);
  }
});

router.post("/lessons", async (req, res, next) => {
  try {
    const payload = lessonSchema.parse(req.body);
    const lesson = await prisma.lesson.create({ data: payload });
    return res.status(201).json({ lesson });
  } catch (error) {
    next(error);
  }
});

router.put("/lessons/:lessonId", async (req, res, next) => {
  try {
    const payload = lessonSchema.parse(req.body);
    const lesson = await prisma.lesson.update({
      where: { id: req.params.lessonId },
      data: payload,
    });
    return res.json({ lesson });
  } catch (error) {
    next(error);
  }
});

router.delete("/lessons/:lessonId", async (req, res, next) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.lessonId } });
    return res.json({ message: "Lesson deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = { adminRoutes: router };
