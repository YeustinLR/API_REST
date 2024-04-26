//	./routes/restrictedUser.routes.js
import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createVideo, deleteVideoById, getAllVideos, getVideoById, updateVideoById } from "../controllers/video.js";



const router = Router();

// Ruta para crear un nuevo RestrictedUser
router.post('/register',auth, createVideo);

// Ruta para obtener todos los RestrictedUsers

// Ruta para obtener un RestrictedUser por su ID
router.get('/read/:id',auth, getVideoById);

router.get('/read',auth, getAllVideos);


// Ruta para actualizar un RestrictedUser por su ID
router.put('/update/:id',auth, updateVideoById);

// Ruta para eliminar un RestrictedUser por su ID
router.delete('/delete/:id',auth, deleteVideoById);

export default router;
