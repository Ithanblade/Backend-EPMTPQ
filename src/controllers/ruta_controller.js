import mongoose from "mongoose";
import Ruta from "../models/Ruta.js"; 
import Corredor from "../models/Corredor.js"; 

// Función auxiliar para validar ObjectId
const validarObjectId = (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ msg: `El ID ${id} no es válido.` });
        return false;
    }
    return true;
};

// Listar todas las rutas (sin excepción)
const listarRutas = async (req, res) => {
    try {
        const rutas = await Ruta.find();
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las rutas", error: error.message });
    }
};

// Obtener detalles de una ruta
const detalleRuta = async (req, res) => {
    const { id } = req.params;
    if (!validarObjectId(id, res)) return;

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

// Registrar una nueva ruta (solo ID del corredor, sin paradas)
const registrarRuta = async (req, res) => {
    const { corredor, nombre, ...rutaData } = req.body;

    if (Object.values(req.body).some(value => value === '')) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    if (!validarObjectId(corredor, res)) return;

    try {
        // Verificar si la ruta ya existe
        const rutaExistente = await Ruta.findOne({ nombre }).lean();
        if (rutaExistente) {
            return res.status(400).json({ msg: "La ruta con este nombre ya se encuentra registrada." });
        }

        // Verificar si el corredor existe
        const corredorExistente = await Corredor.findById(corredor);
        if (!corredorExistente) {
            return res.status(404).json({ msg: `No se encontró el corredor con ID ${corredor}.` });
        }

        // Crear la nueva ruta con el ID del corredor
        const nuevaRuta = await Ruta.create({
            ...rutaData,
            nombre,
            corredor,
            estado: true
        });

        res.status(201).json({ msg: `Ruta "${nuevaRuta.nombre}" registrada exitosamente.`, nuevaRuta });
    } catch (error) {
        res.status(500).json({ msg: "Error al registrar la ruta", error: error.message });
    }
};

// Actualizar una ruta (sin modificar paradas, solo ID del corredor y datos básicos)
const actualizarRuta = async (req, res) => {
    const { id } = req.params;
    const { nombre, recorrido, horario, sentido, corredor } = req.body;

    if (!validarObjectId(id, res)) return;


    if (Object.values(req.body).some(value => value === '')) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    try {
        const rutaActual = await Ruta.findById(id);
        if (!rutaActual) {
            return res.status(404).json({ msg: `La ruta con ID ${id} no fue encontrada.` });
        }

        // Validar si el nombre ya existe en otra ruta
        if (nombre !== rutaActual.nombre) {
            const rutaExistente = await Ruta.findOne({ nombre }).lean();
            if (rutaExistente) {
                return res.status(400).json({ msg: `La ruta "${nombre}" ya existe. Use otro nombre.` });
            }
        }



        const rutaActualizada = await Ruta.findByIdAndUpdate(
            id,
            { nombre, recorrido, horario, sentido, corredor },
            { new: true, runValidators: true }
        );

        res.status(200).json({ msg: "Ruta actualizada exitosamente.", rutaActualizada });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar la ruta", error: error.message });
    }
};

// Habilitar o deshabilitar una ruta (un solo método)
const cambiarEstadoRuta = async (req, res, estado) => {
    const { id } = req.params;
    if (!validarObjectId(id, res)) return;

    try {
        const ruta = await Ruta.findById(id);
        if (!ruta) {
            return res.status(404).json({ msg: `La ruta con ID ${id} no fue encontrada.` });
        }

        const rutaActualizada = await Ruta.findByIdAndUpdate(id, { estado }, { new: true });
        const estadoTexto = estado ? "habilitada" : "deshabilitada";
        res.status(200).json({ msg: `Ruta ${estadoTexto} correctamente.`, rutaActualizada });

    } catch (error) {
        res.status(500).json({ msg: `Error al ${estado ? "habilitar" : "deshabilitar"} la ruta`, error: error.message });
    }
};

const habilitarRuta = (req, res) => cambiarEstadoRuta(req, res, true);
const deshabilitarRuta = (req, res) => cambiarEstadoRuta(req, res, false);

// Listar rutas de un corredor
const listarRutasPorCorredor = async (req, res) => {
    const { corredorId } = req.params;
    if (!validarObjectId(corredorId, res)) return;

    try {
        const rutas = await Ruta.find({ corredor: corredorId })
            .select("-createdAt -updatedAt -__v")
            .lean();

        if (!rutas.length) {
            return res.status(404).json({ msg: "No se encontraron rutas para este corredor." });
        }

        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las rutas del corredor", error: error.message });
    }
};

export {
    listarRutas,
    detalleRuta,
    registrarRuta,
    actualizarRuta,
    habilitarRuta,
    deshabilitarRuta,
};
