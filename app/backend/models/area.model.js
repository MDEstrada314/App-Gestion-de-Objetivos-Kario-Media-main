import { Schema, model } from "mongoose";

const AreaSchema = new Schema({
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

export default model('areas', AreaSchema);