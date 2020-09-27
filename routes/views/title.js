let router = require("express").Router();

router.get("/:currentYear/:titleCode", (req, res) => {
  res.render("title", {
    titleCode: req.params.titleCode,
    currentYear: req.params.currentYear,
  });
});

module.exports = router;
