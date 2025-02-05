import mongoose, { Schema, model } from 'mongoose';

const paradaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true, 
    },
    rutas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ruta', 
      },
    ],
    corredor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Corredor',
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Parada', paradaSchema);