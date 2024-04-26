// ./models/Video.js
import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
    nombreVideo: {
        type: String,
        required: true,
    },
    urlYoutube: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Validar que la URL sea un enlace de YouTube válido
                return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i.test(v);
            },
            message: 'La URL debe ser un enlace de YouTube válido.',
        },
    },
    descripcion: String,
    playlistAsociada: {
        type: Schema.Types.ObjectId,
        ref: 'Playlist',
        required: true,
    },
});

export const Video = model('Video', videoSchema);
