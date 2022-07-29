const router = require("express").Router();
const { verifyRefreshToken, signAccessToken } = require("../../utils/jwt");

router.get("/", async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({
      auth_code: 0,
      data: null,
      message: "invalid_grant! refresh token expired",
    });
  }

  const verifiedToken = verifyRefreshToken(refreshToken);

  console.log("DEBUG: hit refresh token route", refreshToken);

  // Generate new access token if refresh token exist and valid
  if (!verifiedToken) {
    return res.status(403).json({
      auth_code: 0,
      data: null,
      message: "invalid_grant! refresh token expired",
    });
  }
  try {
    const accessToken = await signAccessToken("nathapon");
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
