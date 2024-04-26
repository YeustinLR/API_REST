//	./middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ msg: "No hay token, autorización denegada" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(401).json({ msg: "Token no válido" });
    }
};

export default authMiddleware;