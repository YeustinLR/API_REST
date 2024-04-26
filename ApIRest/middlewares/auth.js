// ./middlewares/authMiddlewareExplicitCode.js
import jwt from "jsonwebtoken";

const authMiddlewareExplicitCode = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "No hay token, autorización denegada" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const code = decoded.estado; // Obtener el código explícito del token
        if (code !== "funcional") {
            return res.status(401).json({ msg: "Código explícito incorrecto" });
        }
        req.user = decoded.userId; 
        console.log("USer de auth",req.user)
        // Adjuntar el usuario decodificado al objeto req
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(401).json({ msg: "Token no válido" });
    }
};

export default authMiddlewareExplicitCode;
