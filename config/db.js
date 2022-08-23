const mysql = require("mysql");
require("dotenv").config();

//* Promisify connection
const conn = (sql) => {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    connection.query(sql, (err, row) => {
      if (err) {
        connection.end();
        reject(err);
      } else {
        connection.end();
        resolve(row);
      }
    });
  });
};

module.exports.conn = conn;
