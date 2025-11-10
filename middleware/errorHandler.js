const errorHandler = (err, req, res, next) => {
  console.error("Erro capturado pelo middleware:", err);

  res.status(500).json({
    status: "error",
    message: err.message || "Erro interno do servidor",
  });

  next();
};

module.exports = errorHandler;
