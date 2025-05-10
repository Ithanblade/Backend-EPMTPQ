import jwt from "jsonwebtoken";



const generarJWT = (id,rol)=>{

    return jwt.sign({id,rol},process.env.JWT_SECRET,{expiresIn:"1h"})
}

const generarTokenTemporal = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }); // 15 minutos de validez
};

export {
  generarJWT,
  generarTokenTemporal
}



