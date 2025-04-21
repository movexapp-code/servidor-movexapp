const cloudinary = require("cloudinary").v2;

const eliminarArchivoService = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error("Error al eliminar el archivo de Cloudinary:", error);
    throw new Error("Error al eliminar el archivo");
  }
};

module.exports = eliminarArchivoService;
