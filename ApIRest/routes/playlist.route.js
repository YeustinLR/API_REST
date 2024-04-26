//	./routes/restrictedUser.routes.js
import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addProfileToPlaylist, createPlaylist, deletePlaylistById, getAllPlaylists, getAllPlaylistsAndVideos, getPlaylistById, getPlaylistsAndVideosByRestrictedUser, updatePlaylistById } from "../controllers/playlist.js";



const router = Router();

// Ruta para crear un nuevo RestrictedUser
router.post('/register',auth, createPlaylist);

// Ruta para obtener todos los RestrictedUsers
router.get('/read',auth, getAllPlaylists);

// Ruta para obtener un RestrictedUser por su ID
router.get('/read/:id',auth, getPlaylistById);

// Ruta para actualizar un RestrictedUser por su ID
router.put('/update/:id',auth, updatePlaylistById);

// Ruta para eliminar un RestrictedUser por su ID
router.delete('/delete/:id',auth, deletePlaylistById);

router.put('/playlist/add/:id',auth, addProfileToPlaylist);

// Ruta para obtener las playlists y videos asociados a un perfil de usuario Restricted por su ID
router.get('/video/:id', auth, getPlaylistsAndVideosByRestrictedUser);

// Ruta para obtener las playlists y videos asociados a un ususario principal
router.get('/videoplaylist', auth, getAllPlaylistsAndVideos );


export default router;
