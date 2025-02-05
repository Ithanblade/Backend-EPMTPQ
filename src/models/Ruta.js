import mongoose, { Schema, model } from 'mongoose';

const rutaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    recorrido: {
        type: String,
        required: true,
        trim: true,
    },
    horario: {
        type: Object,
        required: true,
        trim: true,
    },
    sentido: {
        type: String,
        required: true,
        trim: true,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    paradas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Parada', 
            required: true,
        },
    ],
    corredor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Corredor', 
        required: true,
    },
}, {
    timestamps: true,   
});

export default model('Ruta', rutaSchema);
