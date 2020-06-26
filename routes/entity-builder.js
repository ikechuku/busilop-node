var express = require("express");
var router = express.Router();
var fs = require("fs");
var Promise = require("bluebird");
var cmd = require("node-cmd");
var server = require("../bin/www");
const jdlService = require("../services/jdl-service");
const cmdService = require("../services/cmd-service");

router.post("/", async function (req, res, err) {
  const schema = req.body["store"].form["components"];
  const config = req.body["store"].config;

  // Write form to Template
  fs.readFile("form.txt".toString(), "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    const result = data.replace(/__schema__/g, JSON.stringify(schema));

    // write the template to a html file
    fs.writeFile(
      "./generator-jhipster-clientBlueprint/generators/client/templates/_form.html",
      result,
      (err) => {
        if (err) console.log(err);
        console.log("Writing to Blueprint Template File...");
        // console.log(result);
      }
    );
  });

  server.io.emit("loadingService", "loading");

  // Write yo-rc configuration
  let cleanName = JSON.stringify(config.baseName).replace(/['"]+/g, "");
  fs.readFile("./config.json".toString(), "utf8", function (err, dta) {
    if (err) {
      return console.log(err);
    }
    const conf = dta.replace(/blog/g, cleanName);

    // write the template to a html file
    fs.writeFile("./output/.yo-rc.json", conf, (err) => {
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

  // const Entities = req.body["store"].entities;

  // const Relationships = req.body["store"].relationships;
  // // console.log(req.body["store"]);

  // // write the template to a JDL file
  // var result = "";
  // for (let i in Entities) {
  //   result += jdlService.createJDLEntity(Entities[i]) + "\n";
  // }
  // for (let i in Relationships) {
  //   result += jdlService.createJDLRelationship(Relationships[i]) + "\n";
  // }
  // fs.writeFile("./output/entities.jdl", result, (err) => {
  //   if (err) console.log(err);
  //   console.log("Creating JDL File.");
  // });

  // console.log("Service to Create JDL");
  // server.io.emit("loadingService", "Creating JDL Entities step:(1/3)");

  // const linkBlueprint = await cmdService.execShellCommand('cd output && npm link generator-jhipster-myblueprint');
  // console.log(linkBlueprint);
  // console.log("Linking Generator");

  // Run the generator blueprint asychronously
  const runGen = await cmdService.execShellCommand(
    "cd output && jhipster -d --blueprints myblueprint --skip-checks"
  );
  console.log(runGen);
  console.log("Service to Create Blueprint ");

  // const runJdlGen = await cmdService.execShellCommand(
  //   "cd output && jhipster import-jdl ./entities.jdl --regenerate --force"
  // );
  // console.log(runJdlGen);
  // console.log("Service to Handle JDL");
  // Modify the package.json
  fs.readFile("./output/package.json".toString(), "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const rmvpackg = data.replace(
      /"generator-jhipster-clientblueprint": "1.0.0",/g,
      ""
    );
    const rmvpackage = rmvpackg.replace(
      /"generator-jhipster-myblueprint": "1.0.2",/g,
      ""
    );
    fs.writeFile("./output/package.json", rmvpackage, (err) => {
      if (err) console.log(err);
      console.log("...");
    });
  });
  server.io.emit("loadingService", "Running Blueprint Generator step:(2/3)");

  // Modify the yml file to set a password for postgres

  // fs.readFile(
  //   "./output/src/main/resources/config/application-prod.yml".toString(),
  //   "utf8",
  //   function (err, data) {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     const setpwd = data.replace(/password:/, "password: blog");
  //     let xstring = "username: " + cleanName;
  //     const setusr = setpwd.split(xstring).join("username: blog");

  //     let dbstring = "url: jdbc:postgresql://localhost:5432/" + cleanName;
  //     const setdb = setusr
  //       .split(dbstring)
  //       .join("url: jdbc:postgresql://localhost:5432/blog");
  //     fs.writeFile(
  //       "./output/src/main/resources/config/application-prod.yml",
  //       setdb,
  //       (err) => {
  //         if (err) console.log(err);
  //         console.log("Generating executable jar from application-prod.yml");
  //       }
  //     );
  //   }
  // );

  // const generateJar = await cmdService.execShellCommand(
  //   "cd output && ./mvnw -Pprod clean verify"
  // );

  const installServer = await cmdService.execShellCommand(
    "cd output && npm install && npm start && cd server && npm install && npm start"
  );
  console.log("Installing Dependencies ...");

  // const installClient = await cmdService.execShellCommand(
  //   "cd output && npm install && npm start"
  // );

  server.io.emit(
    "loadingService",
    "generating executable JAR file from application-prod.yml step:(3/3)"
  );

  // console.log(generateJar);
  console.log("JAR file Generated Successfully!");
  console.log("Service to generate executable JAR file");

  // const buildcmd =
  //   "cd output/target && java -jar " + cleanName + "-0.0.1-SNAPSHOT.jar";
  // setTimeout(function () {
  //   server.io.emit("loadingService", "complete");
  // }, 3000);
  // cmdService.execShellCommand(buildcmd);
  console.log("build complete!");

  // res.send("Application is being deployed, Pls visit this link in 2 minutes");

  // res.send({ response: "Downloaded complete" }).status(200);
});

module.exports = router;
