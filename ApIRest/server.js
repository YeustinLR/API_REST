//	/server.js
import express from "express";
import "dotenv/config";

import userRoutes from "./routes/user.route.js";
import restrictedUserRoutes from "./routes/restrictedUser.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import videoRoutes from "./routes/video.route.js";

import connectDB from "./database/connectdb.js";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());



// Conexión a la base de datos
connectDB();




//Rutas
app.use('/api/yt/user',userRoutes);
app.use('/api/yt/restrictedUser',restrictedUserRoutes);
app.use('/api/yt/playlist',playlistRoutes);
app.use('/api/yt/video',videoRoutes);




//Conexión
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
