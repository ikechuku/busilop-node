// var runner = require("yeoman-gen-run");
var express = require("express");
var router = express.Router();
// var cmd = require('node-cmd');
var fs = require('fs');
var cmd = require('node-cmd')


router.post("/", function (req, res, err) {

  let data = req.body
  console.log(data)
  if (err) {
    console.log(err);

  }
  res.status(200).send()

  

});

module.exports = router;

