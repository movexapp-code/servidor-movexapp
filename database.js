const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Conexión exitosa a la base de datos");

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
      console.log("#####################");
      console.log("##### API REST #####");
      console.log("#####################");
      console.log("PORT:", PORT);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a la base de datos:", err);
  });
