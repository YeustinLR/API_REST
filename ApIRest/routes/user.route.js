// ./routes/user.route.js
import { Router } from "express";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
import { register, login, getUserById, activateAccount, verifySMSCode } from "../controllers/usersRegister.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { registerValidations, loginValidations } from "../validations/validations.js";
import auth from "../middlewares/auth.js"
const router = Router();
// Login
router.post("/login", loginValidations, validationResultExpress, login);

// Create Users
router.post("/register", registerValidations, validationResultExpress, register);

router.post("/r/activate/:token", activateAccount);

// Ruta de activación de cuenta
router.get("/activate/:token", async (req, res) => {
    await activateAccount(req, res);
});

// Read by id
router.get("/users/:id", auth,getUserById);

// Testing auth token
router.get("/users/me", auth, (req, res) => {
    const user = req.user;
    res.json({ user });
});
router.get('/ruta-de-prueba', auth, (req, res) => {
    const user = req.user;
    res.json({ user});
  });

router.post("/verify", authMiddleware, verifySMSCode);


export default router;
