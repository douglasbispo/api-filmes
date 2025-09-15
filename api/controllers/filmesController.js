const filmesService = require("../services/filmesService");

const getFilmes = async (req, res, next) => {
  try {
    const filmes = await filmesService.listarFilmes();
    res.status(200).json(filmes);
  } catch (err) {
    next(err);
  }
};

const postFilme = async (req, res, next) => {
  try {
    const novoFilme = req.body;
    const filmeCriado = await filmesService.criarFilme(novoFilme);
    res.status(201).json(filmeCriado);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFilmes,
  postFilme,
};
