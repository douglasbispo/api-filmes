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

const deleteFilme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const result = await filmesService.removerFilme(id);

    if (!result.deleted) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFilmes,
  postFilme,
  deleteFilme,
};
