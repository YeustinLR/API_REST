// ./utils/sendVerificationSMS.js
// Importar librerías necesarias para el envío de SMS
import twilio from "twilio";

// Configurar el cliente de Twilio con las credenciales
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Función para enviar un SMS con el código de verificación
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
    try {
        await client.messages.create({
            body: `Su código de verificación es: ${verificationCode}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Número de teléfono de Twilio
            to: phoneNumber, // Número de teléfono del usuario
        });
        console.log("SMS de verificación enviado correctamente.");
    } catch (error) {
        console.error("Error al enviar SMS de verificación:", error);
        throw new Error("Error al enviar SMS de verificación.");
    }
};

export default sendVerificationSMS;
