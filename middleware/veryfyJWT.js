const dotenv = require("dotenv");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

dotenv.config();

const verifyJWT = async (req, res, next) => {
  /**reading the access token from the client-access-token.txt file */
  await fs.readFile(
    path.join(__dirname, "../config", "client-access-token.txt"),
    "utf-8",
    (err, data) => {
      if (!data) return null;
      const authHeader = data; //Bearer token

      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err || !decoded) return res.redirect("/auth"); //"forbidden(403): Invalid token, redirect to login"
        req.user = decoded.userInfo.username;
        req.roles = decoded.userInfo.roles;
        next();
      });
      if (err) throw err;
    }
  );
};

module.exports = verifyJWT;
