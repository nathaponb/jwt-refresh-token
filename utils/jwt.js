const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.JWT_PRIVATE_KEY;
const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_KEY;
const { conn } = require("../config/db");

function signAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      privateKey,
      { algorithm: "HS256", expiresIn: "10s" },
      function (err, token) {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
}

/**
 * @strToSign : a string typically name of authenticated user
 */
function signRefreshToken(strToSign) {
  const d = new Date().toLocaleString().replace(/[" "]/g, "");

  const hash = crypto
    .createHash("sha256")
    .update(`${strToSign}${d}`)
    .digest("hex");

  return hash;
}

function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          const e = new Error();
          e.message = "token expired";
          e.status = 401;
          reject(e);
        } else {
          reject(err);
        }
      } else {
        resolve(decoded);
      }
    });
  });
}

//* temporarily store in memory, use database in production.
function verifyRefreshToken(claimToken) {
  return new Promise((resolve, reject) => {
    conn(`SELECT * FROM jwts WHERE token = '${claimToken}'`, (err, result) => {
      if (err) {
        throw err;
      }
      if (!result) {
        return res.status(403).json({
          auth_code: 0,
          data: null,
          message: "invalid_grant! invalid refresh",
        });
      }
    });
    if (!dbToken) {
    }
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
