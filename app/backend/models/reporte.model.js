import { Schema, model } from "mongoose";

const ReporteSchema = new Schema(
  {
    asunto: {
      type: String,
      required: true,
      trim: true,
    },
    especifico: {
      type: String,
      required: true,
      trim: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "usuarios",
    },
  },
  {
    versionKey: false,
  }
);

export default model("reportes", ReporteSchema);
