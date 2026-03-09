const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "replace-access-secret",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "replace-refresh-secret",
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  adminName: process.env.ADMIN_NAME || "Shrish",
  adminEmail: process.env.ADMIN_EMAIL || "admin@skillup.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@123",
};

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is missing in Backend/.env");
}

module.exports = { env };
