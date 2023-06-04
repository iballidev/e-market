const User = require("../models/user.model");

exports.get_user_account_view = async (req, res, next) => {
  const user = req.session.user;
  // console.log("user::: ", user);
  const userId = req.params.userId;
  // console.log("userId: ", userId);
  const list = await User.find().exec();
  res.render("user-account", {
    user,
  });
};

exports.get_user = async (req, res, next) => {
  const user = req.session.user;
  console.log("loggedin user: ", user);
  //   const list = await Customer.find().exec();
  if (user) {
    console.log("loggedin user: ", true);
    return res.status(200).json({
      user: user,
    });
  }
  console.log("loggedin user: ", false);
  console.log("loggedin user: ", false);
  return res.status(500).json({
    user: null,
    message: "no data found"
  });
};
