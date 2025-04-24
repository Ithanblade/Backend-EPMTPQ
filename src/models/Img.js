import mongoose ,{ Schema, model } from 'mongoose';

const imgSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
    }
});

export default model('Img', imgSchema);
    