const Video = require("../models/Videos");

const obtenerVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los videos" });
  }
};

const crearVideo = async (req, res) => {
  try {
    const { nombre, descripcion, url } = req.body;

    const nuevoVideo = new Video({
      nombre,
      descripcion,
      url,
    });

    await nuevoVideo.save();

    res.status(200).json({
      message: "Video subido correctamente",
      video: nuevoVideo,
      ok: true,
    });
  } catch (error) {
    console.error("Error al subir el video:", error);
    res
      .status(500)
      .json({ message: "Error al subir el video-catch", ok: false });
  }
};

const eliminarVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    res.status(200).json({ message: "Video eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el video:", error);
    res.status(500).json({ message: "Error al eliminar el video" });
  }
};

const obtenerVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("Error al obtener el video:", error);
    res.status(500).json({ message: "Error al obtener el video" });
  }
};

const editarVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, url } = req.body;

    const video = await Video.findByIdAndUpdate(
      id,
      { nombre, descripcion, url },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    res.status(200).json({
      message: "Video actualizado correctamente",
      video,
      ok: true,
    });
  } catch (error) {
    console.error("Error al editar el video:", error);
    res.status(500).json({ message: "Error al editar el video" });
  }
};

module.exports = {
  obtenerVideos,
  crearVideo,
  eliminarVideo,
  obtenerVideo,
  editarVideo,
};
