import Joi from "joi";

const id = Joi.string().hex().length(24);
const nombre = Joi.string().min(4).max(30);
const estado = Joi.boolean();

export const getRolesSchema = Joi.object({
  id: id.required()
})

export const createRolesSchema = Joi.object({
  id,
  nombre: nombre.required(),
  estado
});

export const updateRolesSchema = Joi.object({
  nombre,
  estado
});