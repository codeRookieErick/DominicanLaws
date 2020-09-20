const express = require("express");
const sqlite3 = require("sqlite3").verbose();

let router = express.Router();
let databasePath = "./data/database.db";

router.get("/:titleCode?", (req, res) => {
  let db = undefined;
  db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Error!");
    } else {
      let query = "select * from Titulos;";
      let params = [];
      if (req.params.titleCode !== undefined) {
        query = "select * from Titulos where codigoTitulo = ?;";
        params = [req.params.titleCode];
      }
      db.all(query, params, (err, rows) => {
        if (err) {
          res.json("Error reading!");
        } else {
          res.json(rows);
        }
        db.close((err) => {});
      });
    }
  });
});

router.get("/:titleCode/chapters", (req, res) => {
  let db = undefined;
  db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Fail");
    } else {
      let query = "select * from vw_Capitulos where codigoTitulo = ?;";
      params = [req.params.titleCode];
      db.all(query, params, (err, rows) => {
        if (err) {
          res.json("Error");
        } else {
          res.json(rows);
        }
        db.close();
      });
    }
  });
});

router.get("/:titleCode/articles", (req, res) => {
  let db = undefined;
  db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Fail");
    } else {
      let query = "select * from articulos where codigoTitulo = ?;";
      params = [req.params.titleCode];
      db.all(query, params, (err, rows) => {
        if (err) {
          res.json("Error");
        } else {
          res.json(rows);
        }
        db.close();
      });
    }
  });
});

module.exports = router;
