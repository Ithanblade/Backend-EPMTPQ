import { Router } from 'express';
const router = Router();

import {
    listarRutas,
    detalleRuta,
    registrarRuta,
    actualizarRuta,
    habilitarRuta,
    deshabilitarRuta,
} from "../controllers/ruta_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";

router.get("/rutas", verificarAutenticacion, listarRutas);
router.get("/ruta/:id", verificarAutenticacion, detalleRuta);
router.post("/ruta/registro", verificarAutenticacion, registrarRuta);
router.put("/ruta/actualizar/:id", verificarAutenticacion, actualizarRuta);
router.put("/ruta/habilitar/:id", verificarAutenticacion, habilitarRuta);
router.put("/ruta/deshabilitar/:id", verificarAutenticacion, deshabilitarRuta);

export default router;
