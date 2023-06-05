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

exports.login_user_old = (req, res) => {
  const plaintextPassword = req.body.password;
  const email = req.body.email;

  if (!plaintextPassword || !email) {
    return res.render("login-user", {
      ...data,
      errorMessage: "Email/password is required",
    });
  }

  User.find({ email })
    .exec()
    .then((user) => {
      console.log("user login: ", user);
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
          console.log("user from db: ", user);
          console.log("user.refreshToken from db: ", user[0].refreshToken);
          user[0].refreshToken = refreshToken;
          console.log("user from db updated: ", user);
          // const result = user[0].save();
          console.log("user: ", user);

          user[0]
            .save()
            .then((result) => {
              console.log("result***: ", result);
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

exports.login_user = (req, res) => {
  const plaintextPassword = req.body.password;
  const email = req.body.email;

  if (!plaintextPassword || !email) {
    return res.render("login-user", {
      ...data,
      errorMessage: "Email/password is required",
    });
  }

  User.find({ email })
    .exec()
    .then((user) => {
      console.log("user login: ", user);
      if (user.length < 1) {
        res.render("login-user", {
          ...data,
          errorMessage: "Auth failed!",
        });
        return;
      }

      bcrypt
        .compare(
          plaintextPassword,
          user[0].password

          /**OPTION ONE */
          //   , (err, response) => {
          //   console.log("err, response: ", err, response);
          //   if (err) {
          //     console.log("Error: ", err);
          //     return res.status(401).json({
          //       message: "Auth failed",
          //     });
          //   }
          //   if (response) {
          //     console.log("success!!!");
          //     let accessToken = jwt.sign(
          //       {
          //         userInfo: {
          //           email: user[0]?.email,
          //           userId: user[0]?._id,
          //           roles: user[0]?.roles,
          //         },
          //       },
          //       process.env.ACCESS_TOKEN_SECRET,
          //       { expiresIn: "30s" }
          //       // { expiresIn: "1h" }
          //       // { expiresIn: "0.001h" }
          //     );
          //     /** Write(save) new access token inside the 'client-access-token.txt' file */
          //     fs.writeFile(
          //       path.join(__dirname, "../config", "client-access-token.txt"),
          //       `Bearer ${accessToken}`,
          //       (err) => {
          //         if (err) throw err;
          //       }
          //     );
          //     let refreshToken = jwt.sign(
          //       {
          //         email: user[0].email,
          //         userId: user[0]._id,
          //       },
          //       process.env.REFRESH_TOKEN_SECRET,
          //       { expiresIn: "1d" }
          //     );

          //     // Save refreshToken in db
          //     user[0].refreshToken = refreshToken;
          //     user[0].save();

          //     res.cookie("jwt", refreshToken, {
          //       httpOnly: true,
          //       sameSite: "None",
          //       secure: false,
          //       maxAge: 24 * 60 * 60 * 1000,
          //     });
          //     res.redirect("/user-account/profile");
          //     // res.sendStatus(200);
          //   }
          //   res.render("login-user", {
          //     ...data,
          //     errorMessage: "Auth failed!",
          //   });
          //   // res.status(500).json({
          //   //   message: "Something went wrong!",
          //   // });
          //   return;
          // }
        )

        /**OPTION TWO */
        .then((result) => {
          if (result) {
            let accessToken = jwt.sign(
              {
                userInfo: {
                  email: user[0]?.email,
                  userId: user[0]?._id,
                  roles: user[0]?.roles,
                },
              },
              process.env.ACCESS_TOKEN_SECRET,
              // { expiresIn: "15s" }
              { expiresIn: "1h" }
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
            /** Store(save) new access token inside the seesion */
            req.session.accessToken = `Bearer ${accessToken}`;

            let refreshToken = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
              },
              process.env.REFRESH_TOKEN_SECRET,
              // { expiresIn: "20s" }
              { expiresIn: "1d" }
            );

            // Save refreshToken in db
            user[0].refreshToken = refreshToken;
            user[0].save();

            res.cookie("jwt", refreshToken, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            // req.session.jwt = refreshToken

            res.redirect("/user-account/profile");

            // res.json({ accessToken });
            // res.status(200).json({
            //   message: "Auth successful!!!",
            //   token: accessToken,
            // });

            return;
          }
          res.render("login-user", {
            ...data,
            errorMessage: "Auth failed!",
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

/** */
