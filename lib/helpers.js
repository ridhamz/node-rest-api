/*
 * helpers for various tasks
 *
 */

// dependencies
import crypto from "crypto";
import config from "./config.js";

// container for all the helpers
const helpers = {};

// create a SHA256 hash
helpers.hash = (str) => {
  if (typeof str == "string" && str.length > 0) {
    return crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
  }
  return false;
};

// create a JSON to object helper
helpers.parseJsonToObject = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};

// create a random string
helpers.createRandomString = (length) => {
  length = typeof length === "number" && length > 0 ? length : false;
  if (length) {
    // define all the possible characters that could go into a string
    const chars = "abcdefghtruiopmklsqsxd123456789";

    // start the final string
    let str = "";
    for (i = 1; i < length; i++) {
      // get the random character
      const random = chars.charAt(Math.floor(Math.random() * chars.length));
      str += random;
    }

    return str;
  }
  return false;
};

// export helpers
export default helpers;
