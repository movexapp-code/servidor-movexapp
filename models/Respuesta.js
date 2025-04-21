const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RespuestaSchema = new Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Alumno", required: true },
    formulario: { type: mongoose.Schema.Types.ObjectId, ref: "Formulario", required: true },
    respuestas: [
      {
        preguntaId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID de la pregunta
        respuesta: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Respuesta", RespuestaSchema);
