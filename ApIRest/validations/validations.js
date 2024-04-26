// ./validations/validations.js
import { body, validationResult } from "express-validator";
import moment from "moment"; // Importa moment.js para trabajar con fechas


const registerValidations = [
    body("email", "Correo electrónico inválido").trim().isEmail().normalizeEmail(),
    body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
    body("pin", "El PIN debe tener 6 dígitos").isLength({ min: 6, max: 6 }).isNumeric(),
    body("nombre", "El nombre es requerido").not().isEmpty(),
    body("apellidos", "Los apellidos son requeridos").not().isEmpty(),
    body("pais", "El país es requerido").not().isEmpty(),
    body("fechaNacimiento").not().isEmpty().withMessage("La fecha de nacimiento es requerida").custom((value) => {
        // Verificar si la fecha de nacimiento es válida y si la persona tiene más de 18 años
        const birthDate = moment(value, "YYYY-MM-DD");
        const eighteenYearsAgo = moment().subtract(18, "years");
        if (!birthDate.isValid() || birthDate.isAfter(eighteenYearsAgo)) {
            throw new Error("Debes ser mayor de 18 años para registrarte.");
        }
        return true;
    }),
];

const loginValidations = [
    body("email", "Correo electrónico inválido").isEmail(),
    body("password", "La contraseña es requerida").exists(),
];
const userRestricted = [
    body("pin", "El PIN debe tener 6 dígitos").isLength({ min: 6, max: 6 }).isNumeric(),

];
export { registerValidations,loginValidations,userRestricted };