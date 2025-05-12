const express = require("express");
const router = express.Router();

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads" });
const { asureAuth } = require("../middlewares/authenticated");

const configureCloudinary = require("../utils/cloudinary");
const {
  login,
  obtenerArchivosAsignados,
  obtenerRutinasAsignadas,
  obtenerRutina,
  subirArchivoAlumno,
  obtenerRutinasTemporales,
  obtenerRutinasAlumnoMixto,
} = require("../controllers/usuario.controller");

const { obtenerAlumno } = require("../controllers/administrador.controller");
const {
  guardarRespuestas,
  obtenerRespuestasUsuario,
} = require("../controllers/respuesta.controller");
const { obtenerArchivos } = require("../controllers/archivos.controller");

// Importamos los controladores del administrador

/* GET */
router.get("/:id", asureAuth, obtenerAlumno); // Listar un alumno por ID
router.get("/:id/formulario/respuestas", asureAuth, obtenerRespuestasUsuario); // Obtener respuestas de un formulario por ID
router.get("/:id/archivos/asignados", asureAuth, obtenerArchivosAsignados); // Listar todos los archivos asignados
router.get("/:id/rutinas/asignadas", asureAuth, obtenerRutinasAsignadas); // Listar todas las rutinas asignadas
router.get("/:id/rutinas/asignadas/:idRutina", asureAuth, obtenerRutina); // Listar todas las rutinas asignadas
router.get("/:id/rutinas/temporales", asureAuth, obtenerRutinasTemporales); // Listar todas las rutinas temporales
router.get("/:id/rutinas/mixtas", asureAuth, obtenerRutinasAlumnoMixto); // Listar todas las rutinas mixtas
/* POST */
router.post("/:usuarioId/formulario/responder", asureAuth, guardarRespuestas); // Responder un formulario
router.post("/login", asureAuth, login); // Iniciar sesión
router.post(
  "/:id/subir/archivo",
  [asureAuth, md_upload, configureCloudinary],
  subirArchivoAlumno
); // Subir un archivo

module.exports = router;
