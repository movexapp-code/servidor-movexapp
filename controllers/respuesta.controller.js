const Respuesta = require("../models/Respuesta");
const Usuario = require("../models/User");
const Formulario = require("../models/Formulario");
const mongoose = require("mongoose");

const guardarRespuestas = async (req, res, next) => {
  try {
    const { respuestas } = req.body;
    const { usuarioId } = req.params;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const formId = await Formulario.findOne();
    // Convertir IDs en ObjectId
    const respuestaDoc = await Respuesta.findOne({
      usuario: usuarioId,
      formulario: formId,
    });

    if (respuestaDoc) {
      // Actualiza respuestas existentes o agrega nuevas
      respuestas.forEach((nuevaRespuesta) => {
        const preguntaId = mongoose.Types.ObjectId(nuevaRespuesta.preguntaId);
        const index = respuestaDoc.respuestas.findIndex(
          (r) => r.preguntaId.toString() === preguntaId.toString()
        );

        usuario.respuestas.push(respuestaDoc._id);

        if (index !== -1) {
          // Actualiza la respuesta existente
          respuestaDoc.respuestas[index].respuesta = nuevaRespuesta.respuesta;
        } else {
          // Agrega nueva respuesta
          respuestaDoc.respuestas.push({
            preguntaId,
            respuesta: nuevaRespuesta.respuesta,
          });
        }
      });

      await usuario.save();

      await respuestaDoc.save();
      return res.status(200).json({
        message: "Respuestas actualizadas exitosamente",
        respuesta: respuestaDoc,
        ok: true,
      });
    } else {
      // Crear un nuevo documento de respuestas
      const nuevaRespuestaDoc = new Respuesta({
        usuario: usuarioId,
        formulario: formId,
        respuestas: respuestas.map((r) => ({
          preguntaId: mongoose.Types.ObjectId(r.preguntaId),
          respuesta: r.respuesta,
        })),
      });

      //console.log(nuevaRespuestaDoc);

      await nuevaRespuestaDoc.save();
      return res.status(201).json({
        message: "Respuestas guardadas exitosamente",
        respuesta: nuevaRespuestaDoc,
        ok: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Función para obtener respuestas por usuario y formulario
const obtenerRespuestasUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscamos el formulario global (suponemos que existe uno)
    const formulario = await Formulario.findOne();

    if (!formulario) {
      return res
        .status(404)
        .json({ message: "No se encontró el formulario global." });
    }

    // Buscamos las respuestas del usuario para ese formulario
    const respuestaDoc = await Respuesta.findOne({
      usuario: id,
      formulario: formulario._id,
    });

    console.log(respuestaDoc);

    //console.log(formulario);

    // Creamos un mapeo: preguntaId -> respuesta (si existe)
    let respuestaMap = {};
    if (respuestaDoc && respuestaDoc.respuestas) {
      respuestaDoc.respuestas.forEach((item) => {
        respuestaMap[item.preguntaId.toString()] = item.respuesta;
      });
    }

    // Iteramos sobre todas las preguntas y adjuntamos la respuesta si está disponible
    const preguntasConRespuestas = formulario.preguntas.map((q) => {
      const respuesta = respuestaMap[q._id.toString()] || null;
      return {
        _id: q._id,
        seccion: q.seccion,
        pregunta: q.pregunta,
        tipoRespuesta: q.tipoRespuesta,
        opciones: q.opciones,
        respuesta,
      };
    });

    res.status(200).json(preguntasConRespuestas);
  } catch (error) {
    next(error);
  }
};

module.exports = { guardarRespuestas, obtenerRespuestasUsuario };
