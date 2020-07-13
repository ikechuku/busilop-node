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
  const outputDir = "./output/" + uuid.v4();

  server.io.emit("loadingService", "loading");

  console.log(schema);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Write yo-rc configuration
  const cleanName = JSON.stringify(config.baseName).replace(/['"]+/g, "");
  const themeName = JSON.stringify(config.clientTheme).replace(/['"]+/g, "");

  fs.readFile("./config.json".toString(), "utf8", function (err, dta) {
    if (err) {
      return console.log(err);
    }

    const conf = dta.replace(/blog/g, cleanName);
    let theme = conf.replace(/__theme__/g, themeName);
    // theme = dta.replace(/__variant__/g, "");

    // if (themeName == "darkly") {
    //   theme = dta.replace(/__variant__/g, "dark");

    // }

    // let config_file = outputDir + "/.yo-rc.json";
    // write the template to a html file
    fs.writeFile(outputDir + "/.yo-rc.json", theme, (err) => {
      if (err) console.log(err);
      console.log("Writing files from Blueprint ...");
      // console.log(result);
    });
  });

  // server.io.emit(
  //   "loadingService",
  //   "Running Service to Handle Setup Form (1/5)"
  // );
  // server.io.emit("loadingService", "Running Blueprint Generator step:(2/3)");
  // console.log("Building ...");
  // let gen_command =
  //   "cd " +
  //   outputDir +
  //   " && jhipster -d --blueprints busilopnodeblueprint --skip-checks";
  // // Run the generator blueprint asychronously
  // const runGen = await cmdService.execShellCommand(gen_command);
  // console.log(runGen);
  // console.log("Installing Dependencies ...");

  // fs.readFile(
  //   outputDir + "/src/main/webapp/app/modules/home/home.tsx".toString(),
  //   "utf8",
  //   function (err, data) {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     // remove the blueprint from the package.json file
  //     const writeSchema = data.replace(
  //       /_schema_code_/g,
  //       JSON.stringify(schema)
  //     );
  //     fs.writeFile(
  //       outputDir + "/src/main/webapp/app/modules/home/home.tsx",
  //       writeSchema,
  //       (err) => {
  //         if (err) console.log(err);
  //         console.log("Loading docker-compose");
  //       }
  //     );
  //   }
  // );

  // fs.readFile(outputDir + "/package.json".toString(), "utf8", function (
  //   err,
  //   data
  // ) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   // remove the blueprint from the package.json file
  //   const rmvpackage = data.replace(
  //     / "generator-jhipster-busilopnodeblueprint": "1.0.2",/g,
  //     ""
  //   );
  //   fs.writeFile(outputDir + "package.json", rmvpackage, (err) => {
  //     if (err) console.log(err);
  //     console.log("...");
  //   });
  // });
  // server.io.emit("loadingService", "building docker images");

  // let compose_command =
  //   "cd " +
  //   outputDir +
  //   " && docker-compose -f docker-compose-base.yml -f docker-compose.yml up ";
  // const runCompose = await cmdService.execShellCommand(compose_command);

  // server.io.emit("loadingService", "Installing dependencies");
  // console.log(runCompose);

  console.log("===== Finished running backend services");
  server.io.emit("loadingService", "Finished running backend services");
});

module.exports = router;
