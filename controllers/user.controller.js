
const User = require("../models/signup.model");

exports.get_all_users_view = async (req, res) => {
  const userList = await User.find().exec();
  console.log("userList: ", userList)
  res.render("user-list", {
    userList: userList,
  });
};
