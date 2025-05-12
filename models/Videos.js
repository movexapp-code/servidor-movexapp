const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema(
  {
    url : String,
    descripcion: String,
    nombre: String,
  }
);

module.exports = mongoose.model("Video", VideoSchema);
