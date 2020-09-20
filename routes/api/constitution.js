const sqlite3 = require("sqlite3").verbose();

let constitutionDatabases = {
  1994: "./data/constitucion_1994.db",
  2002: "./data/constitucion_2002.db",
  2010: "./data/constitucion_2010.db",
  2015: "./data/constitucion_2015.db",
};

let router = require("express").Router();

router.get("/", (req, res) => res.json("Ok"));

///Chapters router
router.get("/:year/chapters/:chapterCode?", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
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

router.get("/:year/chapters/:chapterCode/sections", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
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

router.get("/:year/chapters/:chapterCode/articles", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
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

router.get("/:year/sections/:sectionCode?", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
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

router.get("/:year/sections/:sectionCode/articles", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
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

router.get("/:year/titles/:titleCode?", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
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

router.get("/:year/titles/:titleCode/chapters", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
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

router.get("/:year/titles/:titleCode/articles", (req, res) => {
  let year = parseInt(req.params.year);
  if (!(year in constitutionDatabases)) {
    res.status(404).json("Year not found");
    return;
  }
  databasePath = constitutionDatabases[year];
  let db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (err) => {
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
