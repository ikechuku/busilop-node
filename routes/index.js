var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  var list = ["item1", "item2", "item3"];
  res.json(list);
  // res.render("index", { title: "Express", list });
});

module.exports = router;
