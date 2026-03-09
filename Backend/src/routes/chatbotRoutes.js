const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { env } = require("../config/env");

const router = express.Router();

const messageSchema = z.object({
  message: z.string().trim().min(2).max(1000),
  page: z.string().trim().max(120).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1500),
      })
    )
    .max(8)
    .optional()
    .default([]),
});

const formatCourseContext = (courses) =>
  courses
    .map(
      (course) =>
        `${course.title} | ${course.category} | ${course.level} | Rs. ${course.price}`
    )
    .join("\n");

const buildSystemPrompt = ({ user, page, purchasedCourses, allCourses }) => `
You are SkillUp AI. You are the in-app assistant for the SkillUp LMS.

Rules:
- Keep answers concise and practical.
- Use a supportive teacher-like tone.
- Stay focused on SkillUp, courses, learning flow, admin usage, and study guidance.
- If asked about something unrelated to SkillUp or learning, gently redirect to platform help.
- Never invent features that do not exist.
- Mention that the first lesson is free and paid courses unlock the full sequence when relevant.
- If the user is an admin, you may explain course management actions.
- If the user is a student, prioritize course guidance, next steps, and platform usage.

Current user:
- Name: ${user.name}
- Role: ${user.role}
- Current page: ${page || "unknown"}

Purchased courses:
${purchasedCourses.length ? formatCourseContext(purchasedCourses) : "None yet"}

Available SkillUp courses:
${formatCourseContext(allCourses)}
`;

const createChatMessages = (systemPrompt, history, message) => [
  {
    role: "system",
    content: systemPrompt,
  },
  ...history.map((entry) => ({
    role: entry.role,
    content: entry.content,
  })),
  {
    role: "user",
    content: message,
  },
];

const mapProviderError = (status, details) => {
  if (status === 429) {
    return "SkillUp AI is temporarily unavailable because the AI provider limit has been reached. Please wait a little and try again.";
  }

  if (status === 401 || status === 403) {
    return "SkillUp AI is unavailable because the AI provider key is invalid or not permitted for this project.";
  }

  const apiMessage = details?.error?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.trim();
  }

  return "SkillUp AI could not respond right now.";
};

router.post("/message", requireAuth, async (req, res, next) => {
  try {
    if (!env.groqApiKey) {
      return res.status(500).json({
        message: "Groq API key is not configured.",
      });
    }

    const payload = messageSchema.parse(req.body);
    const [allCourses, purchasedCourses] = await Promise.all([
      prisma.course.findMany({
        where: { isPublished: true },
        select: {
          title: true,
          category: true,
          level: true,
          price: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.course.findMany({
        where: {
          purchases: {
            some: {
              userId: req.user.id,
            },
          },
        },
        select: {
          title: true,
          category: true,
          level: true,
          price: true,
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.groqApiKey}`,
      },
      body: JSON.stringify({
        model: env.groqModel,
        messages: createChatMessages(
          buildSystemPrompt({
            user: req.user,
            page: payload.page,
            purchasedCourses,
            allCourses,
          }),
          payload.history,
          payload.message
        ),
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      let errorDetails = null;

      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { raw: errorText };
      }

      return res.status(groqResponse.status === 429 ? 429 : 502).json({
        message: mapProviderError(groqResponse.status, errorDetails),
        details: errorDetails,
      });
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "I could not generate a response right now. Please try again.";

    return res.json({ reply });
  } catch (error) {
    next(error);
  }
});

module.exports = { chatbotRoutes: router };
