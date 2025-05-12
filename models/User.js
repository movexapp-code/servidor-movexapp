const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlumnoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tipoAlumno: { type: String, default: "principiante" },

    archivos: [
      {
        url: String,
        nombre: String,
        id: String,
      },
    ],

    archivosAsignados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Archivo",
      },
    ],

    respuestas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Respuesta",
      },
    ],

    rutinasTemporales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rutina",
      },
    ],

    rutina: [
      {
        fecha: { type: Date, default: Date.now },
        nombre: String,
        descripcion: String,
        tips: [String],
        ejercicios: [
          {
            ejercicio: String,
            series: String,
            repeticiones: String,
            descripcion: String,
            descanso: String,
            url: String,
          },
        ],
      },
    ],

    rol: { type: String, default: "alumno" },
    activo: { type: Boolean, default: true },

    comentarios: [
      {
        comentario: String,
        fecha: { type: Date, default: Date.now },
      },
    ],

    peso: { type: Number, default: 0 },
    altura: { type: Number, default: 0 },
    edad: { type: Number, default: 0 },
    imc: { type: Number, default: 0 },
    porcentajeGrasa: { type: Number, default: 0 },
    porcentajeMusculo: { type: Number, default: 0 },
    porcentajeAgua: { type: Number, default: 0 },

    metabolismoBasal: { type: Number, default: 0 },
    metabolismoActivo: { type: Number, default: 0 },
    metabolismoTotal: { type: Number, default: 0 },

    flexibiliadad: { type: Number, default: 0 },
    fuerza: { type: Number, default: 0 },
    resistencia: { type: Number, default: 0 },
    movilidad: { type: Number, default: 0 },
    porcentajeGlobal: { type: Number, default: 0 },

    /* tipoMembresia: {
      type: String,
      enum: ["basica", "premium"],
      default: "basica",
    }, */

    fechaInicio: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alumno", AlumnoSchema);
