const router = require("express").Router();
const isAuth = require("../../middlewares/isAuth");

router.get("/", isAuth, (req, res, next) => {
  res.status(200).json({
    auth_code: 2,
    message: "authorized",
    data: {
      type: "canine",
      breed: "Border Collie",
      age: 2,
      origin: "Scotland",
    },
  });
});

module.exports = router;
