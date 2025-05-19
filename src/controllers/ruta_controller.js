import mongoose from "mongoose";
import Ruta from "../models/Ruta.js";
import Corredor from "../models/Corredor.js";

const listarRutas = async (req, res) => {
    try {
        const rutas = await Ruta.find();
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las rutas", error: error.message });
    }
};

const detalleRuta = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: `El ID ${id} no es válido.` });
    }

    try {
        const ruta = await Ruta.findById(id).populate("corredor", "nombre")

        if (!ruta) {
            return res.status(404).json({ msg: `La ruta con ID ${id} no fue encontrada.` });
        }

        res.status(200).json(ruta);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el detalle de la ruta", error: error.message });
    }
};


const registrarRuta = async (req, res) => {
    const { nombre, corredor, descripcion, sentido, frecuencia_paso, horario_operacion, color_ruta, estado_actual } = req.body;

    if (Object.values(req.body).includes('')) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    if (typeof estado_actual !== 'boolean') {
        return res.status(400).json({ msg: "El campo 'estado_actual' debe ser true o false" });
    }

    if (!mongoose.Types.ObjectId.isValid(corredor)) {
        return res.status(400).json({ msg: 'ID de corredor inválido.' });
    }

    if (nombre.length < 5 || nombre.length > 50) {
        return res.status(400).json({ msg: 'El nombre de la ruta debe tener entre 5 y 50 caracteres.' });
    }
    if (descripcion.length < 5 || descripcion.length > 100) {
        return res.status(400).json({ msg: 'La descripción debe tener entre 5 y 100 caracteres.' });
    }
    if (color_ruta.length < 3 || color_ruta.length > 50) {
        return res.status(400).json({ msg: 'El color de la ruta debe tener entre 3 y 50 caracteres.' });
    }
    if (frecuencia_paso.length < 5 || frecuencia_paso.length > 50) {
        return res.status(400).json({ msg: 'La frecuencia de paso debe tener entre 5 y 50 caracteres.' });
    }
    if (horario_operacion.length < 5 || horario_operacion.length > 50) {
        return res.status(400).json({ msg: 'El horario de operación debe tener entre 5 y 50 caracteres.' });
    }
    if (sentido.length < 5 || sentido.length > 50) {
        return res.status(400).json({ msg: 'El sentido de la ruta debe tener entre 5 y 50 caracteres.' });
    }


    try {
        const rutaExistente = await Ruta.findOne({ nombre }).lean();
        if (rutaExistente) {
            return res.status(400).json({ msg: `La ruta "${nombre}" ya existe` });
        }

        const corredorExistente = await Corredor.findById(corredor);
        if (!corredorExistente) {
            return res.status(404).json({ msg: `No se encontró el corredor con ID ${corredor}.` });
        }

        const nuevaRuta = new Ruta({
            nombre,
            corredor,
            descripcion,
            sentido,
            frecuencia_paso,
            horario_operacion,
            color_ruta,
            estado_actual
        });

        await nuevaRuta.save();

        res.status(201).json({ msg: `Ruta registrada exitosamente.`, });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar la ruta.", error: error.message });
    }
};



const actualizarRuta = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    corredor,
    descripcion,
    sentido,
    frecuencia_paso,
    horario_operacion,
    color_ruta,
    estado_actual
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de ruta inválido." });
  }

  if (Object.values(req.body).includes('')) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  if (typeof estado_actual !== 'boolean') {
    return res.status(400).json({ msg: "El campo 'estado_actual' debe ser true o false" });
  }

  if (!mongoose.Types.ObjectId.isValid(corredor)) {
    return res.status(400).json({ msg: 'ID de corredor inválido.' });
  }

  if (nombre.length < 5 || nombre.length > 50) {
    return res.status(400).json({ msg: 'El nombre de la ruta debe tener entre 5 y 50 caracteres.' });
  }
  if (descripcion.length < 5 || descripcion.length > 100) {
    return res.status(400).json({ msg: 'La descripción debe tener entre 5 y 100 caracteres.' });
  }
  if (color_ruta.length < 3 || color_ruta.length > 50) {
    return res.status(400).json({ msg: 'El color de la ruta debe tener entre 3 y 50 caracteres.' });
  }
  if (frecuencia_paso.length < 5 || frecuencia_paso.length > 50) {
    return res.status(400).json({ msg: 'La frecuencia de paso debe tener entre 5 y 50 caracteres.' });
  }
  if (horario_operacion.length < 5 || horario_operacion.length > 50) {
    return res.status(400).json({ msg: 'El horario de operación debe tener entre 5 y 50 caracteres.' });
  }
  if (sentido.length < 5 || sentido.length > 50) {
    return res.status(400).json({ msg: 'El sentido de la ruta debe tener entre 5 y 50 caracteres.' });
  }

  try {

    const rutaExistente = await Ruta.findById(id);
    if (!rutaExistente) {
      return res.status(404).json({ msg: `No se encontró la ruta con ID ${id}.` });
    }

    const corredorExistente = await Corredor.findById(corredor);
    if (!corredorExistente) {
      return res.status(404).json({ msg: `No se encontró el corredor con ID ${corredor}.` });
    }

    const rutaConNombreExistente = await Ruta.findOne({ nombre });
    if (rutaConNombreExistente && rutaConNombreExistente._id.toString() !== id) {
      return res.status(400).json({ msg: `Ya existe una ruta con el nombre "${nombre}".` });
    }

    const rutaActualizada = await Ruta.findByIdAndUpdate(
      id,
      {
        nombre: nombre.trim(),
        corredor,
        descripcion: descripcion.trim(),
        sentido: sentido.trim(),
        frecuencia_paso: frecuencia_paso.trim(),
        horario_operacion: horario_operacion.trim(),
        color_ruta: color_ruta.trim(),
        estado_actual
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      msg: `Ruta actualizada exitosamente.`,
      ruta: rutaActualizada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la ruta.", error: error.message });
  }
};


const habilitarRuta = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: `El ID ${id} no es válido.` });
    }

    try {
        const ruta = await Ruta.findById(id);
        if (!ruta) {
            return res.status(404).json({ msg: `La ruta con ID ${id} no fue encontrada.` });
        }

        if (ruta.estado_actual) {
            return res.status(400).json({ msg: "La ruta ya está habilitada." });
        }

        ruta.estado_actual = true;
        await ruta.save();

        res.status(200).json({ msg: "Ruta habilitada exitosamente." });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al habilitar la ruta", error: error.message });
    }

}
const deshabilitarRuta = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: `El ID ${id} no es válido.` });
    }

    try {
        const ruta = await Ruta.findById(id);
        if (!ruta) {
            return res.status(404).json({ msg: `La ruta con ID ${id} no fue encontrada.` });
        }

        if (!ruta.estado_actual) {
            return res.status(400).json({ msg: "La ruta ya está deshabilitada." });
        }

        ruta.estado_actual = false;
        await ruta.save();

        res.status(200).json({ msg: "Ruta deshabilitada exitosamente." });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al deshabilitar la ruta", error: error.message });
    }
}


export {
    listarRutas,
    detalleRuta,
    registrarRuta,
    actualizarRuta,
    habilitarRuta,
    deshabilitarRuta,
};
