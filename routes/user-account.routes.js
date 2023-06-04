const express = require("express");
const router = express.Router();
const { get_user_account_view, get_user} = require("../controllers/user-account.controller");

router.get("/", get_user_account_view);
router.get("/user", get_user);
router.get("/:userId", get_user_account_view);

module.exports = {
  routes: router,
};
