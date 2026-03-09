const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: error.message || "Something went wrong.",
  });
};

module.exports = { errorHandler };
