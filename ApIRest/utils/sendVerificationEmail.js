// ./utils/sendVerificationEmail.js
import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USERNAME, // Reemplaza con tu dirección de correo electrónico
                pass: process.env.EMAIL_PASSWORD, // Reemplaza con la contraseña de tu correo electrónico
            },
        });

        const mailOptions = {
            from: '"Tu Nombre" <${process.env.EMAIL_USERNAME}>', // Reemplaza con tu nombre y dirección de correo
            to: email,
            subject: "Verifica tu cuenta",
            text: `Para activar tu cuenta, haz clic en el siguiente enlace: ${process.env.SERVIDOR_URL}/api/yt/user/activate/${verificationToken}`,
            html: `<p>Para activar tu cuenta, haz clic en el siguiente enlace:</p><p><a href="${process.env.SERVIDOR_URL}/api/yt/user/activate/${verificationToken}">Activar cuenta</a></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo electrónico de verificación enviado correctamente.");
    } catch (error) {
        console.error("Error al enviar el correo electrónico de verificación:", error);
        throw new Error("Error al enviar el correo electrónico de verificación.");
    }
};

export default sendVerificationEmail;
