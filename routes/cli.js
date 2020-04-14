var runner = require("yeoman-gen-run");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.post("/", async function(req, res, err) {
  try {
    console.log(req.body);
    const answers = {
      appName: "test-app",
      useTypeScript: true,
      useLess: true,
      installDeps: true,
      type: "Survey",
      name: "Unamed"
    };
const response = [
  {
    serverName: 'testinng',
    serverDescription: '',
    serverVersion: '0.1.0',
    authorName: 'ikechuku',
    authorEmail: 'ik@gmail.com',
    databaseName: 'testinng',
    useDocker: true,
    model: 'user',
    fields: [ 'id', ' username', ' email' ],
    repeat: true
  },
  {
    model: 'survey',
    fields: [ 'id', ' title', ' description' ],
    repeat: true
  },
  { model: 'question', fields: [ 'id', ' title' ], repeat: false }
]
    raw_data = req.body;
    for (field in raw_data["fields"]) {
      if (field["name"] == "username") {
        answers["name"] = field["string"];
      }

      if (field["name"] == "appName") {
        answers["appName"] = field["string"];
      }

      if (field["name"] == "appType") {
        answers["type"] = field["string"];
      }
    }

    var genName = "busilop";
    if (answers["type"] == "Registration") {
      genName = "api";
    }
    var outDir = "./output";

    var promise = await runner.runGenerator(
      genName,
      {
        answers,
        options: {
          onconflict: "force"
        }
      },
      outDir
    );
    // const result = await promise;
    if (promise) {
      res.send("respond with a resource");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
