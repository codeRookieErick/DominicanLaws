const express = require("express");
const sqlite3 = require("sqlite3").verbose();

let router = express.Router();
let databasePath = "./data/database.db";

router.get("/:sectionCode?", (req, res) => {
  let db = undefined;
  db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Error!");
    } else {
      let query = "select * from VW_Secciones;";
      let params = [];
      if (req.params.sectionCode !== undefined) {
        query = "select * from VW_Secciones where codigoSeccion = ?;";
        params = [req.params.sectionCode];
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

router.get("/:sectionCode/articles", (req, res) => {
  let db = undefined;
  db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Fail");
    } else {
      let query = "select * from articulos where codigoSeccion = ?;";
      params = [req.params.sectionCode];
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
