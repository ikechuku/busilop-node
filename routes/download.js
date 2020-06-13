const express = require("express");
const router = express.Router();
const socket = require("socket.io");
var http = require("http");
const io = require("../bin/www");
// var server = http.createServer(app);
// const io = socketIo(server); // < Interesting!
let interval;

router.get("/", (req, res) => {
  res.download(
    "./output/target/ninja-0.0.1-SNAPSHOT.jar",
    "ninja-0.0.1-SNAPSHOT.jar",
    (err) => {
      if (err) {
        console.log("Failed download");

        return;
      } else {
        //do something
        console.log("Downloaded from endpoint");
        res.send({ response: "Downloaded complete" }).status(200);
      }
    }
  );
});

module.exports = router;
