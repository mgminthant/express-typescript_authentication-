var express = require("express");
const user = require("../Controller/UserController");

var app = express();
var router = express.Router();

router.get("/profile", user.getProfile);

module.exports = router;
