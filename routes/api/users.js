const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { query } = require("express");

//config
const usersDatabasePath = "./data/users.db";
const xorEncriptionKeyPath = "./data/xorEncriptionKey.txt";

let router = require("express").Router();

let xorEncript = (data, key) => {
  if (key.length == 0) return data;
  let result = [];
  for (let index = 0; index < data.length; index++) {
    result.push(data.charCodeAt(index) ^ key.charCodeAt(index % key.length));
  }
  return result;
};

router.post("/", (req, res) => {
  res.json("ready");
});

router.post("/requestUserCreation", (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  if (username == undefined || password == undefined || email == undefined) {
    res.status(400).json("Username, Email or password not defined");
    return;
  }
  let db = new sqlite3.Database(
    usersDatabasePath,
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        res.json(err);
      } else {
        fs.readFile(xorEncriptionKeyPath, (err, data) => {
          if (err) {
            res.json("Can't open encriptionKey file");
          } else {
            let key = data.toString();
            password = xorEncript(password, key);
            let creationRequestCode = uuidv4();
            let query =
              "INSERT INTO UserCreationRequests" +
              "(creationRequestCode, userName, email, passwordXorEncripted, requestStatus)" +
              "VALUES(?,?,?,?,?);";
            let parameters = [
              creationRequestCode,
              username,
              email,
              password,
              1,
            ];
            db.run(query, parameters, (err) => {
              if (err) {
                res.json(err);
              } else {
                res.json(creationRequestCode);
              }
              db.close();
            });
          }
        });
      }
    }
  );
});

router.get("/getUserCreationStatus/:creationRequestCode", (req, res) => {
  let db = new sqlite3.Database(
    usersDatabasePath,
    sqlite3.OPEN_READONLY,
    (err) => {
      if (err) {
        res.json(err);
      } else {
        let query =
          "SELECT * FROM UserCreationRequests WHERE creationRequestCode = ?;";
        parameters = [req.params.creationRequestCode];
        //res.json(req.params);
        db.all(query, parameters, (err, rows) => {
          if (err) {
            res.json(err);
          } else {
            if (rows.length > 0) {
              res.json(rows);
            } else {
              res.status(404).json("Request not found");
            }
          }
          db.close();
        });
      }
    }
  );
});

module.exports = router;
