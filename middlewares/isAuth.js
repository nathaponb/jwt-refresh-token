const { verifyAccessToken } = require("../utils/jwt");

module.exports = async function (req, res, next) {
  const bearerToken = req.header("authorization");
  if (!bearerToken) {
    res.status(401).json("Unauthorized");
  }
  const claimtoken = bearerToken.split(" ");
  if (!claimtoken[1]) {
    res.status(401).json("Unauthorized");
  }
  try {
    const verifiedtoken = await verifyAccessToken(claimtoken[1]);
    req.isAuth = true;
    next();
  } catch (err) {
    next(err);
  }
};
