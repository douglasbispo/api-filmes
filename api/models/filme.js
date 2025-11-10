const db = require("../config/db");

const createTable = `
  CREATE TABLE IF NOT EXISTS filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    ano INT NOT NULL
  )
`;

db.query(createTable, (err) => {
  if (err) {
    console.error("Erro ao criar tabela filmes:", err);
    return;
  }
  console.log("Tabela 'filmes' verificada/criada com sucesso");
});

// Funções do Model
const Filme = {
  getAll: (callback) => {
    db.query("SELECT * FROM filmes", callback);
  },

  create: (filme, callback) => {
    const { titulo, genero, ano } = filme;
    db.query(
      "INSERT INTO filmes (titulo, genero, ano) VALUES (?, ?, ?)",
      [titulo, genero, ano],
      callback
    );
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM filmes WHERE id = ?", [id], callback);
  },

  deleteById: (id, callback) => {
    db.query("DELETE FROM filmes WHERE id = ?", [id], callback);
  },
};

module.exports = Filme;
