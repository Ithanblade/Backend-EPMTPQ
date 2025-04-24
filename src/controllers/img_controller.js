import Img from '../models/Img.js';

const obtenerImagenes = async (req, res) => {
  try {
    const imagenes = await Img.find().lean();
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener las imágenes', error });
  }
};

export { obtenerImagenes };
