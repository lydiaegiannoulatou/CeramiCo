const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  let authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) return res.status(401).send({ msg: "Unauthorized User" });

  let clientToken = authHeader.split(" ")[1];
  console.log(clientToken);
  try {
    let decodedToken = jwt.verify(clientToken, process.env.SECRET_KEY);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).send(error, { msg: "Unauthorized User" });
  }
}

module.exports = authMiddleware;
