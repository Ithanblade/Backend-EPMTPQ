import mongoose, { Schema, model } from 'mongoose';

const corredorSchema = new Schema(
  {
    nombre_corredor: {
      type: String,
      required: true,
      trim: true,
    },
    inaguracion_corredor: {
      type: Date,
      required: true,
    },
    integracion_alimentador: {
      type: String,
      required: true,
    },
    integracion_corredor: {
      type: String,
      required: true,
    },
    longitud_corredor: {
      type: String,
      required: true,
    },
    tipo_servicio: {
      type: String,
      required: true,
    },
    vehiculos: {
      trolebus: {
        type: Number,
        required: true,
      },
      biarticulados: {
        type: Number,
        required: true,
      },
      mb0500: {
        type: Number,
        required: true,
      },
    },
    demanda_diaria: {
      type: String,
      required: true,
    },
    tarifa: {
      normal: {
        type: Number,
        required: true,
      },
      reducida: {
        type: Number,
        required: true,
      },
      preferencial: {
        type: Number,
        required: true,
      },
    },
    historia: {
      type: String,
      required: true,
    },
    paradas: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Parada',
        },
        nombre: {
          type: String,
        }
      }
    ],
    status: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  },
  { collection: 'corredores' }
);

export default model('Corredor', corredorSchema);
