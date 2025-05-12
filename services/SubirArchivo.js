const cloudinary = require("cloudinary").v2;

const subirArchivoService = async (archivo) => {
  try {
    const result = await cloudinary.uploader.upload(archivo.path, {
      resource_type: "auto",
      public_id: `archivos/${archivo.originalFilename}`, // Usar filename en lugar de name
    });

    return result;
  } catch (error) {
    console.error("Error al subir el archivo a Cloudinary:", error);
    throw new Error("Error al subir el archivo");
  }
};
module.exports = subirArchivoService;
