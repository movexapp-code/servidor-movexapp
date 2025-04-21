const Formulario = require("../models/Formulario");

const obtenerFormulario = async (req, res) => {
  try {
    const formulario = await Formulario.findOne();
    res.json(formulario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo el formulario" });
  }
};

//agregar pregunta a seccion del formualario
const agregarPreguntaFormulario = async (req, res) => {
  const { seccion, pregunta, tipoRespuesta, opciones } = req.body;
  try {
    const formulario = await Formulario.findOne();
    if (!formulario) {
      return res.status(404).json({ mensaje: "Formulario no encontrado" });
    }
    const nuevaPregunta = {
      seccion,
      pregunta,
      tipoRespuesta,
      ...(opciones && { opciones }), // Solo agrega opciones si están definidas
    };
    formulario.preguntas.push(nuevaPregunta);
    await formulario.save();
    res.status(201).json({
      mensaje: "Pregunta agregada exitosamente",
      formulario,
      ok: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al agregar la pregunta", ok: false });
  }
};

const crearFormulario = async (req, res) => {
  try {
    const nuevoFormulario = new Formulario({
      titulo: "Formulario de Evaluación Física",
      preguntas: [
        // SECCIÓN 1: Datos Personales
        {
          seccion: "Datos Personales",
          pregunta: "Nombre y Apellido",
          tipoRespuesta: "texto",
        },
        {
          seccion: "Datos Personales",
          pregunta: "Correo Electrónico",
          tipoRespuesta: "texto",
        },
        {
          seccion: "Datos Personales",
          pregunta: "Teléfono (opcional)",
          tipoRespuesta: "texto",
        },
        {
          seccion: "Datos Personales",
          pregunta: "Edad",
          tipoRespuesta: "numero",
        },
        {
          seccion: "Datos Personales",
          pregunta: "Peso (kg)",
          tipoRespuesta: "numero",
        },
        {
          seccion: "Datos Personales",
          pregunta: "Altura (cm)",
          tipoRespuesta: "numero",
        },

        // SECCIÓN 2: Cuestionario de Salud (PAR-Q)
        {
          seccion: "Cuestionario de Salud",
          pregunta: "¿Te han diagnosticado alguna enfermedad cardíaca?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },
        {
          seccion: "Cuestionario de Salud",
          pregunta: "¿Sufres de presión arterial alta o baja?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },
        {
          seccion: "Cuestionario de Salud",
          pregunta: "¿Tienes dolor en el pecho al hacer ejercicio?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },
        {
          seccion: "Cuestionario de Salud",
          pregunta: "¿Tienes mareos o pérdida de conocimiento?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },
        {
          seccion: "Cuestionario de Salud",
          pregunta:
            "¿Tienes algún problema óseo o articular que pueda empeorar con la actividad física?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },
        {
          seccion: "Cuestionario de Salud",
          pregunta: "¿Estás tomando medicación para alguna condición médica?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },
        {
          seccion: "Cuestionario de Salud",
          pregunta:
            "¿Tienes alguna otra razón para creer que no deberías hacer ejercicio?",
          tipoRespuesta: "opcion",
          opciones: ["Sí", "No"],
        },

        // SECCIÓN 3: Historial de Entrenamiento y Objetivos
        {
          seccion: "Historial de Entrenamiento",
          pregunta: "¿Haces ejercicio actualmente?",
          tipoRespuesta: "opcion",
          opciones: [
            "No",
            "Sí, pero de manera esporádica",
            "Sí, de forma regular (más de 3 veces por semana)",
          ],
        },
        {
          seccion: "Historial de Entrenamiento",
          pregunta: "¿Desde hace cuánto tiempo entrenas?",
          tipoRespuesta: "opcion",
          opciones: ["Menos de 3 meses", "3 a 6 meses", "Más de 6 meses"],
        },
        {
          seccion: "Historial de Entrenamiento",
          pregunta: "¿Cuántos días a la semana puedes entrenar?",
          tipoRespuesta: "opcion",
          opciones: ["3 días (recomendado)", "4 días", "5 días o más"],
        },
        {
          seccion: "Historial de Entrenamiento",
          pregunta:
            "¿Cuánto tiempo puedes dedicarle al entrenamiento cada día?",
          tipoRespuesta: "opcion",
          opciones: ["20-30 minutos", "30-45 minutos", "Más de 45 minutos"],
        },
        {
          seccion: "Historial de Entrenamiento",
          pregunta: "¿Cuál es tu principal objetivo?",
          tipoRespuesta: "opcion",
          opciones: [
            "Ganar fuerza y masa muscular",
            "Perder grasa",
            "Mejorar movilidad y flexibilidad",
            "Mejorar rendimiento deportivo",
          ],
        },

        // SECCIÓN 4: Historial de Lesiones y Condiciones Especiales
        {
          seccion: "Historial de Lesiones",
          pregunta: "¿Has tenido alguna lesión reciente o crónica?",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí (describir)"],
        },
        {
          seccion: "Historial de Lesiones",
          pregunta: "¿Has sido operado de columna o rodillas?",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí"],
        },
        {
          seccion: "Historial de Lesiones",
          pregunta:
            "¿Tienes alguna limitación física que afecte tu entrenamiento?",
          tipoRespuesta: "texto",
        },

        // SECCIÓN 5: Equipamiento Disponible en Casa
        {
          seccion: "Equipamiento",
          pregunta: "¿Qué equipamiento tienes en casa?",
          tipoRespuesta: "opcion",
          opciones: [
            "Paralelas",
            "Barra fija",
            "TRX",
            "Bandas elásticas",
            "Mancuernas",
            "Ninguno",
          ],
        },

        // SECCIÓN 6: Hábitos y Estilo de Vida
        {
          seccion: "Hábitos",
          pregunta: "¿Tu trabajo es físicamente exigente?",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí, de esfuerzo moderado", "Sí, de alto esfuerzo"],
        },
        {
          seccion: "Hábitos",
          pregunta: "¿Cuántas horas pasas sentado al día?",
          tipoRespuesta: "opcion",
          opciones: ["Menos de 4 horas", "4-6 horas", "Más de 6 horas"],
        },
        {
          seccion: "Hábitos",
          pregunta: "¿Cuántas horas duermes por noche?",
          tipoRespuesta: "opcion",
          opciones: ["Menos de 5 horas", "5-7 horas", "Más de 7 horas"],
        },
        {
          seccion: "Hábitos",
          pregunta: "¿Cómo describirías tu alimentación?",
          tipoRespuesta: "opcion",
          opciones: [
            "Balanceada y saludable",
            "Regular, como de todo",
            "Desordenada, como lo que puedo",
          ],
        },
        {
          seccion: "Hábitos",
          pregunta: "¿Consumes alcohol?",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí, ocasionalmente", "Sí, frecuentemente"],
        },
        {
          seccion: "Hábitos",
          pregunta: "¿Fumas?",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí"],
        },
        {
          seccion: "Hábitos",
          pregunta: "¿Qué odias o no te gusta del ejercicio?",
          tipoRespuesta: "texto",
        },

        // SECCIÓN 7: Test de Resistencia Inicial
        {
          seccion: "Test de Resistencia",
          pregunta: "Dominadas: ¿Cuántas puedes hacer en una sola serie?",
          tipoRespuesta: "opcion",
          opciones: ["0", "1-3", "4-6", "Más de 6"],
        },
        {
          seccion: "Test de Resistencia",
          pregunta:
            "Sentadilla isométrica: ¿Cuánto tiempo aguantas en posición de 90° contra la pared?",
          tipoRespuesta: "opcion",
          opciones: [
            "Menos de 30 segundos",
            "30-60 segundos",
            "Más de 60 segundos",
          ],
        },
        {
          seccion: "Test de Resistencia",
          pregunta: "Plancha abdominal: ¿Cuánto tiempo puedes mantenerla?",
          tipoRespuesta: "opcion",
          opciones: [
            "Menos de 30 segundos",
            "30-60 segundos",
            "Más de 60 segundos",
          ],
        },
        {
          seccion: "Test de Resistencia",
          pregunta:
            "Video instructivo: Grábate haciendo sentadilla y estocada descalzo (instrucciones de grabación)",
          tipoRespuesta: "texto",
        },

        // SECCIÓN 8: Composición Corporal y Estado Físico
        {
          seccion: "Composición Corporal",
          pregunta: "¿Cómo describirías tu composición corporal actual?",
          tipoRespuesta: "opcion",
          opciones: [
            "Delgado/a con poca masa muscular",
            "Peso normal, pero quiero más músculo",
            "Sobrepeso leve",
            "Obesidad",
          ],
        },
        {
          seccion: "Composición Corporal",
          pregunta: "¿Has medido tu porcentaje de grasa corporal?",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí, aproximadamente __%"],
        },
        {
          seccion: "Composición Corporal",
          pregunta: "¿Dónde acumulas más grasa corporal?",
          tipoRespuesta: "opcion",
          opciones: [
            "Zona abdominal",
            "Piernas y glúteos",
            "Brazos y espalda",
            "Distribuida en todo el cuerpo",
          ],
        },
        {
          seccion: "Composición Corporal",
          pregunta: "¿Tienes dificultad para ganar músculo? (Somatotipo)",
          tipoRespuesta: "opcion",
          opciones: [
            "Sí, me cuesta ganar peso (ectomorfo)",
            "No, subo y bajo de peso fácilmente (mesomorfo)",
            "Sí, tiendo a acumular grasa fácilmente (endomorfo)",
          ],
        },
        {
          seccion: "Composición Corporal",
          pregunta: "¿Has hecho dietas en los últimos 6 meses?",
          tipoRespuesta: "opcion",
          opciones: [
            "No",
            "Sí, pero sin mucha estructura",
            "Sí, con asesoramiento nutricional",
          ],
        },
        {
          seccion: "Composición Corporal",
          pregunta: "¿Cómo describirías tu nivel de energía en el día a día?",
          tipoRespuesta: "opcion",
          opciones: [
            "Siempre con energía",
            "Normal, algunos días me siento cansado",
            "Me siento agotado frecuentemente",
          ],
        },
        {
          seccion: "Composición Corporal",
          pregunta:
            "¿Tomas suplementos? (proteína, creatina, multivitamínicos, etc.)",
          tipoRespuesta: "opcion",
          opciones: ["No", "Sí, pero de forma esporádica", "Sí, regularmente"],
        },
      ],
    });

    await nuevoFormulario.save();
    res.status(201).json({
      message: "Formulario creado exitosamente",
      formulario: nuevoFormulario,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerFormulario,
  crearFormulario,
  agregarPreguntaFormulario,
};
