const Alumno = require("../models/User");
const Formulario = require("../models/Formulario");
const Respuesta = require("../models/Respuesta");
const Archivos = require("../models/Archivos");
const Administrador = require("../models/Administrador");
const User = require("../models/User");
const subirArchivoService = require("../services/SubirArchivo");
const Rutina = require("../models/Rutina");

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

const obtenerRutinasAlumnoMixto = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar al alumno
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    const rutinaAlumno = alumno.rutina || [];

    // Formatear rutinas asignadas
    const rutinaFormateada = rutinaAlumno.map((rutina) => ({
      id: rutina._id,
      nombre: rutina.nombre,
      descripcion: rutina.descripcion || "",
      tips: rutina.tips || [],
      ejercicios: rutina.ejercicios.map((ejercicio) => ({
        ejercicio: ejercicio.ejercicio,
        series: ejercicio.series,
        repeticiones: ejercicio.repeticiones,
        descanso: ejercicio.descanso,
        descripcion: ejercicio.descripcion || "",
        url: ejercicio.url || "",
      })),
      tipo: "rutina_general",
    }));

    // Obtener y formatear rutinas temporales (por ID)
    const rutinasTemporalesDocs = await Rutina.find({
      _id: { $in: alumno.rutinasTemporales },
    });

    const rutinasTemporalesFormateadas = rutinasTemporalesDocs.map(
      (rutina) => ({
        id: rutina._id,
        nombre: rutina.nombre,
        descripcion: rutina.descripcion || "",
        tips: rutina.tips || [],
        ejercicios: rutina.ejercicios.map((ejercicio) => ({
          ejercicio: ejercicio.ejercicio,
          series: ejercicio.series,
          repeticiones: ejercicio.repeticiones,
          descanso: ejercicio.descanso,
          descripcion: ejercicio.descripcion || "",
          url: ejercicio.url || "",
        })),
        tipo: "rutina_temporal",
      })
    );

    // Unir ambas rutinas
    const rutinas = [...rutinaFormateada, ...rutinasTemporalesFormateadas];

    return res.json(rutinas);
  } catch (error) {
    console.error("Error al obtener rutinas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtenerRutinasTemporales = async (req, res) => {
  const { id } = req.params;

  // Buscar al alumno
  const alumno = await Alumno.findById(id);
  if (!alumno) {
    return res.status(404).json({ message: "Alumno no encontrado" });
  }

  // Obtener rutinas temporales que es un array de IDS
  const rutinasTemporales = await Promise.all(
    alumno.rutinasTemporales.map(async (idRutina) => {
      const rutina = await Rutina.findById(idRutina);
      return rutina;
    })
  );

  if (!rutinasTemporales) {
    return res.status(404).json({ message: "Rutinas no encontradas" });
  }

  return res.status(200).json(rutinasTemporales);
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
    const alumno = await Alumno.findById(id).lean();
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    const rutinasFinales = [];

    // Procesar rutinas embebidas
    if (alumno.rutina && alumno.rutina.length > 0) {
      const rutinasEmbutidas = await Promise.all(
        alumno.rutina.map(async (rutina) => {
          const ejercicios = await Promise.all(
            rutina.ejercicios.map(async (ejercicio) => {
              const archivo = await Archivos.findById(ejercicio.url).lean();
              return {
                ejercicio: ejercicio.ejercicio,
                series: ejercicio.series,
                repeticiones: ejercicio.repeticiones,
                descanso: ejercicio.descanso,
                descripcion: ejercicio.descripcion || "",
                url: archivo ? archivo.url : null,
              };
            })
          );

          return {
            nombre: rutina.nombre,
            descripcion: rutina.descripcion || "",
            tips: rutina.tips || [],
            ejercicios,
            tipo: "rutina_general",
          };
        })
      );

      rutinasFinales.push(...rutinasEmbutidas);
    }

    // Procesar rutinas temporales referenciadas
    if (alumno.rutinasTemporales && alumno.rutinasTemporales.length > 0) {
      const rutinasTemp = await Rutina.find({
        _id: { $in: alumno.rutinasTemporales },
      }).lean();

      const rutinasTemporalesProcesadas = await Promise.all(
        rutinasTemp.map(async (rutina) => {
          const ejercicios = await Promise.all(
            rutina.ejercicios.map(async (ejercicio) => {
              const archivo = await Archivos.findById(ejercicio.url).lean();
              return {
                ejercicio: ejercicio.ejercicio,
                series: ejercicio.series,
                repeticiones: ejercicio.repeticiones,
                descanso: ejercicio.descanso,
                descripcion: ejercicio.descripcion || "",
                url: archivo ? archivo.url : null,
              };
            })
          );

          return {
            nombre: rutina.nombre,
            descripcion: rutina.descripcion || "",
            tips: rutina.tips || [],
            ejercicios,
            tipo: "rutina_temporal",
          };
        })
      );

      rutinasFinales.push(...rutinasTemporalesProcesadas);
    }

    return res.json(rutinasFinales);
  } catch (error) {
    console.error("Error al obtener rutinas asignadas:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener rutinas asignadas" });
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
  obtenerRutinasTemporales,
  obtenerRutinasAlumnoMixto,
};
