const express = require("express");
const {  handleRefreshToken } = require("../controllers/refresh-token.controller");
const router = express.Router();


router.get('/', handleRefreshToken)

module.exports = { routes: router };
