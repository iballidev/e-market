const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");

dotenv.config();

const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;

  console.log("hello", cookies);
  console.log("hello jwt", cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  /**Check data base for user refreshToken and compare */
  const foundUser = await User.findOne({ refreshToken }).exec();
  console.log("foundUser: ", foundUser);
  if(!foundUser) return res.sendStatus(403); // forbidden
  /** */

  /**Verify refreshToken and assign new accessToken */
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email != decoded.email) return res.sendStatus(403); // forbidden
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

    /**save for server side */
    /** Write(save) new access token inside the 'client-access-token.txt' file */
    fs.writeFile(
      path.join(__dirname, "../config", "client-access-token.txt"),
      `Bearer ${accessToken}`,
      (err) => {
        res.redirect("/user-account");
        if (err) throw err;
      }
    );
  });
};

module.exports = { handleRefreshToken };
