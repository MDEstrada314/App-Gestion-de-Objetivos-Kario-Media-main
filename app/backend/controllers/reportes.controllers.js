import Reporte from "../models/reporte.model.js";

export const getReportes = async (req, res, next) => {
  try {
    const data = await Reporte.find({}).populate("usuario", "nombre rol estado");
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const crearReporte = async (req, res, next) => {
  try {
    const newData = new Reporte(req.body);
    await newData.save();
    res.status(200).json(newData);
  } catch (err) {
    next(err);
  }
};
