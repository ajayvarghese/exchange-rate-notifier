const fs = require("fs");
const customFunction = (_, files) => {
  const fileList = files.map((file) => file.path);
  console.log("FILES", fileList);
  const fileListStr = JSON.stringify(fileList);
  fs.writeFileSync("customSW.js", `const assets = ${fileListStr};`);
  return "";
};

module.exports = customFunction;
