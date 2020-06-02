var express = require("express");
var router = express.Router();
var fs = require('fs');
var cmd = require('node-cmd')
var Promise = require('bluebird')

var exec = require('child_process').exec;


router.post("/", async function (req, res, err) {

  var data = req.body
  var schema = req.body.schema['components']

  fs.readFile(('form.txt').toString(), 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/__schema__/g, JSON.stringify(schema));
    // console.log(schema.toString());

    // write the template to a html file
    fs.writeFile("./generator-jhipster-clientBlueprint/generators/client/templates/_form.html", result, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to Blueprint Template File.");
      console.log(result);
    });
  });


  //
  /**
   * Executes a shell command and return it as a Promise.
   * @param cmd {string}
   * @return {Promise<string>}
   */
  function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        console.log(stdout);

        resolve(stdout ? stdout : stderr);
      });
    });
  }

  // Run the generator blueprint asychronously
  const runGenerator = await execShellCommand('cd output && jhipster -d --blueprints clientblueprint --skip-checks --skip-install');
  console.log(runGenerator);

  console.log("The scaffolding has been Completed Successfully!");

  res.send("Completed!")
});


module.exports = router;
