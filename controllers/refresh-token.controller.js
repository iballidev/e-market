const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const handleRefreshToken = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;


  /**Check data base for user refreshToken and compare */

  /** */

  /**Verify refreshToken and assign new accessToken */
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        email: decode.email,
        userId: decode._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "New access token!!!",
      token: accessToken,
    });
  });
};

module.exports = { handleRefreshToken };
