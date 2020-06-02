//
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
module.exports.execShellCommand = (cmd) => {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      console.log(stdout);

      resolve(stdout ? stdout : stderr);
    });
  });
};




const { pour } = require('std-pour');
pour('ping', ['8.8.8.8', '-c', '4']).then(code => console.log(`Error Code: ${code}`));