//	./database/connectdb.js
import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.URI_MONGO);
        console.log("Conexión a la base de datos establecida");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
}

export default connectDB;
