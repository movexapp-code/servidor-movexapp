const dotenv = require("dotenv");
dotenv.config();

//middleware que verifica si el usuário está autenticado
function asureAuth(req, res, next) {
  const token = req.headers.authorization;
  //console.log(token);
  if (!token) {
    return res
      .status(404)
      .json({ message: "No hay token de autorizacion", ok: false });
  }

  try {
    const tokenEnv = process.env.TOKEN;
    if (token !== tokenEnv) {
      return res.status(404).send({ message: "Token invalido", ok: false });
    } else {
      next();
    }
  } catch (error) {
    return res.status(404).send({ message: "Token invalido", ok: false });
  }
}

const tokenClient = (req, res, next) => {
  const token_client = req.headers.authorization;
  if (!token_client) {
    return res
      .status(404)
      .send({ message: "No hay token de autorizacion", ok: false });
  }
  next();
};

const tokTom = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(403)
      .json({ message: "No hay token de autorizacion", ok: false });
  } else if (token !== process.env.TOKEN_TOM) {
    return res.status(404).send({ message: "Token invalido", ok: false });
  }
  next();
};

module.exports = {
  asureAuth,
  tokenClient,
  tokTom,
};
