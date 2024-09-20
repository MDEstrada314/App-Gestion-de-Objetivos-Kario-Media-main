import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  estado: {
    type: Boolean,
    required: true,
    default: true,
  },
  rol: {
    type: Array,
    default: ["USER"],
    required: true,
  },
  imagen: {
    type: String,
  },
  notificacion:[
    {
      mensaje: {
        type: String,
        required: false,
      },
      estado:{
        type: Boolean,
        required: false
      }
    }
  ]
}, {
  versionKey: false
});

UsuarioSchema.statics.encryptPassword = (password) => {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
};

UsuarioSchema.statics.comparePassword = (password, receivedPassword) => {
  return bcryptjs.compareSync(password, receivedPassword);
};

export default model("usuarios", UsuarioSchema);
