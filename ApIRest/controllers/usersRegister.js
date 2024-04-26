//./controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import sendVerificationSMS from "../utils/sendVerificationSMS.js";


//EndPoints USERS

//CREATE
// Registro de usuario con envío de correo de verificación
export const register = async (req, res) => {
    const { email, password, pin, nombre, apellidos, pais, fechaNacimiento, telefono } =
        req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "El usuario ya existe" }] });
        }

        // Crear el nuevo usuario con estado 'pendiente' y generar token de verificación
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        user = new User({
            email,
            password,
            pin,
            nombre,
            apellidos,
            pais,
            fechaNacimiento,
            telefono,
            estado: 'pendiente',
        });

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Enviar correo electrónico de verificación
        await sendVerificationEmail(user.email, verificationToken);

        res.json({ msg: "Usuario registrado correctamente. Por favor, verifica tu correo electrónico para activar tu cuenta.",
        user: {
            _id: user._id,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            pais: user.pais,
            fechaNacimiento: user.fechaNacimiento,
            telefono: user.telefono,
            estado: user.estado,
        }, });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error del servidor");
    }
};

// Activar la cuenta después de hacer clic en el enlace de verificación
export const activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario por el token de verificación
        const user = await User.findOneAndUpdate(
            { email: decoded.email},
            { $set: { estado: 'activo' } },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Token de verificación inválido" }] });
        }

        res.redirect(process.env.CLIENTE_URL); // Redirigir al cliente
    } catch (error) {
        console.error("Error al activar la cuenta:", error);
        res.status(500).send("Error del servidor");
    }
};
//READ
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ errors: [{ msg: "Usuario no encontrado" }] });
        }

        res.json(user);
    } catch (error) {
        console.error("Error al obtener el usuario por ID:", error);
        res.status(500).send("Error del servidor");
    }
};

////////////////////////////////////////////////////////////////////////////
//EndPoints lOGIN
// Endpoint de inicio de sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario en la base de datos por email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Contraseña o correo inocrrecto" });
        }
        if (user.estado !== "activo") {
            return res.status(401).json({ error: "El usuario aún se encuentra pendiente" });
        }

        // Comparar la contraseña encriptada almacenada en la base de datos con la contraseña proporcionada
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Contraseña o correos inocrrecto" });
        }

        // Generar un token JWT solo con el ID del usuario
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Generar y enviar el código explícito
         const verificationCode = generateVerificationCode(); // Función para generar un código

        await User.updateOne({ email }, { $set: { verificationCode } });//Guardamos el valor en bd 

         await sendVerificationSMS(user.telefono, verificationCode); // Enviar el código por SMS al número asociado
        res.json({ token});
        console.log("Numero actualizado",verificationCode )

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Función para generar un código de verificación
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Genera un número aleatorio de 6 dígitos
};
// Endpoint de verificación de código SMS
// Endpoint de verificación de código SMS
export const verifySMSCode = async (req, res) => {
    const { verificationCode } = req.body;
    const userId = req.user; // Usamos req.user para obtener el ID de usuario

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(401).json({ error: "Código de verificación SMS incorrecto" });
        }
        const token = jwt.sign({ userId: user._id, estado: 'funcional', name: user.nombre }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
        console.log("Código de verificación SMS aceptado");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
