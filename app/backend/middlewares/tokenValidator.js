import jwt from "jsonwebtoken";
import boom from "@hapi/boom";
import Usuario from "../models/usuario.model.js";
import { response, request } from "express";

const verifyToken = async (req = request, res = response, next) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) throw boom.forbidden("Falta token en la petición");

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await Usuario.findOne({ _id: decoded.id });
    console.log(user);
    if (!user) throw boom.illegal("Token adulterado");

    req.usuario = user;
    console.log(`Usuario token`, req.usuario.nombre);
    next();
  } catch (err) {
    next(err);
  } 
};

export default verifyToken;
