var express = require("express");

var authController = require("../Controller/AuthController");

var router = express.Router();
var app = express();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshToken);
router.get("/logout", authController.logout);

module.exports = router;
