import boom from "@hapi/boom";

export const validateSchema = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    error ? next(boom.badRequest(error)) : next();
  };
};
