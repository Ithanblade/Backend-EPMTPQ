
// Importar el modelo 
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import Administrador from "../models/Admin.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'


const SuperAdmin = {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
}

// Método para el login
const login = async(req,res)=>{
    const {email,password} = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})

    // Validar si el usuario es el super administrador
    if(email===SuperAdmin.email && password===SuperAdmin.password){
        const token = generarJWT(password,"super-administrador")
        return res.status(200).json({
            token,
            email:SuperAdmin.email,
            nombre:"Super Administrador",
            rol:"Super Administrador"})
    }
    
    const administradorBDD = await Administrador.findOne({email}).select("-__v -token -updatedAt -createdAt")
    
    if(administradorBDD?.status===false) return res.status(403).json({msg:"Lo sentimos, el usuario se encuentra deshabilitado"})
    
    if(!administradorBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    
    const verificarPassword = await administradorBDD.matchPassword(password)
    
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    

    const token = generarJWT(administradorBDD._id,"administrador")

    const {nombre,apellido,direccion,telefono,_id} = administradorBDD
    
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:administradorBDD.email,
        rol:"Administrador"
    })
}




// Método para mostrar el perfil 
const perfil =(req,res)=>{
    const {authorization} = req.headers
    const {rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)

    if (rol==="super-administrador"){
        res.status(200).json({
            nombre:"Super Administrador",
            rol:"Super Administrador"
        })

    } else {
        delete req.administradorBDD.token
        delete req.administradorBDD.confirmEmail
        delete req.administradorBDD.createdAt
        delete req.administradorBDD.updatedAt
        delete req.administradorBDD.changePassword
        delete req.administradorBDD.__v
        req.administradorBDD.rol="Administrador"
        res.status(200).json(req.administradorBDD)
    }
}

// Método para el registro
const registro = async (req,res)=>{
    // Desestructurar los campos 
    const {email} = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario de la BDD en base al email
    const verificarEmailBDD = await Administrador.findOne({email})
    // Validar que el email sea nuevo
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    // Crear la instancia del Administrador
    const nuevoAdministrador = new Administrador(req.body)
    
    // Crear un password
    const password = Math.random().toString(36).substring(2)

    // Encriptar el password
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword("Admin"+password+"Quito")

    // Enviar el correo electrónico
    sendMailToUser(email,"Admin"+password+"Quito")
    // Guaradar en BDD
    await nuevoAdministrador.save()
    // Imprimir el mensaje
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

// Método para listar Administradors
const listarAdministradores = async (req,res)=>{
    // mostar todos los administradores
    const administradores = await Administrador.find()
    res.status(200).json(administradores)
}


// Método para mostrar el detalle de un Administrador en particular
const detalleAdministrador = async(req,res)=>{
    const {id} = req.params
    const administradorBDD = await Administrador.findById(id)
    res.status(200).json(administradorBDD)
}


// Método para actualizar el perfil
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    if (administradorBDD.email !=  req.body.email)
    {
        const administradorBDDMail = await Administrador.findOne({email:req.body.email})
        if (administradorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
	
    const password = Math.random().toString(36).substring(2)

    administradorBDD.nombre = req.body.nombre || administradorBDD?.nombre
    administradorBDD.apellido = req.body.apellido  || administradorBDD?.apellido
    administradorBDD.direccion = req.body.direccion ||  administradorBDD?.direccion
    administradorBDD.telefono = req.body.telefono || administradorBDD?.telefono
    administradorBDD.email = req.body.email || administradorBDD?.email
    administradorBDD.password = req.body.password ? await administradorBDD.encrypPassword("Admin"+password+"Quito") : administradorBDD?.password
    sendMailToUser(administradorBDD.email,"Admin"+password+"Quito")
    await administradorBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}


const habilitarAdministrador = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    administradorBDD.status = true
    await administradorBDD.save()
    res.status(200).json({msg:"Administrador habilitado correctamente"})
}

const deshabilitarAdministrador = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    administradorBDD.status = false
    await administradorBDD.save()
    res.status(200).json({msg:"Administrador eliminado correctamente"})
}


// Exportar cada uno de los métodos
export {
    login,
    perfil,
    registro,
    listarAdministradores,
    detalleAdministrador,
    actualizarPerfil,
    habilitarAdministrador,
    deshabilitarAdministrador,
}