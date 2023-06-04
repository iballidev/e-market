const dotenv = require("dotenv");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

dotenv.config();

const verifyJWT = async (req, res, next) => {
  console.log("my session: ", req.session.accessToken);
  if (!req.session.accessToken) return res.redirect("/auth");
  const authHeader = req.session.accessToken; //Bearer token

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log("err: ", err);

    // if (err || !decoded) return res.sendStatus(403);

    if (err || !decoded) return res.redirect("/auth"); //"forbidden(403): Invalid token, redirect to login"

    console.log("veryfyToken decoded: ", decoded);
    req.user = decoded.userInfo.email;
    req.userId = decoded.userInfo._id;
    req.roles = decoded.userInfo.roles;
    req.session.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
