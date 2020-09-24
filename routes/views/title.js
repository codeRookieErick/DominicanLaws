let router = require("express").Router();

router.get("/:titleCode", (req, res) => {
  let titleCode = req.params.titleCode;
  res.render("title", { titleCode: titleCode });
});

module.exports = router;
