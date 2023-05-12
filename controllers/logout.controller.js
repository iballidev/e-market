
const handleLogout = (req, res, next) => {
    // On the client side, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //"successful(204): successful with No content to send back"
  console.log("cookies.jwt: ", cookies.jwt);
  const refreshToken = cookies.jwt;

  /**Check data base for user refresh token */

  /** */

  
  // Delete refreshToken in db
  /**
   *     res.clearCookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          });
          res.status(204).json({
            message: "Logout successful!!!",
          });
   */
  // ...
};

module.exports = { handleLogout };
