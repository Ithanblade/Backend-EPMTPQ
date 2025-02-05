import Parada from '../models/Parada.js';
import mongoose from 'mongoose';
import Ruta from '../models/Ruta.js';
import Corredor from '../models/Corredor.js';

// Obtener todas las paradas
const listarParadas = async (req, res) => {
  try {
    const paradas = await Parada.find();
    res.status(200).json(paradas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las paradas" });
  }
};

// Obtener el detalle de una parada
const detalleParada = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `La parada con ID ${id} no existe.` });
  }

  try {
    const parada = await Parada.findById(id).populate('rutas', 'nombre')
      .populate('corredor', 'nombre');
    if (!parada) {
      return res.status(404).json({ msg: `La parada con ID ${id} no fue encontrada.` });
    }
    res.status(200).json(parada);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el detalle de la parada", error: error.message });
  }
};

// Método para crear el tratamiento
const crearParada = async (req, res) => {
  const { corredor, nombre, ...paradaData } = req.body;

  if (Object.values(req.body).includes('')) return res.status(400).json({ msg: "Por favor, complete todos los campos." });

  // Validar si el ID del corredor es válido
  if (!mongoose.Types.ObjectId.isValid(corredor)) {
    return res.status(400).json({ msg: `Lo sentimos, debe ser un ID válido.` });
  }

  try {
    // Verificar si ya existe una parada con el mismo nombre
    const paradaExistente = await Parada.findOne({ nombre });
    if (paradaExistente) {
      return res.status(400).json({ msg: `La parada ${nombre} ya existe.` });
    }

    // Buscar el corredor en la base de datos
    const corredorExistente = await Corredor.findById(corredor);
    if (!corredorExistente) {
      return res.status(404).json({ msg: `No se encontró el corredor con ID ${corredor}.` });
    }

    // Crear la nueva parada con el ID y nombre del corredor
    const nuevaParada = await Parada.create({
      ...paradaData,
      nombre,
      corredor
    });


    // Agregar la nueva parada al array de paradas del corredor
    corredorExistente.paradas.push({
      _id: nuevaParada._id,
      nombre: nuevaParada.nombre
    });

    // Guardar los cambios en el corredor
    await corredorExistente.save();

    res.status(201).json({ msg: `Registro exitoso de la parada ${nuevaParada.nombre}`, nuevaParada });

  } catch (error) {
    res.status(500).json({ msg: "Error al crear la parada", error: error.message });
  }
};


const actualizarParada = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, ubicacion, corredores } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `La parada con ID ${id} no existe.` });
  }

  try {
    const paradaActual = await Parada.findById(id);
    if (!paradaActual) {
      return res.status(404).json({ msg: `La parada con ID ${id} no fue encontrada.` });
    }

    if (nombre !== paradaActual.nombre) {
      const paradaExistente = await Parada.findOne({ nombre });
      if (paradaExistente) {
        return res.status(400).json({ msg: `La parada "${nombre}" ya existe. Use otro nombre.` });
      }
    }

    const paradaActualizada = await Parada.findByIdAndUpdate(
      id,
      { nombre, tipo, ubicacion, corredores },
      { new: true }
    );

    res.status(200).json({ msg: "Parada actualizada exitosamente.", paradaActualizada });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la parada", error: error.message });
  }
};



// Habilitar una parada
const habilitarParada = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `La parada con ID ${id} no existe.` });
  }

  try {
    const parada = await Parada.findById(id);
    if (!parada) {
      return res.status(404).json({ msg: `La parada con ID ${id} no fue encontrada.` });
    }

    const paradaHabilitada = await Parada.findByIdAndUpdate(id, { status: true }, { new: true });
    res.status(200).json({ msg: "Parada habilitada correctamente.", paradaHabilitada });

  } catch (error) {
    res.status(500).json({ msg: "Error al habilitar la parada", error: error.message });
  }
};

// Deshabilitar una parada
const deshabilitarParada = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `La parada con ID ${id} no existe.` });
  }

  try {
    const parada = await Parada.findById(id);
    if (!parada) {
      return res.status(404).json({ msg: `La parada con ID ${id} no fue encontrada.` });
    }

    const paradaDeshabilitada = await Parada.findByIdAndUpdate(id, { status: false }, { new: true });
    res.status(200).json({ msg: "Parada deshabilitada correctamente.", paradaDeshabilitada });

  } catch (error) {
    res.status(500).json({ msg: "Error al deshabilitar la parada", error: error.message });
  }
};

export {
  listarParadas,
  detalleParada,
  crearParada,
  actualizarParada,
  habilitarParada,
  deshabilitarParada
};
