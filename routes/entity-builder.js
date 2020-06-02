var express = require("express");
var router = express.Router();
var fs = require("fs");
var Promise = require("bluebird");
var cmd = require("node-cmd");
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

  const Entities = req.body["store"].entities;

  const Relationships = req.body["store"].relationships;
  console.log(req.body["store"]);

  // write the template to a JDL file
  var result = "";
  for (let i in Entities) {
    result += jdlService.createJDLEntity(Entities[i]) + "\n";
  }
  for (let i in Relationships) {
    result += jdlService.createJDLRelationship(Relationships[i]) + "\n";
  }
  fs.writeFile("./output/entities.jdl", result, (err) => {
    if (err) console.log(err);
    console.log("Creating JDL File.");
  });

  // const linkBlueprint = await cmdService.execShellCommand('cd output && npm link generator-jhipster-clientblueprint');
  // console.log(linkBlueprint);
  // console.log("Linking Generator");

  // Run the generator blueprint asychronously
  const runGen = await cmdService.execShellCommand(
    "cd output && jhipster -d --blueprints clientblueprint --skip-checks --skip-install"
  );
  console.log(runGen);

  const runJdlGen = await cmdService.execShellCommand(
    "cd output && jhipster import-jdl ./entities.jdl --regenerate --force"
  );
  console.log(runJdlGen);

  // Modify the package.json
  fs.readFile("./output/package.json".toString(), "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    const rmvpackage = data.replace(
      /"generator-jhipster-clientblueprint": "1.0.0",/g,
      ""
    );
    fs.writeFile("./output/package.json", rmvpackage, (err) => {
      if (err) console.log(err);
      console.log("...");
    });
  });

  // Modify the yml file to set a password for postgres

  fs.readFile(
    "./output/src/main/resources/config/application-prod.yml".toString(),
    "utf8",
    function (err, data) {
      if (err) {
        return console.log(err);
      }
      const setpwd = data.replace(/password:/, "password: blog");
      let xstring = "username: " + cleanName;
      const setusr = setpwd.split(xstring).join("username: blog");

      let dbstring = "url: jdbc:postgresql://localhost:5432/"+cleanName
      const setdb = setusr.split(dbstring).join("url: jdbc:postgresql://localhost:5432/blog");
      fs.writeFile(
        "./output/src/main/resources/config/application-prod.yml",
        setdb,
        (err) => {
          if (err) console.log(err);
          console.log("Generating executable jar from application-prod.yml");
        }
      );
    }
  );

  const generateJar = await cmdService.execShellCommand(
    "cd output && ./mvnw -Pprod clean verify"
  );
  console.log(generateJar);
  console.log("JAR file Generated Successfully!");

  const buildcmd =
    "cd output/target && java -jar " + cleanName + "-0.0.1-SNAPSHOT.jar";

  cmdService.execShellCommand(buildcmd);
  console.log("build complete!");

  res.send("Application is being deployed, Pls visit this link in 2 minutes");
});

module.exports = router;
