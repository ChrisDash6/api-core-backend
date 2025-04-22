const fs = require("fs");
const path = require("path");
require("dotenv").config();

const FILE_PERMISSION = parseInt(process.env.FILE_PERMISSION, 8);

exports.uploadFile = async (file, destinationPath,finalFileName) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file || !destinationPath) return reject(new Error("File and Destination Path are required"));

      // Ensure the directory exists
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });``
        fs.chmodSync(destinationPath, FILE_PERMISSION);
      }

      // Define final file path using the original filename
      const fileExt = path.extname(file.originalname);
      const finalName = finalFileName && finalFileName.trim() !== "" ? finalFileName : `${file.fieldname}${fileExt}`;
      const filePath = path.join(destinationPath, finalName);

      // Write file from memory buffer to disk**
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) return reject(err);
        resolve(filePath);
      });
    } catch (error) {
      reject(error);
    }
  });
};
