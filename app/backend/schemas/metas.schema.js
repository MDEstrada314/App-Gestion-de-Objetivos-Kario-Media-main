import Joi from "joi";

const id = Joi.string().hex().length(24);
const nombre = Joi.string().min(2).max(30);
const descripcion = Joi.string().min(2);
const dificultad = Joi.string().valid("Alta", "Baja", "Media");
const fechaInicio = Joi.date().greater("1-1-2023").less(Joi.ref("fechaFinal"));
const fechaFinal = Joi.date().greater("1-1-2023");
const metodologia = Joi.string();
const cumplimiento = Joi.number().min(0).max(100).default(0);
const area = Joi.string().hex().length(24);
const tareas = Joi.array().items({
  titulo: Joi.string(),
  instrucciones: Joi.string(),
  tiempoHoras: Joi.number(),
  integrantes: Joi.array().items(Joi.string().hex().length(24)),
  check: Joi.boolean()
});

export const getMetasSchema = Joi.object({
  id: id.required(),
});

export const createMetasSchema = Joi.object({
  id,
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  dificultad: dificultad.required(),
  fechaInicio: fechaInicio.required(),
  fechaFinal: fechaFinal.required(),
  metodologia: metodologia.required(),
  area: area.required(),
  cumplimiento,
});

export const updateMetasSchema = Joi.object({
  nombre,
  descripcion,
  dificultad,
  fechaInicio,
  fechaFinal,
  metodologia,
  area,
  cumplimiento,
});

export const añadirTareas = Joi.object({
  tareas,
});
