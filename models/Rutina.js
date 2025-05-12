const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RutinaSchema = new Schema({
  nombre: String,
  descripcion: String,
  ejercicios: [
    {
      ejercicio: String,
      series: String,
      repeticiones: String,
      descanso: String,
      descripcion: String,
    },
  ],
});

module.exports = mongoose.model("Rutina", RutinaSchema);
