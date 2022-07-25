const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.JWT_PRIVATE_KEY;

function signAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      privateKey,
      { algorithm: "HS256", expiresIn: "1m" },
      function (err, token) {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
}

function signRefreshToken() {}

function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        const e = new Error();
        e.status = 401;
        e.message = "Token expired!";

        reject(e);
      } else {
        resolve(decoded);
      }
    });
  });
}

function verifyRefreshToken() {}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
