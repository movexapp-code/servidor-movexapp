const express = require("express");
const {
  guardarRespuestas,
  obtenerRespuestasUsuario,
} = require("../../controllers/respuesta.controller");
const router = express.Router();

router.post("/formulario/:usuarioId", guardarRespuestas);
router.get("/formulario/:usuarioId", obtenerRespuestasUsuario);

module.exports = router;
