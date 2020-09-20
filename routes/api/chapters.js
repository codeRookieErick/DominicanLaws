const sqlite3 = require("sqlite3").verbose();

let router = require("express").Router();
let databasePath = "./data/database.db";

router.get("/:chapterCode?", (req, res) => {
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Error reading");
    } else {
      let query = "select * from vw_Capitulos;";
      let params = [];
      if (req.params.chapterCode !== undefined) {
        query = "select * from vw_Capitulos where codigoCapitulo = ?;";
        params = [req.params.chapterCode];
      }
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

router.get("/:chapterCode?/sections", (req, res) => {
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Error reading");
    } else {
      let query = "select * from vw_Secciones where codigoCapitulo = ?;";
      let params = [req.params.chapterCode];
      db.all(query, params, (err, rows) => {
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
        db.close();
      });
    }
  });
});

router.get("/:chapterCode?/articles", (req, res) => {
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      res.json("Error reading");
    } else {
      let query = "select * from articulos where codigoCapitulo = ?;";
      let params = [req.params.chapterCode];
      db.all(query, params, (err, rows) => {
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
        db.close();
      });
    }
  });
});

module.exports = router;
