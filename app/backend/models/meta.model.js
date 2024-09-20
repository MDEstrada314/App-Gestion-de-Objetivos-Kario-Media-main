import { Schema, model } from "mongoose";

const MetaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    dificultad: {
      type: String,
      required: true,
      enum: ["Alta", "Baja", "Media"],
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFinal: {
      type: Date,
      required: true,
    },
    metodologia: {
      type: String,
      required: true,
    },
    area: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "areas",
    },
    tareas: {
      type: [
        {
          titulo: {
            type: String,
          },
          instrucciones: {
            type: String,
          },
          tiempoHoras: {
            type: Number,
          },
          check: {
            type: Boolean,
            default: false
          },
          integrantes: [{
            type: Schema.Types.ObjectId,
            ref: 'usuarios'
          }]
        },
      ],
      default: [
        {
          titulo: "Un nuevo proyecto",
          instrucciones: "Hagamos que valga la pena",
          tiempoHoras: 1,
          check: false,
          integrantes: ['6523e96a4490418e2549a187']
        }
      ]
    },
    cumplimiento: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default model("metas", MetaSchema);
