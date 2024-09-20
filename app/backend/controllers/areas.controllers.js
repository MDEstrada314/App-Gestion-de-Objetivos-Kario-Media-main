import { ObjectId } from "mongodb";
import { db } from "../config/mongoClient.js";
import Area from "../models/area.model.js";

const areas = db.collection("areas");

export const getAreas = async (req, res) => {
  try {
    const data = await areas.find({estado: true}).toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getOneArea = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const data = await areas.find({ _id: oid }).toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createArea = async (req, res, next) => {
  try {
    const newData = new Area(req.body);
    await newData.save();
    res.status(200).json(newData);
  } catch (err) {
    next(err);
  }
};

export const updateArea = async (req, res, next) => {
  try {
    const modified = await Area.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(modified);
  } catch (err) {
    next(err);
  }
};

export const deleteArea = async (req, res, next) => {
  try {
    const modified = await Area.findOneAndUpdate(
      { _id: req.params.id },
      { estado: false },
      { new: true }
    );
    res.status(200).json(modified);
  } catch (err) {
    next(err);
  }
};
