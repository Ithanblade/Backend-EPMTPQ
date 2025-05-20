import mongoose, { Schema, model } from 'mongoose';

const paradaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    ubicacion_geografica: {
      latitud: {
        type: Number,
        required: true,
      },
      longitud: {
        type: Number,
        required: true,
      },
    },
    direccion_referencia: {
      type: String,
      required: true,
      trim: true,
    },
    accesibilidad: {
      type: Boolean,
      required: true,
    },
    servicios_disponibles: {
      type: [String],
      enum: ["boletería", "baños", "wifi", "vigilancia", "restaurantes"],
      default: [],
    },
    foto_url: {
      type: String,
      required: true,
      trim: true,
    },
    estado_actual: {
      type: Boolean,
      default: true,
      
    },
    rutas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ruta',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model('Parada', paradaSchema);
