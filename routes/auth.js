/*
    path:/api/login
*/

const router = require("express").Router();
const { crearUsuario, login, renewToken } = require("../controllers/auth");
const {check} = require('express-validator');
const { validarCampos,  } = require("../middlewares/validar-campos");
const { validarJWT  } = require("../middlewares/validar-jwt");

// register
router.post("/new", 
[check("nombre", "El nombre es obligatorio").notEmpty(),
check("password", "La contrasena es obligatoria").notEmpty(), 
check("email", "Email es obligatorio").isEmail(), 
validarCampos],
crearUsuario);

// login
router.post("/",
[check("password", "La contrasena es obligatoria").notEmpty(), 
check("email", "Email es obligatorio").isEmail(),], login)

// renew jwt token
router.get("/renew",validarJWT, renewToken);

module.exports = router;