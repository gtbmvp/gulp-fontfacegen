"use strict";
const { Transform } = require("stream");
const fs = require("fs");

module.exports = (options = {}) => {
  let { filepath = "./src/css/partial", filename = "fonts.css" } = options;
  let fontFaceFile = `${filepath}/${filename}`;

  // check CSS file existance, create folder for future "fonts.css"
  if (fs.existsSync(fontFaceFile)) {
    fs.unlinkSync(fontFaceFile);
    fs.mkdirSync(filepath, { recursive: true });
  } else {
    fs.mkdirSync(filepath, { recursive: true });
  }

  // create new set to prevent duplicate @font-face rules
  let uniqueFonts = new Set();

  //keywords for distinguishing font name
  const keywords = [
    "italic",
    "oblique",
    "normal",
    "japanese",
    "vietnamese",
    "latin",
    "greek",
    "cyrillic",
    "ext",
    "thin",
    "hairline",
    "extralight",
    "ultralight",
    "light",
    "regular",
    "medium",
    "semibold",
    "demibold",
    "bold",
    "extrabold",
    "ultrabold",
    "black",
    "heavy",
    "extrablack",
    "ultrablack",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ];

  const transformStream = new Transform({
    objectMode: true,

    transform(file, enc, callback) {
      let fileName = file.stem;

      // check if font with such name had already been processed
      if (uniqueFonts.has(fileName)) {
        console.log(`${fileName} has already been processed`);
        callback(null, file);
      } else {
        let array = fileName.split(/-|_|\s/); // splitting fileName by - or _ or \s separators;

        //filter array to exclude keywords and versions (v7, v26, etc) and capitalize first letter of font-family;
        let filteredArray = array
          .filter(
            (fileNamePiece) =>
              !(
                keywords.includes(fileNamePiece.toLowerCase()) ||
                /v\d\d*/.test(fileNamePiece.toLowerCase())
              )
          )
          .map(
            (fileNamePiece) =>
              fileNamePiece.charAt(0).toUpperCase() +
              fileNamePiece.toLowerCase().slice(1)
          );

        let fontFamily = filteredArray.join(" "); // get font-family with " " between words;

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

        // create @font-face fonts.css with generated fontFamily, fontStyle, fontWeight, fileName
        fs.appendFile(
          fontFaceFile,
          `@font-face {\n\tfont-family: '${fontFamily}';\n\tfont-style: ${fontStyle};\n\tfont-weight: ${fontWeight};\n\tfont-display: swap;\n\tsrc: local(''),\n\turl("../font/${fileName}.woff2") format("woff2"),\n\turl("../font/${fileName}.woff") format("woff");\n}\n`,
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
