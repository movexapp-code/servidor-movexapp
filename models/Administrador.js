const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  rol: {
    type: String,
    default: "administrador",
  },
  archivos: [
    {
      url: String,
      nombre: String,
      id: String,
      public_id: String,
      descripcion: String,
      fecha: { type: Date, default: Date.now },
    },
  ],

  rutinas: [
    {
      nombre: String,
      rutina: [
        {
          ejercicio: String,
          series: String,
          repeticiones: String,
          descanso: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Administrador", AdminSchema);
