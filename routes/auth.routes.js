const express = require("express");
const { login_user_view, login_user } = require("../controllers/auth.controller");
const router = express.Router();


router.get('/', login_user_view)
router.post('/', login_user)

module.exports = { routes: router };
