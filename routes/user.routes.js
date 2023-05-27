const express = require("express");
const { get_all_users_view } = require("../controllers/user.controller");
const router = express.Router();


router.get('/', get_all_users_view)

module.exports = {
  routes: router,
};
