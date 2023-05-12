const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayoutes = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const config = require("./startup/config");
const winston = require("winston");
const cookieParser = require("cookie-parser");
const err = require("./middleware/errors");
const app = express();

/**ROUTES */
const signupRoutes = require("./routes/signup.routes");
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const refreshTokenRoutes = require("./routes/refresh-token.routes");
const logoutRoutes = require("./routes/logout.routes");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/cors-options");

require("./startup/db")();
require("./startup/logging")();
require("./startup/validations")();

app.use(expressLayoutes);
app.set("view engine", "ejs");

/**Built-in middleware to handle urlencoded form data */
app.use(express.urlencoded({ extended: true }));

/**Handle options credentials check - before CORS!
 * and fetch cookies credentials requirement
 */ app.use(credentials);


 /**Cross Origin Resource Sharing */
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**We can import like this: app.use(signupRoutes);
 * OR like this: app.use(signupRoutes.routes);
 */
app.use("/signup", signupRoutes.routes);
app.use("/auth", authRoutes.routes);
app.use("/refresh-token", refreshTokenRoutes.routes);
app.use("/rlogout", logoutRoutes.routes);
app.use("/customers", customerRoutes.routes);
app.use(err);

app.listen(config.port, () =>
  winston.info("App is listening on url http://localhost:" + config.port)
);
