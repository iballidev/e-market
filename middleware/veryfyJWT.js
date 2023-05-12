const dotenv = require("dotenv");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyJWT = (req, res, next) => {
  console.log("request headers: ", req.headers);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  console.log("*: " + authHeader); //Bearer token

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      console.log("decoded: ", decoded);
      if (err) return res.sendStatus(403); //"forbidden(403): Invalid token"
      req.user = decoded.username;
      next();
    }
  );
};

module.exports = verifyJWT;
