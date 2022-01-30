/*
 * library for storing and editing data
 *
 */

// dependencies
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// container for the module (to be exported )
const lib = {};

// base directory of the data folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
lib.baseDir = path.join(__dirname, "/../.data/");

// write to a data file
lib.create = (dir, file, data, callback) => {
  console.log(lib.baseDir);
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

// read data from a file
lib.read = function (dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
    callback(err, data);
  });
};

// update data inside a file
lib.update = function (dir, file, data, callback) {
  // open the file
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //convert data to json
        const newData = JSON.stringify(data);

        // truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // write to the file and close it
            fs.writeFile(fileDescriptor, newData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                    return;
                  }
                  callback("Error closing the file");
                });
                return;
              }
              callback("Error writing to the existing file");
            });
            return;
          }
          callback("Error truncating the file");
        });

        return;
      }
      callback("Could not open file for updating, it may not exist ");
    }
  );
};

// delete a file
lib.delete = function (dir, file, callback) {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
      return;
    }
    callback("Error deleting file");
  });
};

// List all the items in a directory
lib.list = function (dir, callback) {
  fs.readdir(lib.baseDir + dir + "/", function (err, data) {
    if (!err && data && data.length > 0) {
      var trimmedFileNames = [];
      data.forEach(function (fileName) {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

// export the module
export default lib;
