const User = require("../models/user.model");
exports.get_user_account_view = async (req, res, next) => {
  const userId = req.params.userId;
  console.log("userId: ", userId);
  const list = await User.find().exec();
  res.render("user-account", {
    // customers: list,
  });
};
exports.get_user_account = async (req, res, next) => {
  //   const list = await Customer.find().exec();
  res.render("user-account", {
    // customers: list,
  });
};
