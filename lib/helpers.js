/*
 * helpers for various tasks
 *
 */

// dependencies
import crypto from "crypto";
import config from "./config.js";

// container for all the helpers
const helpers = {};

// create a  SHA256 hash
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

// export helpers
export default helpers;
