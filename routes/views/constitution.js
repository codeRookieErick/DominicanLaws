let router = require("express").Router();

router.get("/:year?", (req, res) => {
  res.render("constitution", {
    title: "Constitucion Dominicana",
  });
});
module.exports = router;
