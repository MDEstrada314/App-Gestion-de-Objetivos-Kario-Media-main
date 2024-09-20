import Joi from "joi";

const password = Joi.string().alphanum();
const email = Joi.string().email();

const authSchema = Joi.object({
  email: email.required(),
  password: password.required()
});

export default authSchema;