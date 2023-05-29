const express = require("express");
const router = express.Router();
const { get_user_account_view, get_user_account } = require("../controllers/user-account.controller");
3
router.get("/", get_user_account_view);
router.get("/:userId", get_user_account_view);

module.exports = {
  routes: router,
};
