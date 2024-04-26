// ./controllers/video.controller.js
import { Video } from '../models/Video.js';
import { Playlist } from '../models/Playlist.js';

// Controlador para crear un nuevo Video
export const createVideo = async (req, res) => {
    const { nombreVideo, urlYoutube, descripcion, playlistAsociada } = req.body;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        // Verificar que la playlist asociada exista y esté vinculada al usuario principal
        const playlist = await Playlist.findOne({ _id: playlistAsociada, usuarioPrincipal });
        if (!playlist) {
            return res.status(400).json({ error: 'La playlist asociada no está vinculada al usuario principal o no existe' });
        }

        const video = new Video({
            nombreVideo,
            urlYoutube,
            descripcion,
            playlistAsociada,
        });

        await video.save();
        res.status(201).json(video);
    } catch (error) {
        console.error('Error al crear el Video:', error);
        res.status(500).send('Error del servidor');
    }
};
// Controlador para obtener un Video por su ID
export const getVideoById = async (req, res) => {
    const { id } = req.params;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const video = await Video.findOne({ _id: id })
            .populate({
                path: 'playlistAsociada',
                match: { usuarioPrincipal }, // Validar que la playlist asociada esté vinculada al usuario principal
                select: '-perfilesAsociados', // Excluir información sensible de la playlist
            })
            .exec();

        if (!video) {
            return res.status(404).json({ msg: 'Video no encontrado' });
        }

        if (!video.playlistAsociada) {
            return res.status(403).json({ error: 'La playlist asociada no está vinculada al usuario principal' });
        }

        res.json(video);
    } catch (error) {
        console.error('Error al obtener el Video por ID:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para actualizar un Video por su ID
export const updateVideoById = async (req, res) => {
    const { id } = req.params;
    const { nombreVideo, urlYoutube, descripcion, playlistAsociada } = req.body;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const video = await Video.findOne({ _id: id })
            .populate({
                path: 'playlistAsociada',
                match: { usuarioPrincipal }, // Validar que la playlist asociada esté vinculada al usuario principal
                select: '-perfilesAsociados', // Excluir información sensible de la playlist
            })
            .exec();

        if (!video) {
            return res.status(404).json({ msg: 'Video no encontrado' });
        }

        if (!video.playlistAsociada) {
            return res.status(403).json({ error: 'La playlist asociada no está vinculada al usuario principal' });
        }

        video.nombreVideo = nombreVideo || video.nombreVideo;
        video.urlYoutube = urlYoutube|| video.urlYoutube;
        video.descripcion = descripcion|| video.descripcion;
        video.playlistAsociada = playlistAsociada|| video.playlistAsociada;

        await video.save();

        res.json({ msg: 'Video actualizado correctamente', video });
    } catch (error) {
        console.error('Error al actualizar el Video:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para eliminar un Video por su ID
export const deleteVideoById = async (req, res) => {
    const { id } = req.params;
    const usuarioPrincipal = req.user; // ID del usuario principal obtenido del token

    try {
        const video = await Video.findOne({ _id: id })
            .populate({
                path: 'playlistAsociada',
                match: { usuarioPrincipal }, // Validar que la playlist asociada esté vinculada al usuario principal
                select: '-perfilesAsociados', // Excluir información sensible de la playlist
            })
            .exec();

        if (!video) {
            return res.status(404).json({ msg: 'Video no encontrado' });
        }

        if (!video.playlistAsociada) {
            return res.status(403).json({ error: 'La playlist asociada no está vinculada al usuario principal' });
        }

        await Video.findByIdAndDelete(id);

        res.json({ msg: 'Video eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el Video:', error);
        res.status(500).send('Error del servidor');
    }
};
// Controlador para obtener todos los videos
export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        console.error('Error al obtener todos los videos:', error);
        res.status(500).send('Error del servidor');
    }
};



