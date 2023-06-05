const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayoutes = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const config = require("./startup/config");
const winston = require("winston");
const cookieParser = require("cookie-parser");
// var session = require("express-session");
var cookieSession = require("cookie-session");
const err = require("./middleware/errors");
const app = express();

/**ROUTES */
const signupRoutes = require("./routes/signup.routes");
const authRoutes = require("./routes/auth.routes");
const userAccountRoutes = require("./routes/user-account.routes");
const refreshTokenRoutes = require("./routes/refresh-token.routes");
const logoutRoutes = require("./routes/logout.routes");
const customerRoutes = require("./routes/customer.routes");
const userRoutes = require("./routes/user.routes");

const credentials = require("./middleware/credentials");
const corsOptions = require("./config/cors-options");
const verifyJWT = require("./middleware/veryfyJWT");
const {
  handleRefreshToken,
} = require("./controllers/refresh-token.controller");

require("./startup/db")();
require("./startup/logging")();
require("./startup/validations")();

app.set("view engine", "ejs");
app.use(expressLayoutes);

/**Built-in middleware to handle urlencoded form data */
app.use(express.urlencoded({ extended: true }));

/**Handle options credentials check - before CORS!
 * and fetch cookies credentials requirement
 */ app.use(credentials);

/**Cross Origin Resource Sharing */
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: [
      /* secret keys */
      "hello",
    ],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(express.static(path.join(__dirname, "public")));

/**We can import like this: app.use(signupRoutes);
 * OR like this: app.use(signupRoutes.routes);
 */
app.use(function (req, res, next) {
  console.log("req.locals sessions: ", req.session);
  console.log("req.locals cookie.jwt: ", req.cookies.jwt);
  if (req.session.user) {
    res.locals.isAuthenticated = req.session.user;
    console.log("res.locals 1: ", res.locals.isAuthenticated);
  } else {
    res.locals.isAuthenticated = null;
    console.log("res.locals 2: ", res.locals.isAuthenticated);
    // res.locals.isAuthenticated = req.isAuthenticated();
  }
  next();
});

app.use("/signup", signupRoutes.routes);
app.use("/auth", authRoutes.routes);
app.use("/refresh-token", refreshTokenRoutes.routes);
app.use("/logout", logoutRoutes.routes);
app.use(verifyJWT);
app.use("/user-account", userAccountRoutes.routes);
app.use("/user-list", userRoutes.routes);
app.use("/customers", customerRoutes.routes);

app.use(err);

app.listen(config.port, () =>
  winston.info("App is listening on url http://localhost:" + config.port)
);
