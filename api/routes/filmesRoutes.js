const express = require("express");
const router = express.Router();
const filmesController = require("../controllers/filmesController");

router.get("/", filmesController.getFilmes);
router.post("/", filmesController.postFilme);

module.exports = router;
