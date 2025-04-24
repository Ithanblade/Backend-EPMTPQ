import { Router } from 'express';
import { obtenerImagenes } from '../controllers/img_controller.js';

const router = Router();

router.get('/imagenes', obtenerImagenes);

export default router;
