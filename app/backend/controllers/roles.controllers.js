import { ObjectId } from "mongodb";
import { db } from "../config/mongoClient.js";
import Role from "../models/rol.model.js";

const roles = db.collection("roles");

export const getRoles = async (req, res) => {
  try {
    const data = await roles.find({estado: true}).toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getOneRole = async (req, res, next) => {
  try {
    const oid = new ObjectId(req.params.id);
    const data = await roles.find({ _id: oid }).toArray();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const newData = new Role(req.body);
    await newData.save();
    res.status(200).json(newData);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const modified = await Role.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(modified);
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const modified = await Role.findOneAndUpdate(
      { _id: req.params.id },
      { estado: false },
      { new: true }
    );
    res.status(200).json(modified);
  } catch (err) {
    next(err);
  }
};
