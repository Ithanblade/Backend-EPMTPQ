// Importar Router de Express
import { Router } from 'express'

// Crear una instancia de Router() 
const router = Router()

// Importar los métodos del controlador 
import {
    login,
    perfil,
    registro,
    listarAdministradores,
    detalleAdministrador,
    actualizarPerfil,
    deshabilitarAdministrador,
    habilitarAdministrador,
} from "../controllers/admin_controller.js";
import verificarAutenticacion from '../middlewares/autenticacion.js';


import { validacionAdministrador } from '../middlewares/validacionAdministrador.js';
import verificarAutenticacionSuperAdministrador from '../middlewares/autenticaion_superAdministrador.js';


// Rutas publicas
router.post("/login", login);


// Rutas privadas
router.post("/registro", verificarAutenticacionSuperAdministrador, registro);

router.get("/administradores", verificarAutenticacion, listarAdministradores);


router.get("/perfil", verificarAutenticacion, perfil,);


router.get("/administrador/:id", verificarAutenticacion, detalleAdministrador);


router.put("/administrador/:id", verificarAutenticacionSuperAdministrador, actualizarPerfil);


router.put("/administrador/habilitar/:id", verificarAutenticacionSuperAdministrador, habilitarAdministrador);


router.put("/administrador/deshabilitar/:id", verificarAutenticacionSuperAdministrador, deshabilitarAdministrador);


// Exportar la variable router
export default router






