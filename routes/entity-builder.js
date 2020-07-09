const express = require("express");
const router = express.Router();
const fs = require("fs");
const Promise = require("bluebird");
const cmd = require("node-cmd");
const server = require("../bin/www");
const uuid = require("uuid");
const jdlService = require("../services/jdl-service");
const cmdService = require("../services/cmd-service");

router.post("/", async function (req, res, err) {
  const schema = req.body["store"].form["components"];
  const config = req.body["store"].config;

  // Write form to Template
  // fs.readFile("form.txt".toString(), "utf8", function (err, data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   const result = data.replace(/__schema__/g, JSON.stringify(schema));

  //   // write the template to a html file
  //   fs.writeFile(
  //     "./generator-jhipster-busilopnodeblueprint/generators/client/templates/react/home/home.tsx.ejs",
  //     result,
  //     (err) => {
  //       if (err) console.log(err);
  //       console.log("Writing to Blueprint Template File...");
  //       // console.log(result);
  //     }
  //   );
  // });

  server.io.emit("loadingService", "loading");

  const outputDir = "./output/" + uuid.v4();
  console.log(outputDir);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Write yo-rc configuration
  let cleanName = JSON.stringify(config.baseName).replace(/['"]+/g, "");
  fs.readFile("./config.json".toString(), "utf8", function (err, dta) {
    if (err) {
      return console.log(err);
    }
    const conf = dta.replace(/blog/g, cleanName);
    let config_file = outputDir + "/.yo-rc.json";
    // write the template to a html file
    fs.writeFile(outputDir + "/.yo-rc.json", conf, (err) => {
      if (err) console.log(err);
      console.log("Writing to .yo-rc configuration file...");
      // console.log(result);
    });
  });

  server.io.emit(
    "loadingService",
    "Running Service to Handle Setup Form (1/5)"
  );
  server.io.emit("loadingService", "Writing yo-rc.son file");
  console.log("Building ...");
let gen_command =  "cd " +outputDir+  " && jhipster -d --blueprints busilopnodeblueprint --skip-checks"
  // Run the generator blueprint asychronously
  const runGen = await cmdService.execShellCommand(
    gen_command
  );
  console.log(runGen);
  console.log("Installing Dependencies ...");

  fs.readFile(outputDir + "/package.json".toString(), "utf8", function (
    err,
    data
  ) {
    if (err) {
      return console.log(err);
    }
    // remove the blueprint from the package.json file
    const rmvpackage = data.replace(
      / "generator-jhipster-busilopnodeblueprint": "1.0.2",/g,
      ""
    );
    fs.writeFile(outputDir + "package.json", rmvpackage, (err) => {
      if (err) console.log(err);
      console.log("...");
    });
  });
  server.io.emit("loadingService", "Running Blueprint Generator step:(2/3)");

  console.log("Installing Dependencies ...");

  let compose_command = "cd " + outputDir + " && docker-compose up";
  const runCompose = await cmdService.execShellCommand(compose_command);

  console.log(runCompose);

  server.io.emit(
    "loadingService",
    "generating executable JAR file from application-prod.yml step:(3/3)"
  );

  console.log("===== Finished running backend services");
});

module.exports = router;
