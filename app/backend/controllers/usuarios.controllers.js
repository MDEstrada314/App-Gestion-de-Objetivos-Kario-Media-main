import boom from "@hapi/boom";
import { ObjectId } from "mongodb";
import { db } from "../config/mongoClient.js";
import Usuario from "../models/usuario.model.js";
import imagen_default from "../config/imagen_default.js";
import Multer from "multer";

const usuarios = db.collection("usuarios");

export const getUsuarios = async (req, res, next) => {
  try {
    const data = await usuarios.find({ estado: true }).toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getNoAdmins = async (req, res, next) => {
  try {
    const data = await usuarios
      .aggregate([{ $match: { rol: { $nin: ["ADMIN"] } } }])
      .toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getOneUsuario = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const data = await usuarios.findOne({ _id: oid });
    if (!data)
      throw boom.notFound("Usuario ID no encontrado en la base de datos");
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createUsuario = async (req, res, next) => {
  try {
    const { password, email, ...remaining } = req.body;
    const existeEmail = await usuarios.findOne({ email });
    if (existeEmail)
      throw boom.badRequest("El email ingresado ya está registrado");

    const newUsuario = await new Usuario({
      email,
      password: Usuario.encryptPassword(password),
      ...remaining,
    });

    newUsuario.save();
    res.status(200).json({
      message: "Dato ingresado con éxito",
      response: newUsuario,
    });
  } catch (err) {
    next(err);
  }
};

export const createImage = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const existeUser = await usuarios.findOne({ _id: oid });
    if (!existeUser){
      throw boom.notFound("Usuario ID no encontrado en la base de datos");
    }
    const file = req.file
    if (!file) {
      const data = await Usuario.findOneAndUpdate(
        { _id: req.params.id },
        { imagen: imagen_default },
        { new: true }
      );
      res.status(200).json({
        message:
          "No se mando archivo de imagen por lo tanto se cargo una por defecto",
        data,
      });
    }
    const ImageData = file.buffer;
    const imageDataWithPrefix = `data:image/png;base64,${ImageData.toString(
      "base64"
    )}`;
    const data = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { imagen: imageDataWithPrefix },
      { new: true }
    );
    res.status(200).json({
      message: "Imagen de Usuario actualizada con éxito",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const existeUser = await usuarios.findOne({ _id: oid });
    if (!existeUser)
      throw boom.notFound("Usuario ID no encontrado en la base de datos");

    const { password, ...remaining } = req.body;
    if (password) {
      let newPassword = Usuario.encryptPassword(password);
      remaining["password"] = newPassword;
    }

    const data = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { ...remaining },
      { new: true }
    );

    res.status(200).json({
      message: "Usuario actualizado con éxito",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateImage = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const existeUser = await usuarios.findOne({ _id: oid });
    if (!existeUser){
      throw boom.notFound("Usuario ID no encontrado en la base de datos");
    }
    const file = req.file
    if (!file) {
      const data = await Usuario.findOneAndUpdate(
        { _id: req.params.id },
        { imagen: existeUser.imagen },
        { new: true }
      );
      res.status(200).json({
        message:
          "No se actualizo la imagen",
        data,
      });
    } else {
      const ImageData = file.buffer;
      const imageDataWithPrefix = `data:image/png;base64,${ImageData.toString(
        "base64"
      )}`;
      const data = await Usuario.findOneAndUpdate(
        { _id: req.params.id },
        { imagen: imageDataWithPrefix },
        { new: true }
      );
      res.status(200).json({
        message: "Imagen de Usuario actualizada con éxito",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
}

export const deleteUsuario = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const existeUser = await usuarios.findOne({ _id: oid });
    if (!existeUser)
      throw boom.notFound("Usuario ID no encontrado en la base de datos");

    await usuarios.findOneAndUpdate(
      { _id: oid },
      {
        $set: {
          estado: false,
        },
      }
    );

    res.status(200).json({
      message: "Usuario marcado como inactivo",
    });
  } catch (err) {
    next(err);
  }
};
