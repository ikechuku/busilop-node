var express = require("express");
var router = express.Router();
var fs = require("fs");
var Promise = require("bluebird");
var cmd = require("node-cmd");
const jdlService = require("../services/jdl-service");
const cmdService = require("../services/cmd-service");

router.post("/", async function (req, res, err) {
  const schema = req.body["store"].form["components"];

  // Write form to Template
  fs.readFile("form.txt".toString(), "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/__schema__/g, JSON.stringify(schema));

    // write the template to a html file
    fs.writeFile(
      "./generator-jhipster-clientBlueprint/generators/client/templates/_form.html",
      result,
      (err) => {
        if (err) console.log(err);
        console.log("Writting Form to Blueprint Template File.");
        // console.log(result);
      }
    );
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
    console.log("Writing entities to JDL File...");
  });

  // const linkBlueprint = await cmdService.execShellCommand('cd output && npm link generator-jhipster-clientblueprint');
  // console.log(linkBlueprint);
  // console.log("Linking Generator");
console.log("Creating Scaffolding from blueprint...");

  // Run the generator blueprint asychronously
  const runGen = await cmdService.execShellCommand(
    "cd output && jhipster -d --blueprints clientblueprint --skip-checks --skip-install"
  );
  console.log(runGen);
console.log("Importing an Running JDL file...");

  const runJdlGen = await cmdService.execShellCommand(
    "cd output && jhipster import-jdl ./entities.jdl --force"
  );
  console.log(runJdlGen);
console.log("Modifying Package.json to remove clientblueprint as dev dependency");

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
      console.log("Building an executable JAR file...");
    });
  });

  const generateJar = await cmdService.execShellCommand(
    "cd output && ./mvnw -Pprod clean verify"
  );
  console.log(generateJar);
  console.log("Modifying the Application-prod.yml file...");

    // Modify the yml file to set a password for postgres
    fs.readFile("./ouput/src/main/resources/config/application-prod.yml".toString(), "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      const password = data.replace(/password/, "password: blog");
      fs.writeFile(
        "./ouput/src/main/resources/config/application-prod.yml",
        password,
        (err) => {
          if (err) console.log(err);
          console.log("Modified application.yml");
        }
      );
    });  

  const runJar = await cmdService.execShellCommand(
    "cd output/target && java -jar blog-0.0.1-SNAPSHOT.jar"
  );
  console.log(runJar);
  console.log("build!");

  res.send("Scaffolding created Successfully!");
});

module.exports = router;
