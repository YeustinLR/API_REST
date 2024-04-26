// ./models/Playlist.js

import { Schema, model } from 'mongoose';

const playlistSchema = new Schema({
    nombrePlaylist: {
        type: String,
        required: true,
    },
    perfilesAsociados: [{
        type: Schema.Types.ObjectId,
        ref: 'RestrictedUser',
        required: true,
    }],
    usuarioPrincipal: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const Playlist = model('Playlist', playlistSchema);
