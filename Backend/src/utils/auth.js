const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { env } = require("../config/env");

const ACCESS_COOKIE_NAME = "skillup_refresh_token";

const signAccessToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenExpiresIn }
  );

const signRefreshToken = (user) =>
  jwt.sign({ sub: user.id }, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });

const verifyAccessToken = (token) => jwt.verify(token, env.accessTokenSecret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, env.refreshTokenSecret);

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 1000 * 60 * 60 * 24 * 30,
});

module.exports = {
  ACCESS_COOKIE_NAME,
  comparePassword,
  getRefreshCookieOptions,
  hashPassword,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
