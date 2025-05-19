import mongoose, { Schema, model } from 'mongoose';

const rutaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  corredor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corredor',
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  sentido: {
    type: String,
    required: true,
    trim: true,
  },
  frecuencia_paso: {
    type: String,
    required: true,
    trim: true,
  },
  horario_operacion: {
    type: String,
    required: true,
    trim: true,
  },
  color_ruta: {
    type: String,
    required: true,
    trim: true,
  },
  estado_actual: {
    type: Boolean,
    required: true,
  }
}, {
  timestamps: true,
  collection: 'rutas',
});

export default model('Ruta', rutaSchema);
