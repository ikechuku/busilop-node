var express = require("express");
var router = express.Router();

/* GET Tripetto Data */
router.get("/", function(req, res, next) {
  res.send("Get Data from Tripetto form");
});

router.post("/", function(req, res, next) {
  console.log(req.body);

  res.send({
    data: req.body
  });
});

module.exports = router;
