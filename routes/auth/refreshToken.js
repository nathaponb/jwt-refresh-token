const router = require("express").Router();
const { signAccessToken } = require("../../utils/jwt");
const { conn } = require("../../config/db");

/*+ 
 * There are possibly 3 cases
 * 
 * 1. There is no refresh token
 *    ---> re-authentication
 * 2. There is a refresh-token & it's expired
 *    ---> re-authentication, delete refresh token from DB
 * 3. There is a refresh-token & it isn't expire yet
 *    ---> generate new access token
 +*/

router.get("/", async (req, res, next) => {
  const { refreshToken } = req.cookies;

  //* If there is no claim token from client
  if (!refreshToken) {
    return res.status(403).json({
      auth_code: 0,
      data: null,
      message: "invalid_grant: No refresh token!",
    });
  }

  //* Technically if a refresh token stored in Cookie expired it will be automatically removed,
  //* but just in case, it is stolen and someone try to impersonate the user

  try {
    //* check if the claim token exist in DB
    const dbToken = await conn(
      `SELECT * FROM testjwts WHERE token = '${refreshToken}'`
    );

    if (!dbToken.length) {
      return res.status(403).json({
        auth_code: 0,
        data: null,
        message: "invalid_grant: Provided token is invalid!",
      });
    }

    //* check if claim token still valid
    const isValidToken = await conn(
      `select * from testjwts where token = '${refreshToken}' and now() < valid_until`
    );

    //* if not remove it
    if (!isValidToken.length) {
      await conn(`delete from testjwts where token = '${refreshToken}'`);
      return res.status(403).json({
        auth_code: 0,
        data: null,
        message: "invalid_grant: Provided token is expired!",
      });
    }

    //* if it's valid, refresh a new the access token to user
    const newAccessToken = await signAccessToken("nathapon");
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
