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

// send an SMS via Twilio
helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    var payload = {
      From: config.twilio.fromPhone,
      To: "+1" + phone,
      Body: msg,
    };
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

// export helpers
export default helpers;
