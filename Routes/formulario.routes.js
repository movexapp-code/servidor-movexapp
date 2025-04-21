const express = require("express");
const {
  obtenerFormulario,

  agregarPreguntaFormulario,
} = require("../controllers/formulario.controller");
const router = express.Router();

router.get("/", obtenerFormulario);
router.post("/agregar", agregarPreguntaFormulario);

//router.post("/guardarRespuestas", guardarRespuestas);

module.exports = router;
