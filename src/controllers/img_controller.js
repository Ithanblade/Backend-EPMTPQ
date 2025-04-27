import Img from '../models/Img.js';

const  ingresarImagen = async (req, res) => {
  const { nombre, url } = req.body;

  if (!nombre || !url) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    const nuevaImagen = new Img({ nombre, url });
    await nuevaImagen.save();
    res.status(201).json(nuevaImagen);
  } catch (error) {
    res.status(500).json({ msg: 'Error al guardar la imagen', error });
  }
}

const obtenerImagenes = async (req, res) => {
  try {
    const imagenes = await Img.find().lean();
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener las imágenes', error });
  }
};

export { obtenerImagenes };
