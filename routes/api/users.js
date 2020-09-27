const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { query } = require("express");
const createHash = require("crypto").createHash;
const { json } = require("body-parser");
const { Database } = require("sqlite3");
const e = require("express");
//config
const usersDatabasePath = "./data/users.db";
const xorEncriptionKeyPath = "./data/xorEncriptionKey.txt";

let tokensTimeToLive = 300;

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

router.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username == undefined || password == undefined) {
    res.status(400).json("Username or password not found");
    return;
  }
  let db = new sqlite3.Database(
    usersDatabasePath,
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        let query = `
          SELECT id, passwordExtraCode, passwordHash, userName, email
          FROM Users
          WHERE userName = ?
          LIMIT 1;
        `;
        db.all(query, [username], (err, rows) => {
          if (err) {
            res.status(500).json(err);
          } else {
            if (json.length == 0) {
              res.status(404).json("Username or password not found");
            } else {
              let userData = rows[0];
              let passwordHash = createHash("md5")
                .update(password + userData.passwordExtraCode)
                .digest("hex")
                .toUpperCase();
              if (passwordHash == userData.passwordHash) {
                let expiration = parseInt(Date.now() / 1000) + tokensTimeToLive;
                let token = uuidv4().substring(0, 8).toUpperCase();
                let query = `
                  INSERT INTO Tokens (idUsuario, token, expiration)
                  VALUES (?, ?, ?);
                `;
                let parameters = [userData.id, token, expiration];
                db.run(query, parameters, (err) => {
                  if (err) {
                    res.status(500).json("Error creating the login token.");
                  } else {
                    res.json({
                      id: userData.id,
                      userName: userData.userName,
                      email: userData.email,
                      token: token,
                      expiration: expiration,
                    });
                  }
                });
                userData.expiration = expiration;
                userData.token = token;
              } else {
                res.status(404).json("Username or password not found.");
              }
            }
          }
          db.close();
        });
      }
    }
  );
});

router.post("/keepTokenAlive", (req, res) => {
  let token = req.body.token;
  let userId = req.body.userId;
  if (token == undefined || userId == undefined) {
    res.status(302).json("Token or userId not defined");
  }
  let db = new Database(usersDatabasePath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      res.status(500).json("Database error.");
    } else {
      let expiration = parseInt(Date.now() / 1000) + tokensTimeToLive;
      let query = `
        UPDATE Tokens 
        SET expiration = ?
        WHERE 
          idUsuario = ?
          AND token = ?; 
      `;
      let parameters = [expiration, userId, token];
      db.run(query, parameters, function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          if (this.changes > 0) {
            res.json({
              token: token,
              userId: userId,
              expiration: expiration,
            });
          } else {
            res.status(404).json(`Token ${token} not found.`);
          }
        }
      });
      db.close();
    }
  });
});

module.exports = router;
