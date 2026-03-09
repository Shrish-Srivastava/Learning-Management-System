const { Prisma } = require("@prisma/client");
const { ZodError } = require("zod");

const formatFieldName = (path = []) => {
  const rawName = path[path.length - 1];
  if (!rawName) {
    return "This field";
  }

  const normalized = String(rawName)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getFriendlyValidationMessage = (issue) => {
  const fieldName = formatFieldName(issue.path);

  if (issue.code === "invalid_format" && issue.format === "email") {
    return "Please enter a valid email address.";
  }

  if (issue.code === "invalid_format" && issue.format === "url") {
    return "Please enter a valid URL.";
  }

  if (issue.code === "too_small" && issue.minimum != null) {
    if (issue.origin === "string") {
      return `${fieldName} must be at least ${issue.minimum} characters.`;
    }

    if (issue.origin === "number") {
      return `${fieldName} must be at least ${issue.minimum}.`;
    }
  }

  if (issue.code === "invalid_type") {
    return `${fieldName} is required.`;
  }

  return issue.message || "Please check your input and try again.";
};

const getUniqueFieldMessage = (target = []) => {
  const fields = Array.isArray(target) ? target : [target];
  const label = fields
    .filter(Boolean)
    .map((field) => formatFieldName([field]).toLowerCase())
    .join(" and ");

  if (!label) {
    return "This record already exists.";
  }

  return `${label.charAt(0).toUpperCase() + label.slice(1)} is already in use.`;
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: getFriendlyValidationMessage(error.issues[0]),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: getUniqueFieldMessage(error.meta?.target),
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "The requested record could not be found.",
      });
    }
  }

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
};

module.exports = { errorHandler };
