/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description: 
 * 
 * Created Date: 
 * Author:
 * 
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

const { unzip, readDir, grayScale } = IOhandler;

// unzip(zipFilePath, pathUnzipped);
// readDir(pathUnzipped);
let firstPNG;
readDir(pathUnzipped)
.then(result => {
  let firstPNG = result[0];
  grayScale(firstPNG, pathProcessed);
})
.then(error => console.log(error));


