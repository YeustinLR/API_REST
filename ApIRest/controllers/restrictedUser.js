// ./controllers/video.controller.js
import {RestrictedUser}from "../models/RestrictedUser.js";

// CREATE RESTRICTEDUSER(Associated with the main user) 
export const crearRestrictedUser = async (req, res) => {
    const { nombreCompleto, pin, avatar, edad, usuarioPrincipal } = req.body;
    const usuarioId = req.user;

    try {

        const restrictedUser = new RestrictedUser({
            nombreCompleto,
            pin,
            avatar,
            edad,
            usuarioPrincipal: usuarioId,
        });
        await restrictedUser.save();
        res.status(201).json(restrictedUser);
    } catch (error) {
        console.error("Error al crear el RestrictedUser:", error);
        res.status(500).send("Error del servidor");
    }
};
// // GET RESTRICTEDUSER(Associated with the main user)
export const obtenerRestrictedUsers = async (req, res) => {
    const usuarioId = req.user; // Obtener el ID del usuario que realiza la petición

    try {
        const restrictedUsers = await RestrictedUser.find({ usuarioPrincipal: usuarioId });
        res.json(restrictedUsers);
    } catch (error) {
        console.error('Error al obtener los RestrictedUsers:', error);
        res.status(500).send('Error del servidor');
    }
};

// GET RESTRICTEDUSER BY ID (Associated with the main user) OPTIONAL
export const obtenerRestrictedUserPorId = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.user; // Obtener el ID del usuario que realiza la petición

    try {
        const restrictedUser = await RestrictedUser.findOne({ _id: id, usuarioPrincipal: usuarioId });
        if (!restrictedUser) {
            return res.status(404).json({ msg: 'RestrictedUser no encontrado' });
        }
        res.json(restrictedUser);
    } catch (error) {
        console.error('Error al obtener el RestrictedUser:', error);
        res.status(500).send('Error del servidor');
    }
};

// UPDATE RESTRICTEDUSER BY ID (Associated with the main user) 
export const actualizarRestrictedUser = async (req, res) => {
    const { id } = req.params;
    const { nombreCompleto, pin, avatar, edad } = req.body;
    const usuarioId = req.user; // Obtener el ID del usuario que realiza la petición

    try {
        let restrictedUser = await RestrictedUser.findOne({ _id: id, usuarioPrincipal: usuarioId });
        if (!restrictedUser) {
            return res.status(404).json({ msg: 'RestrictedUser no encontrado' });
        }

        restrictedUser.nombreCompleto = nombreCompleto || restrictedUser.nombreCompleto;
        restrictedUser.pin = pin || restrictedUser.pin;
        restrictedUser.avatar = avatar || restrictedUser.avatar;
        restrictedUser.edad = edad|| restrictedUser.edad;

        await restrictedUser.save();

        res.json({ msg: 'RestrictedUser actualizado correctamente', restrictedUser });
    } catch (error) {
        console.error('Error al actualizar el RestrictedUser:', error);
        res.status(500).send('Error del servidor');
    }
};

// DELETE RESTRICTEDUSER BY ID (Associated with the main user) 
export const eliminarRestrictedUser = async (req, res) => {
    const { id } = req.params;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const restrictedUser = await RestrictedUser.findOne({ _id: id, usuarioPrincipal });
        if (!restrictedUser) {
            return res.status(404).json({ msg: 'restrictedUser no encontrada' });
        }

        await RestrictedUser.findByIdAndDelete(id);

        res.json({ msg: 'restrictedUser eliminada correctamente', restrictedUser }); // Devuelve la restrictedUser eliminada
    } catch (error) {
        console.error('Error al eliminar la restrictedUser:', error);
        res.status(500).send('Error del servidor');
    }
};
