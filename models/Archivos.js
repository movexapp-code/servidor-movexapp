const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArchivoSchema = new Schema(
  {
    alumnos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumno",
      },
    ],
    descripcion: { type: String },
    nombre: { type: String, default: Date.now() },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Archivo", ArchivoSchema);
