const Router = require("express");
//importamos el controlador
const {
  register,
  login,
  refreshToken,
} = require("../controllers/auth.controller");

const router = Router();

//rutas de la api
router.post("/register", register);
router.post("/login", login);

module.exports = router;
