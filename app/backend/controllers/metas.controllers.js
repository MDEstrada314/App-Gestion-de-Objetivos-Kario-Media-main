import boom from "@hapi/boom";
import { ObjectId } from "mongodb";
import { db } from "../config/mongoClient.js";
import Meta from "../models/meta.model.js";
import Usuario from "../models/usuario.model.js";
import Area from "../models/area.model.js";
import date from "../middlewares/dateValidator.js";
const metas = db.collection("metas");

export const getMetas = async (req, res, next) => {
  try {
    const data = await metas
      .aggregate([
        { $match: { _id: { $exists: true } } },
        {
          $lookup: {
            from: "areas", // collection
            localField: "area",
            foreignField: "_id",
            as: "area",
          },
        },
      ])
      .toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};


export const deleteMeta = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const result = await metas.deleteOne({ _id: oid });
    console.log(result)
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Meta eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'No se encontró la meta para eliminar' });
    }
  } catch (err) {
    next(err);
  }
};






export const getOneMeta = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const [data] = await metas
      .aggregate([
        {
          $match: {
            _id: oid,
          },
        },
        {
          $unwind: {
            path: "$tareas",
          },
        },
        {
          $lookup: {
            from: "usuarios",
            foreignField: "_id",
            localField: "tareas.integrantes",
            as: "tareas.integranteData",
          },
        },
        {
          $unwind: {
            path: "$tareas.integranteData",
          },
        },
        {
          $group: {
            _id: "$_id",
            nombre: { $first: "$nombre" },
            descripcion: { $first: "$descripcion" },
            dificultad: { $first: "$dificultad" },
            fechaInicio: { $first: "$fechaInicio" },
            fechaFinal: { $first: "$fechaFinal" },
            metodologia: { $first: "$metodologia" },
            cumplimiento: { $first: "$cumplimiento" },
            tareas: { $push: "$tareas" },
            area: { $first: "$area" },
          },
        },
      ])
      .toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createMeta = async (req, res, next) => {
  try {
    const { area, fechaInicio, fechaFinal, ...data } = req.body;
    const [existeArea, Inicio, Fin] = await Promise.all([
      Area.find({ _id: area }),
      date(fechaInicio),
      date(fechaFinal),
    ]);
    if (!existeArea)
      throw boom.notFound("Área ID no encontrado en la base de datos");
    const body = {
      area,
      fechaInicio: Inicio,
      fechaFinal: Fin,
      ...data,
    };
    const newData = new Meta(body);
    await newData.save();
    res.status(200).json(newData);
  } catch (err) {
    next(err);
  }
};

export const editarMeta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existeMeta = await Meta.findOne({ _id: id });
    if (!existeMeta)
      throw boom.notFound("Meta ID no encontrado en la base de datos");
    const { area, fechaInicio, fechaFinal, ...data } = req.body;
    const [existeArea, Inicio, Fin] = await Promise.all([
      Area.find({ _id: area }),
      date(fechaInicio),
      date(fechaFinal),
    ]);
    if (!existeArea)
      throw boom.notFound("Área ID no encontrado en la base de datos");
    const body = {
      area,
      fechaInicio: Inicio,
      fechaFinal: Fin,
      ...data,
    };
    const newData = await Meta.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    res.status(200).json(newData);
  } catch (err) {
    next(err);
  }
};

export const añadirTareas = async (req, res, next) => {
  try {
    const oid = req.params.id;
    const meta = await Meta.findById({ _id: oid });
    const { tareas } = req.body;
    const promises = [];
    /* validar si existen los id enviados en el campo integrantes */
    tareas.forEach((tarea) => {
      tarea.integrantes.forEach(async (userId) => {
        const user = await Usuario.findById({ _id: userId });
        try {
          if (!user) {
            throw boom.notFound(
              `Integrante con ID ${userId} no existe en la base de datos. Tarea ${tarea}`
            );
          }
        } catch (err) {
          next(err);
        }
        //Falta mandar la notificacion
        try {
          user.notificacion.push({
            mensaje: `Se le ha asignado la siguiente tarea: "${tarea.titulo}" de la meta "${meta.nombre}" .`,
            estado: true,
          });
        } catch (err) {
          next(err);
        }
        promises.push(user.save());
      });
    });
    await Promise.all(promises);
    const newData = await Meta.findOneAndUpdate(
      { _id: req.params.id },
      { tareas },
      { new: true }
    );
    res.status(200).json(newData);
  } catch (err) {
    next(err);
  }
};

export const getPorcentajeCheck = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const [data] = await metas
      .aggregate([
        { $match: { _id: oid } },
        {
          $project: {
            _id: 1,
            nombre: 1,
            tareasCheckTrue: {
              $size: {
                $filter: {
                  input: "$tareas",
                  as: "tarea",
                  cond: { $eq: ["$$tarea.check", true] },
                },
              },
            },
            tareasCheckFalse: {
              $size: {
                $filter: {
                  input: "$tareas",
                  as: "tarea",
                  cond: { $eq: ["$$tarea.check", false] },
                },
              },
            },
          },
        },
      ])
      .toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
