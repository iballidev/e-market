const dotenv = require("dotenv");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");

dotenv.config();

const verifyJWT = async (req, res, next) => {
  /**reading the access token from the client-access-token.txt file */
  // await fs.readFile(
  //   path.join(__dirname, "../config", "client-access-token.txt"),
  //   "utf-8",
  //   (err, data) => {
  //     if (!data) return null;
  //     const authHeader = data; //Bearer token

  //     const token = authHeader.split(" ")[1];

  //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //       if (err || !decoded) return res.redirect("/auth"); //"forbidden(403): Invalid token, redirect to login"
  //       req.user = decoded.userInfo.username;
  //       req.roles = decoded.userInfo.roles;
  //       next();
  //     });
  //     if (err) throw err;
  //   }
  // );

  console.log("my session: ", req.session.accessToken);
  // if (!req.session.accessToken) return null;
  if (!req.session.accessToken) return res.redirect("/auth");
  const authHeader = req.session.accessToken; //Bearer token

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    console.log("err##: ", err);
    console.log("veryfyToken decoded: ", decoded);
    // if (err || !decoded) return res.redirect("/auth"); //"forbidden(403): Invalid token, redirect to login"
    // if (err || !decoded) return res.sendStatus(403);

    if (err || !decoded) {
      const cookies = req.cookies;
      console.log("cookies: ", cookies);

      const refreshToken = cookies.jwt;
      /**Check data base for user refresh token */
      const foundUser = await User.findOne({ refreshToken }).exec();
      console.log("foundUser: ", foundUser);
      if (!foundUser) {
        res.clearCookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        res.redirect("/auth");
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || foundUser.email != decoded.email)
            return res.sendStatus(403); // forbidden
          const accessToken = jwt.sign(
            {
              userInfo: {
                email: decoded.email,
                userId: decoded._id,
                roles: decoded?.roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
          );
          /**For api */
          // res.status(200).json({
          //   message: "New access token!!!",
          //   token: accessToken,
          // });

          /** Store(save) new access token inside the seesion */
          req.session.accessToken = `Bearer ${accessToken}`;
          console.log("new accessToken@@@@@@@@@@@@@: ", accessToken, " created!");
          // res.sendStatus(200);
        }
      );
      return;
    }

    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    req.session.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
