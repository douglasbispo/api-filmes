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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
