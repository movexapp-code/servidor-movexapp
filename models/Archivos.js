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
    nombre: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Archivo", ArchivoSchema);
