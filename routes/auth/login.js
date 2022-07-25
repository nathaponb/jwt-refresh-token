const router = require("express").Router();
const { signAccessToken } = require("../../utils/jwt");

const mockupDatabase = {
  username: "nathapon",
  password: "1234",
};

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!username && !password) {
    return res.status(400).json("Bad request!");
  }

  if (username !== mockupDatabase.username) {
    return res.status(401).json("Invalid Username!");
  }
  if (password !== mockupDatabase.password) {
    return res.status(401).json("Invalid Password!");
  }

  try {
    const token = await signAccessToken(username);
    res.status(200).json({
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
