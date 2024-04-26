// ./controllers/playlist.controller.js

import { Playlist } from '../models/Playlist.js';
import { RestrictedUser } from '../models/RestrictedUser.js';
import { Video } from '../models/Video.js';
// Controlador para crear una nueva Playlist
export const createPlaylist = async (req, res) => {
    const { nombrePlaylist, perfilesAsociados } = req.body;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        // Verificar que los IDs de perfiles asociados sean válidos y estén asociados al usuario principal
        const perfilesValidos = await verificarPerfilesAsociados(perfilesAsociados, usuarioPrincipal);

        if (!perfilesValidos) {
            return res.status(400).json({ error: 'Perfiles asociados inválidos' });
        }

        const playlist = new Playlist({
            nombrePlaylist,
            perfilesAsociados: perfilesValidos,
            usuarioPrincipal,
        });

        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        console.error('Error al crear la Playlist:', error);
        res.status(500).send('Error del servidor');
    }
};

const verificarPerfilesAsociados = async (perfilesAsociados, usuarioPrincipal) => {
    try {
        // Obtener los perfiles asociados del usuario principal
        const perfilesUsuarioPrincipal = await RestrictedUser.find({ usuarioPrincipal });

        // Verificar que los IDs de perfiles asociados sean válidos y estén asociados al usuario principal
        const perfilesValidos = perfilesUsuarioPrincipal.filter(perfil => perfilesAsociados.includes(perfil._id.toString()));

        // Verificar si todos los perfiles asociados son válidos
        if (perfilesValidos.length !== perfilesAsociados.length) {
            return null; // Retornar null si algún perfil asociado no es válido
        }

        return perfilesValidos.map(perfil => perfil._id); // Retornar solo los IDs de perfiles válidos
    } catch (error) {
        console.error('Error al verificar los perfiles asociados:', error);
        return null;
    }
};



// Controlador para obtener todas las Playlists
export const getAllPlaylists = async (req, res) => {
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const playlists = await Playlist.find({ usuarioPrincipal });
        res.json(playlists);
    } catch (error) {
        console.error('Error al obtener las Playlists:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para obtener una Playlist por su ID
export const getPlaylistById = async (req, res) => {
    const { id } = req.params;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const playlist = await Playlist.findOne({ _id: id, usuarioPrincipal });
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist no encontrada' });
        }
        res.json(playlist);
    } catch (error) {
        console.error('Error al obtener la Playlist por ID:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para actualizar una Playlist por su ID
export const updatePlaylistById = async (req, res) => {
    const { id } = req.params;
    const { nombrePlaylist, perfilesAsociados } = req.body;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        let playlist = await Playlist.findOne({ _id: id, usuarioPrincipal });
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist no encontrada' });
        }
        // Verificar que los IDs de perfiles asociados sean válidos y estén asociados al usuario principal

        playlist.nombrePlaylist = nombrePlaylist || playlist.nombrePlaylist;
        playlist.perfilesAsociados = perfilesAsociados || playlist.perfilesAsociados;
        console.log("P:",perfilesAsociados)
        const perfilesValidos = await verificarPerfilesAsociados(playlist.perfilesAsociados, usuarioPrincipal);

        if (!perfilesValidos) {
            return res.status(400).json({ error: 'Perfiles asociados inválidos' });
        }

        await playlist.save();

        res.json({ msg: 'Playlist actualizada correctamente', playlist });
    } catch (error) {
        console.error('Error al actualizar la Playlist:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para eliminar una Playlist por su ID
export const deletePlaylistById = async (req, res) => {
    const { id } = req.params;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const playlist = await Playlist.findOne({ _id: id, usuarioPrincipal });
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist no encontrada' });
        }

        await Playlist.findByIdAndDelete(id);

        res.json({ msg: 'Playlist eliminada correctamente', playlist }); // Devuelve la playlist eliminada
    } catch (error) {
        console.error('Error al eliminar la Playlist:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para agregar un perfil asociado a una Playlist existente
export const addProfileToPlaylist = async (req, res) => {
    const { id } = req.params; // ID de la playlist
    const { perfilId } = req.body; // ID del perfil a agregar
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        // Verificar que la playlist exista y pertenezca al usuario principal
        const playlist = await Playlist.findOne({ _id: id, usuarioPrincipal });
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist no encontrada' });
        }

        // Verificar que el perfil a agregar pertenezca al usuario principal
        const perfil = await RestrictedUser.findOne({ _id: perfilId, usuarioPrincipal });
        if (!perfil) {
            return res.status(404).json({ msg: 'Perfil no encontrado' });
        }

        // Verificar que el perfil no esté ya en la lista de perfiles asociados de la playlist
        if (playlist.perfilesAsociados.includes(perfilId)) {
            return res.status(400).json({ error: 'El perfil ya está asociado a la playlist' });
        }

        // Agregar el perfil a la lista de perfiles asociados de la playlist y guardar los cambios
        playlist.perfilesAsociados.push(perfilId);
        await playlist.save();

        res.json({ msg: 'Perfil agregado correctamente a la playlist', playlist });
    } catch (error) {
        console.error('Error al agregar perfil a la Playlist:', error);
        res.status(500).send('Error del servidor');
    }
};
// Controlador para obtener las playlists y videos asociados a un perfil de usuario
export const getPlaylistsAndVideosByRestrictedUser = async (req, res) => {
    const { id } = req.params; // ID del perfil de usuario Restricted

    try {
        // Verificar si el perfil de usuario Restricted existe
        const restrictedUser = await RestrictedUser.findById(id);
        if (!restrictedUser) {
            return res.status(404).json({ msg: 'Perfil de usuario Restricted no encontrado' });
        }

        // Obtener las playlists asociadas al perfil de usuario Restricted
        const playlists = await Playlist.find({ perfilesAsociados: id });

        // Obtener los videos asociados a las playlists
        const playlistsWithVideos = await Promise.all(
            playlists.map(async (playlist) => {
                const videos = await Video.find({ playlistAsociada: playlist._id });
                return {
                    ...playlist.toJSON(),
                    videos,
                };
            })
        );

        res.json(playlistsWithVideos);
    } catch (error) {
        console.error('Error al obtener las playlists y videos asociados al perfil de usuario Restricted:', error);
        res.status(500).send('Error del servidor');
    }
};
// Controlador para obtener todas las Playlists y sus Videos asociados
export const getAllPlaylistsAndVideos = async (req, res) => {
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        // Obtener todas las playlists del usuario principal
        const playlists = await Playlist.find({ usuarioPrincipal });

        // Array para almacenar las playlists con sus videos
        const playlistsWithVideos = [];

        // Iterar sobre cada playlist para obtener sus videos
        for (let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i];

            // Obtener los videos asociados a la playlist actual
            const videos = await Video.find({ playlistAsociada: playlist._id });

            // Crear un objeto con la playlist y sus videos
            const playlistWithVideos = {
                _id: playlist._id,
                nombrePlaylist: playlist.nombrePlaylist,
                perfilesAsociados: playlist.perfilesAsociados,
                videos: videos
            };

            playlistsWithVideos.push(playlistWithVideos);
        }

        res.json(playlistsWithVideos);
    } catch (error) {
        console.error('Error al obtener las Playlists y sus Videos:', error);
        res.status(500).send('Error del servidor');
    }
};


