var express = require("express");
var router = express.Router();
const isAuth = require("../middlewares/isAuth");

/* GET home page. */
router.get("/", isAuth, function (req, res, next) {
  console.log("DEBUG: hit homepage");
  res.status(200).json("hello world!");
});

module.exports = router;
