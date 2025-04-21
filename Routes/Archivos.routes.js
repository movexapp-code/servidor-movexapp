const express = require("express");
const router = express.Router();

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads" });

const { asureAuth } = require("../middlewares/authenticated");

const configureCloudinary = require("../utils/cloudinary");
const {
  obtenerArchivos,
  subirArchivos,
  eliminarArchivo,
  asignarArchivosAUsuario,
  eliminarArchivosDeUsuario,
} = require("../controllers/archivos.controller");

router.get("/listar", asureAuth, obtenerArchivos); // Listar todos los archivos
router.post(
  "/subir",
  [asureAuth, md_upload, configureCloudinary],
  subirArchivos
); // Subir un archivo
router.delete(
  "/eliminar/:id",
  [asureAuth, md_upload, configureCloudinary],
  eliminarArchivo
); // Eliminar un archivo por ID
router.post("/asignar/:id", asureAuth, asignarArchivosAUsuario); // Asignar un archivo
router.post("/quitar/:id", asureAuth, eliminarArchivosDeUsuario); // Asignar un archivo

module.exports = router;
