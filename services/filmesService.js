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

const removerFilme = (id) => {
  return new Promise((resolve, reject) => {
    Filme.deleteById(id, (err, result) => {
      if (err) return reject(err);
      if (!result || result.affectedRows === 0) {
        return resolve({ deleted: false });
      }
      resolve({ deleted: true });
    });
  });
};

module.exports = {
  listarFilmes,
  criarFilme,
  removerFilme,
};
