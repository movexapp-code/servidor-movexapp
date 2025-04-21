const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FormularioSchema = new Schema(
  {
    titulo: { type: String, required: true }, // Nombre del formulario
    preguntas: [
      {
        seccion: { type: String, required: true },
        pregunta: { type: String, required: true },
        opciones: [{ type: String }], // Opciones (máx. 3)
        tipoRespuesta: {
          type: String,
          enum: ["texto", "opcion", "numero"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Formulario", FormularioSchema);
