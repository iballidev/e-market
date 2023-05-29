const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");

dotenv.config();

var data = {
  successMessage: "",
  errorMessage: "",
};

exports.login_user_view = (req, res) => {
  res.render("login-user", {
    ...data,
  });
};

exports.login_user = (req, res) => {
  const plaintextPassword = req.body.password;

  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        // res.status(401).json({
        //   message: "Auth failed!",
        // });
        res.render("login-user", {
          ...data,
          errorMessage: "Auth failed!",
        });
        return;
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
            { expiresIn: "30s" }
            // { expiresIn: "1h" }
            // { expiresIn: "0.001h" }
          );
          /** Write(save) new access token inside the 'client-access-token.txt' file */
          fs.writeFile(
            path.join(__dirname, "../config", "client-access-token.txt"),
            `Bearer ${accessToken}`,
            (err) => {
              if (err) throw err;
            }
          );
          let refreshToken = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          // Save refreshToken in db

          user.refreshToken = refreshToken;
          // const result = user[0].save();
          console.log("user: ", user);

          user[0]
            .save()
            .then((result) => {
              console.log("result: ", result);
            })
            .catch((err) => {
              console.log("Error: ", err);
            });

          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          });
          // res.redirect("/user-account/profile");

          res.json({ accessToken });
          // res.status(200).json({
          //   message: "Auth successful!!!",
          //   token: accessToken,
          // });
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
