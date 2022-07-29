const router = require("express").Router();
const isAuth = require("../../middlewares/isAuth");

router.get("/", isAuth, (req, res, next) => {
  res.status(200).json({
    auth_code: 2,
    message: "authorized",
    data: {
      type: "feline",
      breed: "Siamese",
      age: 1,
      origin: "Siam/Thailand",
    },
  });
});

module.exports = router;
