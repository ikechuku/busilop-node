var express = require("express");
var router = express.Router();
var fs = require('fs');
var cmd = require('node-cmd')
var ejs = require('ejs');


router.post("/", async function (req, res, err) {

  // var data = req.body
  var data = req.body.schema['components']

  fs.writeFile("form.html", data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
    console.log(data);
  });

  // var promise = new Promise(function (resolve, reject) {
  //   cmd.get(
  //     'cd output && jhipster',
  //     function (err, stdout, stderr) {


  //       if (err) {

  //         reject(err);
  //       } else {
  //         console.log(stdout)
  //         resolve("done");
  //       }
  //     }
  //   );
  // })

  // await promise
  res.send("Completed!")

});


module.exports = router;

// console.log("running Jhipster blueprint, please wait...");

// Code to Create files 

// var fs = require('fs');

// raw_data = req.body;
// data = raw_data.data

// if (data['tables']) {
//   console.log(data.template)
// }

// if (data['tables']) {
//   console.log(data.tables)
//   try {
//     fs.writeFile(pagefile, data.tables, function (err) {
//       if (err) throw err;
//       console.log('Saved!');
//     });
//   } catch (error) {
//     console.log();
//   }
// }
