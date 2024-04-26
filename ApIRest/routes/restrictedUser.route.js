//	./routes/restrictedUser.routes.js
import { Router } from "express";
import auth from "../middlewares/auth.js";
import {userRestricted} from "../validations/validations.js"
import { validationResultExpress } from "../middlewares/validationResultExpress.js";


import {crearRestrictedUser,obtenerRestrictedUsers,obtenerRestrictedUserPorId, actualizarRestrictedUser,eliminarRestrictedUser} from '../controllers/restrictedUser.js';

const router = Router();

// Ruta para crear un nuevo RestrictedUser
router.post('/register',auth,userRestricted,validationResultExpress, crearRestrictedUser);

// Ruta para obtener todos los RestrictedUsers
router.get('/read',auth, obtenerRestrictedUsers);

// Ruta para obtener un RestrictedUser por su ID
router.get('/read/:id',auth, obtenerRestrictedUserPorId);

// Ruta para actualizar un RestrictedUser por su ID
router.put('/update/:id',auth, actualizarRestrictedUser);

// Ruta para eliminar un RestrictedUser por su ID
router.delete('/delete/:id',auth, eliminarRestrictedUser);

export default router;
