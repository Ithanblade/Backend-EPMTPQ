import Parada from '../models/Parada.js';
import mongoose from 'mongoose';
import Ruta from '../models/Ruta.js';
import Corredor from '../models/Corredor.js';

const listarParadas = async (req, res) => {
  try {
    const paradas = await Parada.find();
    res.status(200).json(paradas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las paradas" });
  }
};

const detalleParada = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `La parada con ID ${id} no existe.` });
  }

  try {
    const parada = await Parada.findById(id).populate('rutas', 'nombre')
    if (!parada) {
      return res.status(404).json({ msg: `La parada con ID ${id} no fue encontrada.` });
    }
    res.status(200).json(parada);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el detalle de la parada", error: error.message });
  }
};

const crearParada = async (req, res) => {
  const { nombre, descripcion, ubicacion_geografica, direccion_referencia, accesibilidad, servicios_disponibles, foto_url, rutas, } = req.body;

  if (Object.values(req.body).includes('') || !ubicacion_geografica?.latitud || !ubicacion_geografica?.longitud) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  if (typeof accesibilidad !== 'boolean') {
    return res.status(400).json({ msg: "El campo 'accesibilidad' debe ser true o false." });
  }

  if (nombre.length < 3 || nombre.length > 50) {
    return res.status(400).json({ msg: "El nombre debe tener entre 3 y 50 caracteres." });
  }

  if (descripcion.length < 5 || descripcion.length > 200) {
    return res.status(400).json({ msg: "La descripción debe tener entre 5 y 200 caracteres." });
  }

  if (direccion_referencia.length < 5 || direccion_referencia.length > 100) {
    return res.status(400).json({ msg: "La dirección y referencia debe tener entre 5 y 100 caracteres." });
  }

  if (!Array.isArray(servicios_disponibles)) {
    return res.status(400).json({ msg: "El campo 'servicios_disponibles' debe ser un arreglo." });
  }

  const serviciosValidos = ["boletería", "baños", "wifi", "vigilancia", "restaurantes"];
  const serviciosInvalidos = servicios_disponibles.filter(s => !serviciosValidos.includes(s));

  if (serviciosInvalidos.length > 0) {
    return res.status(400).json({ msg: `Servicios no válidos: ${serviciosInvalidos.join(", ")}` });
  }

  if (!Array.isArray(rutas) || rutas.length === 0) {
    return res.status(400).json({ msg: "Debes proporcionar al menos una ruta." });
  }

  for (const idRuta of rutas) {
    if (!mongoose.Types.ObjectId.isValid(idRuta)) {
      return res.status(400).json({ msg: `ID de ruta inválido: ${idRuta}` });
    }

    const existeRuta = await Ruta.findById(idRuta);
    if (!existeRuta) {
      return res.status(404).json({ msg: `No se encontró la ruta con ID ${idRuta}.` });
    }
  }

  try {
    const nuevaParada = new Parada({
      nombre,
      descripcion,
      ubicacion_geografica,
      direccion_referencia,
      accesibilidad,
      servicios_disponibles,
      foto_url,
      estado_actual: true,
      rutas
    });
    const paradaExistente = await Parada.findOne({ nombre });
    if (paradaExistente) {
      return res.status(400).json({ msg: `La parada "${nombre}" ya existe. Use otro nombre.` });
    }
    await nuevaParada.save();

    res.status(201).json({ msg: `Parada registrada exitosamente.`, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la parada.", error: error.message });
  }
};


const actualizarParada = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, ubicacion_geografica, direccion_referencia, accesibilidad, servicios_disponibles, foto_url, rutas, } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de parada inválido." });
  }

  if (
    Object.values(req.body).includes('') || !ubicacion_geografica?.latitud || !ubicacion_geografica?.longitud) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  if (typeof accesibilidad !== 'boolean') {
    return res.status(400).json({ msg: "El campo 'accesibilidad' debe ser true o false." });
  }

  if (nombre.length < 3 || nombre.length > 50) {
    return res.status(400).json({ msg: "El nombre debe tener entre 3 y 50 caracteres." });
  }

  if (descripcion.length < 5 || descripcion.length > 200) {
    return res.status(400).json({ msg: "La descripción debe tener entre 5 y 200 caracteres." });
  }

  if (direccion_referencia.length < 5 || direccion_referencia.length > 100) {
    return res.status(400).json({ msg: "La dirección y referencia debe tener entre 5 y 100 caracteres." });
  }

  if (!Array.isArray(servicios_disponibles)) {
    return res.status(400).json({ msg: "El campo 'servicios_disponibles' debe ser un arreglo." });
  }

  const serviciosValidos = ["boletería", "baños", "wifi", "vigilancia", "restaurantes"];
  const serviciosInvalidos = servicios_disponibles.filter(s => !serviciosValidos.includes(s));

  if (serviciosInvalidos.length > 0) {
    return res.status(400).json({ msg: `Servicios no válidos: ${serviciosInvalidos.join(", ")}` });
  }

  if (!Array.isArray(rutas) || rutas.length === 0) {
    return res.status(400).json({ msg: "Debes proporcionar al menos una ruta." });
  }

  for (const idRuta of rutas) {
    if (!mongoose.Types.ObjectId.isValid(idRuta)) {
      return res.status(400).json({ msg: `ID de ruta inválido: ${idRuta}` });
    }

    const existeRuta = await Ruta.findById(idRuta);
    if (!existeRuta) {
      return res.status(404).json({ msg: `No se encontró la ruta con ID ${idRuta}.` });
    }
  }

  const paradaExistente = await Parada.findOne({ nombre });
  if (paradaExistente && paradaExistente._id.toString() !== id) {
    return res.status(400).json({ msg: `La parada "${nombre}" ya existe. Use otro nombre.` });
  }

  try {
    const paradaActualizada = await Parada.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        ubicacion_geografica,
        direccion_referencia,
        accesibilidad,
        servicios_disponibles,
        foto_url,
        rutas,
      },
      { new: true, runValidators: true }
    );

    if (!paradaActualizada) {
      return res.status(404).json({ msg: `No se encontró ninguna parada con el ID ${id}.` });
    }

    res.status(200).json({ msg: `Parada actualizada exitosamente.`,});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la parada.", error: error.message });
  }
};

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

    if (parada.estado_actual) {
      return res.status(400).json({ msg: `La parada con ID ${id} ya está habilitada.` });
    }

    const paradaHabilitada = await Parada.findByIdAndUpdate(id, { estado_actual: true }, { new: true });
    res.status(200).json({ msg: "Parada habilitada correctamente." });

  } catch (error) {
    res.status(500).json({ msg: "Error al habilitar la parada", error: error.message });
  }
};

const deshabilitarParada = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `La parada con ID ${id} no existe.` });
  }
    const parada = await Parada.findById(id);
    if (!parada) {
      return res.status(404).json({ msg: `La parada con ID ${id} no fue encontrada.` });
    }

    if (!parada.estado_actual) {
      return res.status(400).json({ msg: `La parada con ID ${id} ya está deshabilitada.` });
    }
  try {

    const paradaDeshabilitada = await Parada.findByIdAndUpdate(id, { estado_actual: false }, { new: true });
    res.status(200).json({ msg: "Parada deshabilitada correctamente." });

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
