const express = require("express");
const {
  obtenerVideos,
  obtenerVideo,
  crearVideo,
  editarVideo,
    eliminarVideo,
} = require("../controllers/videos.controller");
const router = express.Router();

router.get("/", obtenerVideos); // Listar todos los videos
router.get("/:id", obtenerVideo); // Listar un video por ID
router.post("/nuevo", crearVideo); // Crear un video
router.patch("/:id", editarVideo); // Editar un video por ID
router.delete("/:id", eliminarVideo); // Eliminar un video por ID

module.exports = router;
