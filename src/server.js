import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

import routerAdmin from './routers/admin_routes.js'

import routerRutas from './routers/rutas_routes.js'

import routerCorredores from './routers/corredor_routes.js'

import routerParadas from './routers/parada_routes.js'

import routerImg from './routers/img_routes.js'



// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales



// Rutas 
app.use('/api',routerAdmin)
app.use('/api',routerRutas)
app.use('/api',routerCorredores)
app.use('/api',routerParadas)
app.use('/api',routerImg)





// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))



// Exportar la instancia de express por medio de app
export default  app