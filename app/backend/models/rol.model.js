import { Schema, model } from "mongoose";

const RolSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false
});

export default model('roles', RolSchema);