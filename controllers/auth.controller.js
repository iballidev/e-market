const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/signup.model");

const dotenv = require("dotenv");

dotenv.config();

exports.login_user_view = (req, res) => {
  res.render("login-user", {
    successMessage: "test",
  });
};

exports.login_user = (req, res) => {
  const plaintextPassword = req.body.password;

  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }

      bcrypt
        .compare(plaintextPassword, user[0].password)
        .then(() => {
          let accessToken = jwt.sign(
            {
              userInfo: {
                email: user[0]?.email,
                userId: user[0]?._id,
                roles: user[0]?.roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
            // { expiresIn: "1h" }
            // { expiresIn: "0.001h" }
          );
          let refreshToken = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.status(200).json({
            message: "Auth successful!!!",
            token: accessToken,
          });
        })
        .catch((err) => {
          console.log("Error: ", err);
          res.status(500).json({
            message: "Something went wrong!",
          });
        });
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
};
