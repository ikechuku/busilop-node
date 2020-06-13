var express = require("express");
var router = express.Router();
var fs = require("fs");
var Promise = require("bluebird");
var cmd = require("node-cmd");
var server = require("../bin/www");
const jdlService = require("../services/jdl-service");
const cmdService = require("../services/cmd-service");

router.post("/", async function (req, res, err) {
  console.log(req.body);

  server.io.emit("loadingService", "Writing yo-rc.son file");

  res.send({ response: "emit complete" }).status(200);
});

module.exports = router;
