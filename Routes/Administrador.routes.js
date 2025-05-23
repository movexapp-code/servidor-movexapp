const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads" });
const { asureAuth } = require("../middlewares/authenticated");
const configureCloudinary = require("../utils/cloudinary");

// Importamos los controladores del administrador
const {
  listarAlumnos,
  obtenerAlumno,
  subirArchivo,
  crearAlumno,
  agregarRutina,
  agregarComentario,
  agregarEjercicio,
  eliminarEjercicio,
  agregarTip,
  generarPdf,
  eliminarAlumno,
  actualizarAlumno,
  actualizarGrafico,
  crearAdministrador,
  obtenerAdmin,
  obtenerArchivosAdmin,
  eliminarArchivo,
  crearRutinaGeneral,
  obtenerRutinasGenerales,
  editarRutinaGeneral,
  asignarRutinaGeneralAlumno,
  actualizarRutina,
  eliminarRutina,
  obtenerRutinasGeneralesCompletas,
} = require("../controllers/administrador.controller");
const { crearFormulario } = require("../controllers/formulario.controller");

//crear administrador
router.post("/crear-administrador", asureAuth, crearAdministrador);
router.post("/crear/formulario", crearFormulario);

/* GET */
//router.get("/api/rutinas/generales", asureAuth, listaDeRutinasGenerales); // Listar todas las rutinas generales
router.get("/:id/archivos", asureAuth, obtenerArchivosAdmin);
router.get("/admin/:id", asureAuth, obtenerAdmin);
// Listar todos los alumnos
router.get("/alumnos", asureAuth, listarAlumnos);
// Listar un alumno por ID
router.get("/alumnos/:id", asureAuth, obtenerAlumno);
router.get("/rutinas/generales", asureAuth, obtenerRutinasGenerales); // Listar todas las rutinas generales
router.get(
  "/rutinas/generales/completas",
  asureAuth,
  obtenerRutinasGeneralesCompletas
); // Listar todas las rutinas generales

/* POST */
// Subir un archivo (aplica autenticación, carga y configuración de Cloudinary)
router.post(
  "/:idAdmin/subir-archivo",
  [asureAuth, md_upload, configureCloudinary],
  subirArchivo
);
router.post("/crear/rutina/general", asureAuth, crearRutinaGeneral); // Crear una rutina general
router.patch(
  "/editar/rutina/general/:id",
  asureAuth,
  editarRutinaGeneral
); // Editar una rutina general
router.post(
  "/asignar/rutina/general/:id",
  asureAuth,
  asignarRutinaGeneralAlumno
); // Asignar una rutina general a un alumno

// Crear un alumno
router.post("/alumnos/nuevo", asureAuth, crearAlumno);
// Agregar una rutina a un alumno por ID
router.post("/alumnos/:id/agregar-rutina", asureAuth, agregarRutina);
// Agregar un comentario a un alumno
router.post("/alumnos/:id/agregar-comentario", asureAuth, agregarComentario);
// Agregar un ejercicio a una rutina de un alumno
router.post(
  "/alumnos/:id/rutina/:idRutina/agregar-ejercicio",
  asureAuth,
  agregarEjercicio
);
// Eliminar un ejercicio de una rutina de un alumno
router.post(
  "/alumnos/:id/rutina/:idRutina/eliminar-ejercicio",
  asureAuth,
  eliminarEjercicio
);
// Agregar un tip a una rutina de un alumno
router.post("/alumnos/:id/rutina/:idRutina/agregar-tip", asureAuth, agregarTip);
// Generar PDF de una rutina de un alumno
router.post("/alumnos/:id/rutina/:idRutina/generar-pdf", asureAuth, generarPdf);

/* DELETE */
// Eliminar un alumno por ID
router.delete("/alumnos/:id/eliminar", asureAuth, eliminarAlumno);
router.delete(
  "/:id/archivos/:idarchivo",
  [asureAuth, md_upload, configureCloudinary],
  eliminarArchivo
); // Eliminar un archivo por ID
router.delete("/:id/rutina/eliminar/:idRutina", asureAuth, eliminarRutina); // Eliminar una rutina general por ID

/* PATCH */
// Actualizar un alumno por ID
router.patch("/alumnos/:id/actualizar", asureAuth, actualizarAlumno);
// Actualizar el gráfico de un alumno por ID
router.patch("/alumnos/:id/grafico/actualizar", asureAuth, actualizarGrafico);
router.patch(
  "/alumnos/:id/rutina/:idRutina/actualizar",
  asureAuth,
  actualizarRutina
); // Actualizar una rutina de un alumno por ID

module.exports = router;
