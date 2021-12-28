"use strict";
const { Transform } = require("stream");
const fs = require("fs");

module.exports = (options = {}) => {
  let { filepath = "./css", filename = "fonts.css" } = options;
  let fontFaceFile = `${filepath}/${filename}`;

  // check CSS file existance
  if (fs.existsSync(fontFaceFile)) {
    console.log(
      `File ${fontFaceFile} already exists. Delete it before updating!`
    );
    return;
  }

  // create folder for future "fonts.css"
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }

  // create new set to prevent duplicate @font-face rules
  let uniqueFonts = new Set();

  const transformStream = new Transform({
    objectMode: true,

    transform(file, enc, callback) {
      let fileName = file.stem;

      // check if font with such name had already been processed
      if (uniqueFonts.has(fileName)) {
        console.log(`${fileName} has already been processed`);
        callback(null, file);
      } else {
        let fontName = fileName.split("-")[0];

        let fontStyle;
        if (fileName.toLowerCase().includes("italic")) {
          fontStyle = "italic";
        } else if (fileName.toLowerCase().includes("oblique")) {
          fontStyle = "oblique";
        } else {
          fontStyle = "normal";
        }

        let fontWeight;
        if (
          fileName.toLowerCase().includes("thin") ||
          fileName.toLowerCase().includes("hairline") ||
          fileName.toLowerCase().includes("100")
        ) {
          fontWeight = 100;
        } else if (
          fileName.toLowerCase().includes("extralight") ||
          fileName.toLowerCase().includes("ultralight") ||
          fileName.toLowerCase().includes("200")
        ) {
          fontWeight = 200;
        } else if (
          fileName.toLowerCase().includes("light") ||
          fileName.toLowerCase().includes("300")
        ) {
          fontWeight = 300;
        } else if (
          fileName.toLowerCase().includes("medium") ||
          fileName.toLowerCase().includes("500")
        ) {
          fontWeight = 500;
        } else if (
          fileName.toLowerCase().includes("semibold") ||
          fileName.toLowerCase().includes("demibold") ||
          fileName.toLowerCase().includes("600")
        ) {
          fontWeight = 600;
        } else if (
          fileName.toLowerCase().includes("bold") ||
          fileName.toLowerCase().includes("700")
        ) {
          fontWeight = 700;
        } else if (
          fileName.toLowerCase().includes("extrabold") ||
          fileName.toLowerCase().includes("ultrabold") ||
          fileName.toLowerCase().includes("800")
        ) {
          fontWeight = 800;
        } else if (
          fileName.toLowerCase().includes("black") ||
          fileName.toLowerCase().includes("heavy") ||
          fileName.toLowerCase().includes("900")
        ) {
          fontWeight = 900;
        } else if (
          fileName.toLowerCase().includes("extrablack") ||
          fileName.toLowerCase().includes("ultrablack") ||
          fileName.toLowerCase().includes("950")
        ) {
          fontWeight = 950;
        } else {
          fontWeight = 400;
        }

        // create @font-face fonts.css with generated fontName, fontStyle, fontWeight, fileName
        fs.appendFile(
          fontFaceFile,
          `@font-face {\n\tfont-family: '${fontName}';\n\tfont-style: ${fontStyle};\n\tfont-weight: ${fontWeight};\n\tfont-display: swap;\n\tsrc: local(''),\n\turl("../font/${fileName}.woff2") format("woff2"),\n\turl("../font/${fileName}.woff") format("woff");\n}\n`,
          (err) => {
            if (err) {
              console.log(`Error while creating ${fontFaceFile}`);
            }
          }
        );

        // add processed fileName to set
        uniqueFonts.add(fileName);

        callback(null, file);
      }
    },
  });
  return transformStream;
};
