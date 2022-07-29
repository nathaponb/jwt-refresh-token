const { response } = require("express");
const { verifyAccessToken } = require("../utils/jwt");

module.exports = async function (req, res, next) {
  const bearerToken = req.header("authorization");
  if (!bearerToken) {
    return res
      .status(400)
      .json({ auth_code: 1, message: "ERROR: No token provided!", data: null });
  }
  const claimToken = bearerToken.split(" ");
  if (!claimToken[1]) {
    return res
      .status(400)
      .json({ auth_code: 1, message: "ERROR: No token provided!", data: null });
  }
  try {
    await verifyAccessToken(claimToken[1]);
    req.isAuth = true;
    next();
  } catch (err) {
    next(err);
  }
};
