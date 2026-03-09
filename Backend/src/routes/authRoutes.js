const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const {
  ACCESS_COOKIE_NAME,
  comparePassword,
  getRefreshCookieOptions,
  hashPassword,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/auth");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const serializeUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      purchases: {
        select: { courseId: true },
      },
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    purchasedCourseIds: user.purchases.map((purchase) => purchase.courseId),
  };
};

const issueTokens = async (user, res, currentTokenId = null) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  if (currentTokenId) {
    await prisma.refreshToken.update({
      where: { id: currentTokenId },
      data: { revokedAt: new Date() },
    });
  }

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  res.cookie(ACCESS_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

  return {
    accessToken,
    user: await serializeUser(user.id),
  };
};

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        passwordHash: await hashPassword(payload.password),
      },
    });

    return res.status(201).json(await issueTokens(user, res));
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isValid = await comparePassword(payload.password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json(await issueTokens(user, res));
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies[ACCESS_COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing." });
    }

    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt < new Date()
    ) {
      return res.status(401).json({ message: "Refresh token invalid." });
    }

    if (storedToken.userId !== payload.sub) {
      return res.status(401).json({ message: "Refresh token mismatch." });
    }

    return res.json(await issueTokens(storedToken.user, res, storedToken.id));
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const refreshToken = req.cookies[ACCESS_COOKIE_NAME];
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    res.clearCookie(ACCESS_COOKIE_NAME, getRefreshCookieOptions());
    return res.json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: await serializeUser(req.user.id) });
});

module.exports = { authRoutes: router };
