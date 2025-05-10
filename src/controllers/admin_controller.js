// Importar el modelo 
import { sendMailToUser } from "../config/nodemailer.js"
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
    
    if (password.length < 6) return res.status(400).json({msg:"Lo sentimos, la contraseña debe tener al menos 6 caracteres"})
    
    const validacionEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!validacionEmail.test(email)) return res.status(400).json({msg:"Lo sentimos, el formato de email no es válido"})

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
const registro = async (req, res) => {
    const { email, nombre, apellido, direccion, telefono } = req.body;

    if (Object.values(req.body).includes("")) 
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const validacionEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!validacionEmail.test(email)) 
        return res.status(400).json({ msg: "Lo sentimos, el formato de email no es válido" });

    if (telefono.length < 10 || telefono.length > 15) 
        return res.status(400).json({ msg: "Teléfono debe tener entre 10 y 15 caracteres" });

    if (direccion.length < 5) 
        return res.status(400).json({ msg: "La dirección debe tener al menos 5 caracteres" });

    if (nombre.length < 3 || apellido.length < 3) 
        return res.status(400).json({ msg: "Nombre y apellido deben tener al menos 3 caracteres" });

    // Validar si ya existe
    const administradorBDD = await Administrador.findOne({ email });
    if (administradorBDD) 
        return res.status(404).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });

    // Crear el nuevo administrador
    const nuevoAdministrador = new Administrador(req.body);

    // Contraseña temporal
    const passwordTemporal = "Admin" + Math.random().toString(36).substring(2) + "Quito";
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(passwordTemporal);

    // Guardar en la BD
    await nuevoAdministrador.save();

    // Generar token temporal
    const token = generarTokenTemporal(nuevoAdministrador._id);

    // Enviar correo con token
    sendMailToUser(email, passwordTemporal, token);

    res.status(200).json({ msg: "Revisa tu correo electrónico para cambiar tu contraseña" });
};


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
const actualizarAdministrador = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
    }

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const administradorBDD = await Administrador.findById(id);
    if (!administradorBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el Administrador ${id}` });
    }

    if (administradorBDD.email !== req.body.email) {
        const administradorBDDMail = await Administrador.findOne({ email: req.body.email });
        if (administradorBDDMail) {
            return res.status(404).json({ msg: `Lo sentimos, el email ya se encuentra registrado` });
        }
    }

    if (req.body.telefono.length < 10 || req.body.telefono.length > 15) {
        return res.status(400).json({ msg: "Lo sentimos, el teléfono debe tener entre 10 y 15 caracteres" });
    }

    if (req.body.direccion.length < 10) {
        return res.status(400).json({ msg: "Lo sentimos, la dirección debe tener al menos 10 caracteres" });
    }

    if (req.body.nombre.length < 3) {
        return res.status(400).json({ msg: "Lo sentimos, el nombre debe tener al menos 3 caracteres" });
    }

    if (req.body.apellido.length < 3) {
        return res.status(400).json({ msg: "Lo sentimos, el apellido debe tener al menos 3 caracteres" });
    }

    const validacionEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!validacionEmail.test(req.body.email)) {
        return res.status(400).json({ msg: "Lo sentimos, el formato de email no es válido" });
    }

    // Verificar si se envía nueva contraseña y es diferente a la actual
    if (req.body.password) {
        if (req.body.password.length < 6 || req.body.password.length > 20) {
            return res.status(400).json({ msg: "La contraseña debe tener entre 6 y 20 caracteres" });
        }

        const esIgual = await administradorBDD.matchPassword(req.body.password);
        if (!esIgual) {
            
            const token = generarJWT(administradorBDD._id, "administrador");
            const passwordTemporal = req.body.password;
            administradorBDD.password = await administradorBDD.encrypPassword(passwordTemporal);
            await administradorBDD.save();
            sendMailToUser(req.body.email, passwordTemporal, token);
            req.body.password = passwordTemporal;
        }
        if (esIgual) {
            req.body.password = administradorBDD.password;
            delete req.body.password; 
        } else if (req.body.password === "") {
            delete req.body.password; 

        } else {
            delete req.body.password; 
        }
    }

    try {
        const administradorActualizado = await Administrador.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ msg: "Administrador actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Lo sentimos, hubo un error al actualizar el Administrador" });
    }
};



const habilitarAdministrador = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    if(administradorBDD.status===true) return res.status(404).json({msg:"Lo sentimos, el usuario ya se encuentra habilitado"})
    administradorBDD.status = true
    await administradorBDD.save()
    res.status(200).json({msg:"Administrador habilitado correctamente"})
}

const deshabilitarAdministrador = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})

    if(administradorBDD.status===false) return res.status(404).json({msg:"Lo sentimos, el usuario ya se encuentra deshabilitado"})
    
    administradorBDD.status = false
    await administradorBDD.save()
    res.status(200).json({msg:"Administrador deshabilitado correctamente"})
}


import jwt from 'jsonwebtoken';

const cambiarPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Administrador.findById(decoded.id);
        if (!admin) return res.status(404).json({ msg: 'Administrador no encontrado' });

        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({ msg: "Contraseña debe tener entre 6 y 20 caracteres" });
        }

        admin.password = await admin.encrypPassword(password);
        await admin.save();

        res.status(200).json({ msg: "Contraseña actualizada correctamente" });

    } catch (error) {
        res.status(401).json({ msg: "Token inválido o expirado" });
    }
};



export {
    login,
    perfil,
    registro,
    listarAdministradores,
    detalleAdministrador,
    actualizarAdministrador,
    habilitarAdministrador,
    deshabilitarAdministrador,
    cambiarPassword
}