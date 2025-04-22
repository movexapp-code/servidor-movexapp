const bcrypt = require("bcrypt-nodejs");
const User = require("../models/User");
const {
  createRefreshToken,
  createToken,
  decodedToken,
} = require("../utils/jwt");

const register = async (req, res) => {
  const { password, repeatPassword, email, name, lastname } = req.body;
  const user = new User();

  const emailExist = await User.findOne({ email: email.toLowerCase() });

  if (emailExist) res.status(404).send({ message: "El email ya existe" });
  else {
    if (!password || !repeatPassword) {
      res.status(404).send({ message: "Las contraseñas son obligatorias" });
    } else {
      if (password !== repeatPassword) {
        res
          .status(404)
          .send({ message: "Las contraseñas tienen que ser iguales" });
      } else {
        bcrypt.hash(password, null, null, (err, hash) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al encriptar la contraseña" });
          } else {
            user.password = hash;
            user.save((err, userStored) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: err });
              } else {
                if (!userStored) {
                  res
                    .status(404)
                    .send({ message: "Error al crear el usuario" });
                } else {
                  res.status(200).send({ userStored });
                }
              }
            });
          }
        });
      }
    }
  }
};

const login = (req, res) => {
  const { email, password } = req.body;


};



//exportamos
module.exports = {
  register,
  login
};
