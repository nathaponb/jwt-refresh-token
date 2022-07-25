const router = require("express").Router();
const isAuth = require("../../middlewares/isAuth");

router.get("/", isAuth, (req, res, next) => {
  res.status(200).json({ data: "hi there :)" });
});

module.exports = router;
