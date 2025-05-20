import Corredor from "../models/Corredor.js";
import mongoose from "mongoose";

const listarCorredores = async (req, res) => {
  try {
    const corredores = await Corredor.find();
    res.status(200).json(corredores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los corredores" });
  }
};

const detalleCorredor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `El corredor con ID ${id} no existe.` });
  }

  try {
    const corredor = await Corredor.findById(id);
    if (!corredor) {
      return res.status(404).json({ message: "Corredor no encontrado" });
    }
    res.status(200).json(corredor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los detalles del corredor" });
  }
};


const crearCorredor = async (req, res) => {
  const { nombre,descripcion,color_identificativo,fecha_inauguracion,longitud_recorrido,horario_operacion,frecuencia_servicio,rango_tarifas,lugares_interes,tipo_vehiculos_utilizados,foto_url} = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

  if (!Array.isArray(lugares_interes) || lugares_interes.length === 0) {
    return res.status(400).json({ msg: 'Debe registrar al menos un lugar de interés.' });
  }

  if (!Array.isArray(tipo_vehiculos_utilizados) || tipo_vehiculos_utilizados.length === 0) {
    return res.status(400).json({ msg: 'Debe registrar al menos un tipo de vehículo utilizado.' });
  }

  if (descripcion.length < 5 || descripcion.length > 100) {
    return res.status(400).json({ msg: 'La descripción debe tener entre 5 y 100 caracteres.' });
  }

  if (color_identificativo.length < 3 || color_identificativo.length > 50) {
    return res.status(400).json({ msg: 'El color identificativo debe tener entre 3 y 50 caracteres.' });
  }

  if (longitud_recorrido.length < 5 || longitud_recorrido.length > 25) {
    return res.status(400).json({ msg: 'La longitud del recorrido debe tener entre 5 y 25 caracteres.' });
  }

  if (horario_operacion.length < 5 || horario_operacion.length > 50) {
    return res.status(400).json({ msg: 'El horario de operación debe tener entre 5 y 50 caracteres.' });
  }

  if (frecuencia_servicio.length < 5 || frecuencia_servicio.length > 50) {
    return res.status(400).json({ msg: 'La frecuencia de servicio debe tener entre 5 y 50 caracteres.' });
  }

  if (rango_tarifas.length < 5 || rango_tarifas.length > 50) {
    return res.status(400).json({ msg: 'El rango de tarifas debe tener entre 5 y 50 caracteres.' });
  }
  if (nombre.length < 5 || nombre.length > 25) {
    return res.status(400).json({ msg: 'El nombre del corredor debe tener entre 5 y 100 caracteres.' });
  }

  const corredorExistente = await Corredor.findOne({ nombre });
  if (corredorExistente) {
    return res.status(400).json({ msg: `El corredor ${nombre} ya existe.` });
  }
  

  try {
    const nuevoCorredor = new Corredor({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      color_identificativo: color_identificativo.trim(),
      fecha_inauguracion,
      longitud_recorrido,
      horario_operacion,
      frecuencia_servicio,
      rango_tarifas,
      lugares_interes,
      tipo_vehiculos_utilizados,
      foto_url,
      estado_actual: true
    });

    await nuevoCorredor.save();

    res.status(201).json({
      msg: 'Corredor registrado exitosamente.',
      corredor: nuevoCorredor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar el corredor.', error: error.message });
  }
};


const actualizarCorredor = async (req, res) => {
  const { id } = req.params;
  const {nombre,descripcion,color_identificativo,fecha_inauguracion,longitud_recorrido,horario_operacion,frecuencia_servicio,rango_tarifas,lugares_interes,tipo_vehiculos_utilizados,foto_url} = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos." });

  if (!Array.isArray(lugares_interes) || lugares_interes.length === 0) {
    return res.status(400).json({ msg: 'Debe registrar al menos un lugar de interés.' });
  }

  if (!Array.isArray(tipo_vehiculos_utilizados) || tipo_vehiculos_utilizados.length === 0) {
    return res.status(400).json({ msg: 'Debe registrar al menos un tipo de vehículo utilizado.' });
  }

  if (descripcion.length < 5 || descripcion.length > 100) {
    return res.status(400).json({ msg: 'La descripción debe tener entre 5 y 100 caracteres.' });
  }

  if (color_identificativo.length < 3 || color_identificativo.length > 50) {
    return res.status(400).json({ msg: 'El color identificativo debe tener entre 3 y 50 caracteres.' });
  }

  if (longitud_recorrido.length < 5 || longitud_recorrido.length > 25) {
    return res.status(400).json({ msg: 'La longitud del recorrido debe tener entre 5 y 25 caracteres.' });
  }

  if (horario_operacion.length < 5 || horario_operacion.length > 50) {
    return res.status(400).json({ msg: 'El horario de operación debe tener entre 5 y 50 caracteres.' });
  }

  if (frecuencia_servicio.length < 5 || frecuencia_servicio.length > 50) {
    return res.status(400).json({ msg: 'La frecuencia de servicio debe tener entre 5 y 50 caracteres.' });
  }

  if (rango_tarifas.length < 5 || rango_tarifas.length > 50) {
    return res.status(400).json({ msg: 'El rango de tarifas debe tener entre 5 y 50 caracteres.' });
  }

  if (nombre.length < 5 || nombre.length > 25) {
    return res.status(400).json({ msg: 'El nombre del corredor debe tener entre 5 y 100 caracteres.' });
  }

  const corredorExistente = await Corredor.findOne({ nombre });
  if (corredorExistente && corredorExistente._id.toString() !== id) {
    return res.status(400).json({ msg: `El corredor ${nombre} ya existe.` });
  }

  try {
    const corredor = await Corredor.findById(id);

    if (!corredor) {
      return res.status(404).json({ msg: 'Corredor no encontrado.' });
    }

    const corredorActualizado = await Corredor.findByIdAndUpdate(
      id,
      {
        descripcion: descripcion.trim(),
        color_identificativo: color_identificativo.trim(),
        fecha_inauguracion,
        longitud_recorrido,
        horario_operacion,
        frecuencia_servicio,
        rango_tarifas,
        lugares_interes,
        tipo_vehiculos_utilizados,
        foto_url,
      },
      { new: true }
    );

    res.status(200).json({ msg: 'Corredor actualizado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el corredor.', error: error.message });
  }
};


const habilitarCorredor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `El corredor con ID ${id} no existe.` });
  }

  try {
    const corredor = await Corredor.findById(id);
    if (!corredor) {
      return res.status(404).json({ msg: `El corredor con ID ${id} no fue encontrado.` });
    }
    if (corredor.estado_actual) {
      return res.status(400).json({ msg: `El corredor con ID ${id} ya está habilitado.` });
    }

    const corredorHabilitado = await Corredor.findByIdAndUpdate(id, { estado_actual: true }, { new: true });
    res.status(200).json({ msg: "Corredor habilitado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al habilitar el corredor", error: error.message });
  }
}

const deshabilitarCorredor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `El corredor con ID ${id} no existe.` });
  }

  try {
    const corredor = await Corredor.findById(id);
    if (!corredor) {
      return res.status(404).json({ msg: `El corredor con ID ${id} no fue encontrado.` });
    }
    if (!corredor.estado_actual) {
      return res.status(400).json({ msg: `El corredor con ID ${id} ya está deshabilitado.` });
    }

    const corredorDeshabilitado = await Corredor.findByIdAndUpdate(id, { estado_actual: false }, { new: true });
    res.status(200).json({ msg: "Corredor deshabilitado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al deshabilitar el corredor", error: error.message });
  }
}


export {
  listarCorredores,
  detalleCorredor,
  crearCorredor,
  actualizarCorredor,
  habilitarCorredor,
  deshabilitarCorredor
};
