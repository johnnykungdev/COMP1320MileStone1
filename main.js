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

const unzip = IOhandler.unzip;
const readDir = IOhandler.readDir;
// unzip(zipFilePath, pathUnzipped);
readDir(pathUnzipped);

