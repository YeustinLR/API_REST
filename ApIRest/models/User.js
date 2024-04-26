// ./models/User.js
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    pin: {
        type: Number,
        required: true,
        minlength: 6,
        maxlength: 6,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    pais: {
        type: String,
        required: true,
    },
    fechaNacimiento: {
        type: Date,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'activo'],
        default: 'pendiente',
    },
    verificationCode: {
        type: String,
        default: null,
    },
});

export const User = model('User', userSchema);
