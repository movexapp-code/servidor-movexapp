// controllers/admin.controller.js

const Alumno = require("../models/User");
const cloudinary = require("cloudinary").v2;
const Administrador = require("../models/Administrador");
const PDFDocument = require("pdfkit");
const subirArchivoService = require("../services/SubirArchivo");
const mongoose = require("mongoose");

//crear Administrador
const crearAdministrador = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const nuevoAdministrador = new Administrador({
      nombre,
      apellido,
      email,
      password,
    });
    await nuevoAdministrador.save();
    res.status(201).json({
      message: "Administrador creado exitosamente",
      administrador: nuevoAdministrador,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerRutinasGenerales = async (req, res, next) => {
  try {
    const { id } = req.params; // ID del administrador
    const administrador = await Administrador.findById(id);
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    const rutinasGenerales = administrador.rutinas;
    if (!rutinasGenerales || rutinasGenerales.length === 0) {
      return res.status(404).json({ message: "No hay rutinas generales" });
    }
    res.status(200).json({
      message: "Rutinas generales obtenidas exitosamente",
      rutinasGenerales,
      ok: true,
    });
  } catch (error) {
    next(error);
  }
};

const crearRutinaGeneral = async (req, res, next) => {
  try {
    const { id } = req.params; // ID del administrador
    const { nombre, rutina } = req.body;
    const admin = await Administrador.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    const nuevaRutina = {
      nombre,
      rutina: rutina.map((ejercicio) => ({
        ejercicio: ejercicio.ejercicio,
        series: ejercicio.series,
        repeticiones: ejercicio.repeticiones,
        descanso: ejercicio.descanso,
      })),
    };

    admin.rutinas.push(nuevaRutina);
    await admin.save();

    res.status(201).json({
      message: "Rutina general creada exitosamente",

      rutina: nuevaRutina,
      ok: true,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerAdmin = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const { id } = req.params;
    const administrador = await Administrador.findById(id);
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    res.status(200).json(administrador);
  } catch (error) {
    next(error);
  }
};

// Listar todos los alumnos
const listarAlumnos = async (req, res, next) => {
  try {
    const alumnos = await Alumno.find();
    res.status(200).json(alumnos);
  } catch (error) {
    next(error);
  }
};

// Obtener un alumno por ID
const obtenerAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    res.status(200).json(alumno);
  } catch (error) {
    next(error);
  }
};

const obtenerArchivosAdmin = async (req, res) => {
  const { id } = req.params;

  const administrador = await Administrador.findById(id);
  if (!administrador) {
    return res.status(404).json({ message: "Administrador no encontrado" });
  }

  const archivos = administrador.archivos;
  if (!archivos) {
    return res.status(404).json({ message: "Archivos no encontrados" });
  }

  res.status(200).json(archivos);
};

// Eliminar un archivo de un administrador
const eliminarArchivo = async (req, res) => {
  try {
    const { id, idarchivo } = req.params;
    const administrador = await Administrador.findById(id);
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    const archivo = administrador.archivos.id(idarchivo);
    if (!archivo) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    // Eliminar el archivo de Cloudinary
    await cloudinary.uploader.destroy(archivo.public_id);
    // Eliminar el archivo de la base de datos
    administrador.archivos.filter((arch) => arch._id != idarchivo);
    await administrador.save();
    res.status(200).json({ message: "Archivo eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    res.status(500).json({ message: "Error del servidor", ok: false });
  }
};

// Subir un archivo (se asume que se utiliza un middleware como multer para procesar req.file)
const subirArchivo = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const { archivo } = req.files;
    const { idAdmin } = req.params;

    const administrador = await Administrador.findById(idAdmin);

    if (!administrador) {
      return res
        .status(400)
        .json({ message: "Usuario no encontrado", ok: false });
    }

    // Subir archivo a Cloudinary
    const result = await subirArchivoService(archivo);

    administrador.archivos.push({
      nombre,
      descripcion,
      url: result.secure_url,
      public_id: result.public_id,
    });

    administrador.save();

    res.status(200).json({
      message: "Archivo subido correctamente",
      usuario: administrador,
      ok: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
};

// Crear un alumno nuevo
const crearAlumno = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, tipoAlumno } = req.body;
    // Puedes agregar validaciones adicionales si es necesario
    const nuevoAlumno = new Alumno({
      nombre,
      apellido,
      email,
      password,
      tipoAlumno,
    });
    await nuevoAlumno.save();
    res.status(201).json({
      message: "Alumno creado exitosamente",
      alumno: nuevoAlumno,
      ok: true,
    });
  } catch (error) {
    next(error);
  }
};

// Agregar una rutina a un alumno por ID
const agregarRutina = async (req, res, next) => {
  /* try { */
  const { id } = req.params; // ID del alumno
  const { nombre, descripcion, tip, ejercicios } = req.body;
  console.log(req.body);

  /* const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    // Se incluye ejercicios, si no se envía, se inicializa con un array vacío.
    const nuevaRutina = {
      nombre,
      descripcion,
      tip,
      ejercicios: ejercicios || [],
    };
    alumno.rutina.push(nuevaRutina);
    await alumno.save();
    res
      .status(200)
      .json({ message: "Rutina agregada exitosamente", rutina: nuevaRutina });
  } catch (error) {
    next(error);
  } */
};

// Agregar un comentario a un alumno
const agregarComentario = async (req, res, next) => {
  try {
    const { id } = req.params; // ID del alumno
    const { comentario } = req.body;
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    const nuevoComentario = { comentario, fecha: new Date() };
    alumno.comentarios.push(nuevoComentario);
    await alumno.save();
    res.status(200).json({
      message: "Comentario agregado exitosamente",
      comentario: nuevoComentario,
    });
  } catch (error) {
    next(error);
  }
};

// Agregar un ejercicio a una rutina de un alumno
const agregarEjercicio = async (req, res, next) => {
  try {
    const { id, idRutina } = req.params; // id: alumno, idRutina: id de la rutina (subdocumento)
    const { ejercicio, series, repeticiones, descanso } = req.body;
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    // Se busca la rutina utilizando el método de subdocumentos de Mongoose
    const rutina = alumno.rutina.id(idRutina);
    if (!rutina) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }
    // Si la rutina no tiene el array de ejercicios, se inicializa
    if (!rutina.ejercicios) rutina.ejercicios = [];
    const nuevoEjercicio = { ejercicio, series, repeticiones, descanso };
    rutina.ejercicios.push(nuevoEjercicio);
    await alumno.save();
    res.status(200).json({
      message: "Ejercicio agregado exitosamente",
      ejercicio: nuevoEjercicio,
      ok: true,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un ejercicio de una rutina de un alumno
const eliminarEjercicio = async (req, res, next) => {
  try {
    const { id, idRutina } = req.params;
    const { ejercicioId } = req.body; // se espera que se envíe el id del ejercicio a eliminar
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    const rutina = alumno.rutina.id(idRutina);
    if (!rutina) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }
    if (!rutina.ejercicios) {
      return res
        .status(400)
        .json({ message: "No hay ejercicios para eliminar" });
    }
    const ejercicioIndex = rutina.ejercicios.findIndex(
      (ex) => ex._id.toString() === ejercicioId
    );
    if (ejercicioIndex === -1) {
      return res.status(404).json({ message: "Ejercicio no encontrado" });
    }
    rutina.ejercicios.splice(ejercicioIndex, 1);
    await alumno.save();
    res.status(200).json({ message: "Ejercicio eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Agregar un tip a una rutina de un alumno
const agregarTip = async (req, res, next) => {
  try {
    const { id, idRutina } = req.params;
    const { tip } = req.body;

    // Buscamos el alumno por ID
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Buscamos la rutina en el subdocumento
    const rutina = alumno.rutina.id(idRutina);
    if (!rutina) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    /* // Si no existe el array de tips, lo inicializamos
      if (!Array.isArray(rutina.tips)) {
        rutina.tips = [];
      } */

    // Agregamos el nuevo tip
    rutina.tips.push(tip);

    await alumno.save();
    res
      .status(200)
      .json({ message: "Tip agregado exitosamente", tips: rutina.tips });
  } catch (error) {
    next(error);
  }
};

// Generar PDF de una rutina de un alumno

const generarPdf = async (req, res, next) => {
  try {
    const { id, idRutina } = req.params;
    const alumno = await Alumno.findById(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    const rutina = alumno.rutina.id(idRutina);
    if (!rutina) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    // Configurar el nombre del archivo
    const fileName = `Rutina_${alumno.nombre}.pdf`;

    // Configurar headers para la descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Crear el documento PDF
    const doc = new PDFDocument();
    doc.pipe(res); // Enviar el PDF al cliente directamente

    doc.fontSize(20).text(`Rutina: ${rutina.nombre}`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Descripción: ${rutina.descripcion}`);
    doc.moveDown();

    if (rutina.ejercicios.length > 0) {
      doc.fontSize(16).text("Ejercicios:", { underline: true });
      doc.moveDown(0.5);
      rutina.ejercicios.forEach((ej, idx) => {
        doc.fontSize(12).text(`${idx + 1}. ${ej.ejercicio}`);
        doc.text(
          `   Series: ${ej.series} | Repeticiones: ${ej.repeticiones} | Descanso: ${ej.descanso}`
        );
        doc.moveDown(0.5);
      });
    }

    if (rutina.tips.length > 0) {
      doc.moveDown();
      doc.fontSize(16).text("Tips:", { underline: true });
      doc.moveDown(0.5);
      rutina.tips.forEach((tip, idx) => {
        doc.fontSize(12).text(`${idx + 1}. ${tip}`);
        doc.moveDown(0.3);
      });
    }

    doc.end(); // Finalizar el documento
  } catch (error) {
    next(error);
  }
};

// Eliminar un alumno por ID
const eliminarAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alumno = await Alumno.findByIdAndDelete(id);
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    res.status(200).json({ message: "Alumno eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Actualizar un alumno por ID
const actualizarAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const alumno = await Alumno.findByIdAndUpdate(id, updates, { new: true });
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Alumno actualizado exitosamente", alumno, ok: true });
  } catch (error) {
    next(error);
  }
};

// Actualizar gráfico de un alumno por ID (suponiendo que se actualiza un campo 'grafico')
const actualizarGrafico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { grafico } = req.body;
    const alumno = await Alumno.findByIdAndUpdate(
      id,
      { grafico },
      { new: true }
    );
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Gráfico actualizado exitosamente", alumno });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
