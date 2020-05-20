const fs = require("fs");

class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("Hello World Plugin", (
      stats /* stats is passed as an argument when done hook is tapped.  */
    ) => {
      try {
        const contents = fs.readFileSync("customSW.js");
        const serviceWorkerScript = fs.readFileSync("./sw/sw.js");
        const content = `${contents} \n ${serviceWorkerScript}`;
        console.log("Content", content);
        const data = new Uint8Array(Buffer.from(content));
        fs.writeFile("generatedSW.js", data, (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
      } catch (e) {
        console.log("[Error]", e);
      }
    });
  }
}

module.exports = HelloWorldPlugin;
