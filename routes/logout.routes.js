const express = require("express");
const { handleLogout } = require("../controllers/logout.controller");
const router = express.Router();


router.get('/', handleLogout)

module.exports = { routes: router };
