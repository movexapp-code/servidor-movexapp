const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

// Opciones recomendadas para evitar advertencias
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URL, options)
    .then(() => {
        console.log("La conexión a la base de datos es correcta");

        const PORT = process.env.PORT || 8082;
        app.listen(PORT, () => {
            console.log("#####################");
            console.log("##### API REST #####");
            console.log("#####################");
            console.log("PORT: " + PORT);
        });
    })
    .catch(err => {
        console.error("Error al conectar a la base de datos:", err);
    });
