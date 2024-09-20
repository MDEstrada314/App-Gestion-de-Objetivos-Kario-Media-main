import Joi from "joi";

const id = Joi.string().hex().length(24);
const nombre = Joi.string().min(10).max(30);
const password = Joi.string().alphanum();
const email = Joi.string().email();
const imagen = Joi.string().domain();
const rol = Joi.array().items(Joi.string().default('USER'));
const estado = Joi.boolean().default(true)

export const getUsuarioSchema = Joi.object({
  id: id.required()
})

export const createUsuarioSchema = Joi.object({
  id,
  nombre: nombre.required(),
  email: email.required(),
  password: password.required(),
  rol,
  estado
});

export const añadirPhoto = Joi.object({
  imagen,
});

export const updateUsuarioSchema = Joi.object({
  nombre,
  email,
  password,
  rol,
  estado
});

export const updatePhoto = Joi.object({
  imagen,
});

export const loginSchema = Joi.object({
  email: email.required(),
  password: password.required()
})