const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  let authHeader = req.headers.authorization;
    console.log("authHeader",authHeader);
  if (!authHeader) return res.status(401).send({ msg: "Unauthorized User" });

  let clientToken = authHeader.split(" ")[1];
  // console.log(clientToken);
  try {
    let decodedToken = jwt.verify(clientToken, process.env.SECRET_KEY);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ msg: "Unauthorized User", error: error.message });

  }
}

function adminAccess(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).send({ msg: "Only admin users can access" });
  }
}

module.exports = { authMiddleware, adminAccess };