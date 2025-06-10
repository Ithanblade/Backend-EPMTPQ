import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});


const sendMailToUser = (userMail, password, token) => {
    const link = `${process.env.URL_FRONTEND}/cambiar-password?token=${token}`;

    const mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Bienvenido a la EPMTPQ",
        html: `
            <p>Hola, haz clic <a href="${link}">aquí</a> para cambiar tu contraseña.</p>
            <hr>
            <p>Tu contraseña temporal es: <strong>${password}</strong></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Correo enviado: ' + info.response);
    });
};





export {
    sendMailToUser,
}


