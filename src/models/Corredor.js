import mongoose, { Schema, model } from 'mongoose';

const corredorSchema = new Schema(
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
    color_identificativo: {
      type: String,
      required: true,
      trim: true,
    },
    fecha_inauguracion: {
      type: Date,
      required: true,
    },
    longitud_recorrido: {
      type: String,
      required: true,
    },
    horario_operacion: {
      type: String,
      required: true,
    },
    frecuencia_servicio: {
      type: String,
      required: true,
    },
    rango_tarifas: {
      type: String,
      required: true,
    },
    lugares_interes: {
      type: [String],
      required: true,
    },
    tipo_vehiculos_utilizados: {
      type: [String],
      required: true,
    },
    foto_url: {
      type: String,
      required: true,
    },
    estado_actual: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'corredores',
  }
);


export default model('Corredor', corredorSchema);
