const Filme = require("../models/filme");

const listarFilmes = () => {
  return new Promise((resolve, reject) => {
    Filme.getAll((err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const criarFilme = (novoFilme) => {
  return new Promise((resolve, reject) => {
    if (!novoFilme.titulo || !novoFilme.genero || !novoFilme.ano) {
      return reject(new Error("Todos os campos (titulo, genero, ano) são obrigatórios"));
    }

    Filme.create(novoFilme, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...novoFilme });
    });
  });
};

module.exports = {
  listarFilmes,
  criarFilme,
};
