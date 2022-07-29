const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.JWT_PRIVATE_KEY;
const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_KEY;

// Securely store it in db.
var refreshToken;

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
  // return new Promise(function (resolve, reject) {
  const d = new Date().toLocaleString().replace(/[" "]/g, "");

  const hash = crypto
    .createHash("sha256")
    .update(`${strToSign}${d}`)
    .digest("hex");

  refreshToken = hash;
  // fs.writeFileSync(`/tmp/${strToSign}.txt`, hash);

  return hash;
  // });
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

function verifyRefreshToken(token) {
  if (token === refreshToken) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
