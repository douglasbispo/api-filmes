const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

router.get("/", filmesController.getFilmes);
router.post("/", filmesController.postFilme);
router.delete("/:id", filmesController.deleteFilme);

module.exports = router;
