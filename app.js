const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./Routes/auth.routes");
const cookieParser = require("cookie-parser");

/* rutas */
const administradorRoutes = require("./Routes/Administrador.routes");
const usuarioRoutes = require("./Routes/Usuario.routes");
const archivosRoutes = require("./Routes/Archivos.routes");
const formularioRoutes = require("./Routes/formulario.routes");
const videoRoutes = require("./Routes/video.routes");

const app = express();
const dotenv = require("dotenv");

dotenv.config();

// Settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(express.static(__dirname + "/uploads"));

// Routes

app.use("/auth", auth);
app.use("/admin", administradorRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/archivos", archivosRoutes);
app.use("/formulario", formularioRoutes);
app.use("/videos", videoRoutes);

module.exports = app;
