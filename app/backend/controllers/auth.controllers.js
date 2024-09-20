import boom from "@hapi/boom";
import generateJWT from "../helpers/generateJWT.js";
import Usuario from "../models/usuario.model.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      throw boom.badRequest("El email ingresado no está registrado");

    const coincidePwd = await Usuario.comparePassword(
      password,
      usuario.password
    );
    if (!coincidePwd) throw boom.badRequest("Contraseña incorrecta");

    if (usuario.estado == false)
      throw boom.unauthorized("Este usuario ya no se encuentra activo");

    const token = await generateJWT(usuario._id);
    res.json({ token, usuario });
  } catch (err) {
    next(err);
  }
};

export default login;