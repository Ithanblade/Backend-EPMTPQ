import express from 'express';
import {
  listarParadas,
  detalleParada,
  crearParada,
  actualizarParada,
  habilitarParada,
  deshabilitarParada
} from '../controllers/parada_controller.js';
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = express.Router();

router.get('/paradas', verificarAutenticacion, listarParadas);

router.get('/parada/:id', verificarAutenticacion, detalleParada);

router.post('/parada/registro',verificarAutenticacion, crearParada);

router.put('/parada/:id',verificarAutenticacion, actualizarParada);

router.put('/parada/habilitar/:id',verificarAutenticacion, habilitarParada);

router.put('/parada/deshabilitar/:id',verificarAutenticacion, deshabilitarParada);

export default router;
