/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

const unzipper = require('unzipper'),
  fs = require("fs"),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
    .pipe(unzipper.Extract({path: pathOut}))
    .on('finish', () => {
      console.log("extracting finish");
      resolve("extracted successfully");
    })
    .on('error', () => {
      reject("error");
    })
  })

  /**
   * sugar syntax turning to promise
  return fs.createReadStream(pathIn).pipe(unzipper.Extract({path: pathOut})).promise()
  .then(result => console.log(result))
  .catch(error => console.log(error));
  */
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  //"dir" is the path of firectory being read
  const listPNGPath = (files) => {
    let pathList = [];
    files.forEach(fileName => {
      if (fileName.includes(".png")) {
        pathList.push(dir + `/${fileName}`);
      }
    })
    return pathList;
  }

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const pathList = listPNGPath(files);
        resolve(pathList);
      }
    })
  })
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const RGBtoGray = (r, g, b) => {
  gray = (r + g + b) / 3;
  return gray;
}

const grayScale = (pathIn, pathOut) => {
  const pathArray = pathIn.split("/");
  const fileName = pathArray[pathArray.length - 1];

  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
    .pipe(new PNG({ filterType: 4 }))
    .on("parsed", function(){
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
  
          //do simple averaging algorithm
          const r = this.data[idx], g = this.data[idx + 1], b = this.data[idx + 2];
          
          this.data[idx] = RGBtoGray(r, g, b);
          this.data[idx + 1] = RGBtoGray(r, g, b);
          this.data[idx + 2] = RGBtoGray(r, g, b);
        }
      }
      this.pack().pipe(fs.createWriteStream(`${pathOut}/${fileName}`))
      .on('finish', () => {
        console.log('grayScaled finsihed');
        resolve('grayScaled images created successfully.');
      });
    })
    .on('error', () => {
      reject('grayScaling error.');
    })
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};