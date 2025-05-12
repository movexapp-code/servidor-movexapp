const Archivo = require("../models/Archivos");
const Alumno = require("../models/User");
const eliminarArchivoService = require("../services/eliminarArchivoService");
const subirArchivoService = require("../services/SubirArchivo");

const obtenerArchivos = async (req, res) => {
  try {
    const archivos = await Archivo.find();
    res.status(200).json(archivos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los archivos" });
  }
};

const subirArchivos = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { file } = req.files;
    console.log(file);

    const result = await subirArchivoService(file);
    //console.log(file);

    if (!result) {
      return res.status(500).json({ message: "Error al subir el archivo" });
    }

    const nuevoArchivo = new Archivo({
      nombre,
      url: result.secure_url,
      public_id: result.public_id,
      id: nombre,
    });

    await nuevoArchivo.save();

    res.status(200).json({
      message: "Archivo subido correctamente",
      archivo: nuevoArchivo,
      ok: true,
    });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    res
      .status(500)
      .json({ message: "Error al subir el archivo-catch", ok: false });
  }
};

const eliminarArchivo = async (req, res) => {
  try {
    const { id } = req.params;

    const archivo = await Archivo.findById(id);
    if (!archivo) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    await eliminarArchivoService(archivo.public_id);

    await archivo.deleteOne();

    res.status(200).json({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error al eliminar el archivo" });
  }
};

const asignarArchivosAUsuario = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { archivosIds } = req.body; // Arreglo de IDs de archivos desde el body
    console.log(archivosIds);

    // Validar que se envíe un arreglo de IDs
    if (!Array.isArray(archivosIds) || archivosIds.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Se debe enviar un arreglo de IDs de archivos." });
    }

    // Buscar el usuario
    const usuario = await Alumno.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Buscar los archivos en paralelo
    const archivos = await Archivo.find({ _id: { $in: archivosIds } });
    console.log(archivos);

    if (archivos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron archivos." });
    }

    // Asignar los archivos al usuario y los usuarios a los archivos
    const archivosAsignados = [];
    for (const archivo of archivos) {
      if (!usuario.archivosAsignados.includes(archivo._id)) {
        usuario.archivosAsignados.push(archivo._id);
        archivosAsignados.push(archivo._id); // Guardar los archivos asignados para el guardado posterior
      }

      if (!archivo.alumnos.includes(usuario._id)) {
        archivo.alumnos.push(usuario._id);
      }
    }

    // Guardar los cambios en paralelo
    await Promise.all([
      usuario.save(),
      ...archivos.map((archivo) => archivo.save()),
    ]);

    return res
      .status(200)
      .json({ mensaje: "Archivos asignados exitosamente", archivosAsignados });
  } catch (error) {
    console.error("Error al asignar archivos:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

const eliminarArchivosDeUsuario = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { archivosIds } = req.body; // Arreglo de IDs de archivos desde el body

    // Validar que se envíe un arreglo de IDs
    if (!Array.isArray(archivosIds) || archivosIds.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Se debe enviar un arreglo de IDs de archivos." });
    }

    // Buscar el usuario
    const usuario = await Alumno.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Buscar los archivos en paralelo
    const archivos = await Archivo.find({ _id: { $in: archivosIds } });
    if (archivos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron archivos." });
    }

    // Eliminar los archivos del usuario y el usuario de los archivos
    for (const archivo of archivos) {
      // Eliminar el archivo del usuario
      usuario.archivosAsignados = usuario.archivosAsignados.filter(
        (idArchivo) => !idArchivo.equals(archivo._id)
      );

      // Eliminar el usuario de los alumnos del archivo
      archivo.alumnos = archivo.alumnos.filter(
        (idUsuario) => !idUsuario.equals(usuario._id)
      );
    }

    // Guardar los cambios en paralelo
    await Promise.all([
      usuario.save(),
      ...archivos.map((archivo) => archivo.save()),
    ]);

    return res
      .status(200)
      .json({ mensaje: "Archivos eliminados exitosamente del usuario." });
  } catch (error) {
    console.error("Error al eliminar archivos:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

module.exports = {
  obtenerArchivos,
  subirArchivos,
  eliminarArchivo,
  asignarArchivosAUsuario,
  eliminarArchivosDeUsuario,
};
