const Alumno = require("../models/User");
const Formulario = require("../models/Formulario");
const Respuesta = require("../models/Respuesta");
const Archivos = require("../models/Archivos");
const Administrador = require("../models/Administrador");
const User = require("../models/User");
const subirArchivoService = require("../services/SubirArchivo");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    let usuario = await Alumno.findOne({ email: normalizedEmail }).lean();

    if (!usuario) {
      usuario = await Administrador.findOne({ email: normalizedEmail }).lean();
    }

    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", ok: false });
    }

    // Si las contraseñas están hasheadas, deberías usar bcrypt.compare
    if (usuario.password !== password) {
      return res
        .status(401)
        .json({ message: "Contraseña incorrecta", ok: false });
    }

    return res.status(200).json({
      message: "Usuario logeado correctamente",
      usuario,
      ok: true,
    });
  } catch (error) {
    console.error("Error al loguear:", error);
    return res.status(500).json({ message: "Error del servidor", ok: false });
  }
};

const obtenerAlumno = async (req, res, next) => {
  try {
    const { alumnoId } = req.params;

    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    return res.status(200).json(alumno);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const obtenerArchivosAsignados = async (req, res) => {
  const { id } = req.params;

  const alumno = await Alumno.findById(id);
  if (!alumno) {
    return res.status(404).json({ message: "Alumno no encontrado" });
  }

  const archivos = await Archivos.find({ alumnos: id });
  if (!archivos) {
    return res.status(404).json({ message: "Archivos no encontrados" });
  }

  return res.status(200).json(archivos);
};

const obtenerRutinasAsignadas = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar al alumno
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Procesar cada rutina
    const rutina = await Promise.all(
      alumno.rutina.map(async (rutina) => {
        // Obtener ejercicios con URLs resueltas
        const ejercicios = await Promise.all(
          rutina.ejercicios.map(async (ejercicio) => {
            const archivo = await Archivos.findById(ejercicio.url);
            return {
              ejercicio: ejercicio.ejercicio, // Nombre del ejercicio
              series: ejercicio.series,
              repeticiones: ejercicio.repeticiones,
              descanso: ejercicio.descanso,
              url: archivo ? archivo.url : null, // Manejar caso si no se encuentra el archivo
              descripcion: ejercicio.descripcion, // Descripción del ejercicio
            };
          })
        );

        return {
          nombre: rutina.nombre,
          descripcion: rutina.descripcion,
          tips: rutina.tips,
          ejercicios: ejercicios, // Ahora contiene los datos ya procesados
        };
      })
    );

    console.log(rutina);
    return res.status(200).json(rutina);
  } catch (error) {
    console.error("Error obteniendo rutinas:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const obtenerRutina = async (req, res) => {
  const { idRutina, id } = req.params;

  // Buscar al alumno
  const alumno = await Alumno.findById(id);
  if (!alumno) {
    return res.status(404).json({ message: "Alumno no encontrado" });
  }

  // Buscar la rutina específica
  const rutina = alumno.rutina.find((r) => r._id.toString() === idRutina);
  if (!rutina) {
    return res.status(404).json({ message: "Rutina no encontrada" });
  }

  return res.status(200).json(rutina);
};

const subirArchivoAlumno = async (req, res) => {
  const { nombre } = req.body;
  const { id } = req.params;
  const { archivo } = req.files;

  // Verificar si el archivo existe
  if (archivo === undefined) {
    return res.status(400).json({ message: "Archivo no encontrado" });
  }

  const alumno = await Alumno.findById(id);

  if (!alumno) {
    return res
      .status(400)
      .json({ message: "Usuario no encontrado", ok: false });
  }
  try {
    // Subir archivo a Cloudinary
    const result = await subirArchivoService(archivo);

    alumno.archivos.push({
      nombre: nombre,
      url: result.secure_url,
      public_id: result.public_id,
    });

    alumno.save();

    res.status(200).json({
      message: "Archivo subido correctamente",
      usuario: alumno,
      ok: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
};

module.exports = {
  obtenerAlumno,
  login,
  obtenerArchivosAsignados,
  obtenerRutinasAsignadas,
  obtenerRutina,
  subirArchivoAlumno,
};
