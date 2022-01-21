/*
 * library for storing and editing data
 *
 */

// dependencies
import fs from "fs";
import path from "path";

// container for the module (to be exported )
const lib = {};

// base directory of the data folder
const __dirname = path.dirname("data.js");
lib.baseDir = path.join(__dirname, "/../.data/");

// write to a data file
lib.create = (dir, file, data, callback) => {
  // open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
                return;
              }
              callback("Error closing new file");
            });
            return;
          }
          callback("Error writing new file");
        });
        return;
      }
      callback("Could not create new file, it may already exist");
    }
  );
};

// export the module
export default lib;
