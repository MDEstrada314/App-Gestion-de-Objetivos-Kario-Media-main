import boom from "@hapi/boom";

const isAdminRole = async (req, res, next) => {
  try {
    if (!req.usuario)
      throw boom.forbidden(
        "Se requiere autenticar token para verificar permisos"
      );
    const { rol, nombre } = req.usuario;
    if (!rol.includes('ADMIN'))
      throw boom.unauthorized(`El usuario '${nombre.toUpperCase()}' no es admin`);

    next();
  } catch (err) {
    next(err);
  }
};

export default isAdminRole;
