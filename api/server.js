require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para JSON
app.use(express.json());

// Conexão com o banco
require("./config/db");
require("./models/filme");

// Rotas
const filmesRoutes = require("./routes/filmesRoutes");
app.use("/api/filmes", filmesRoutes);

// Middleware de erro
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/* app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); */

// Só inicia o servidor se não for teste
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;

