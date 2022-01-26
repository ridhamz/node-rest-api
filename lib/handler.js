/*
 * request handlers
 *
 */

// dependencies
import _data from "./data.js";
import helpers from "./helpers.js";

// define handlers
let handlers = {};

// users
handlers.users = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
    return;
  }
  callback(405);
};

handlers._users = {};

// users - post
// request data : firstName , lastName , phone , password , tosArguments
// optional data : none
handlers._users.post = (data, callback) => {
  // check that all required fields are filled out
  let { firstName, lastName, phone, password, tosArguments } = data.payload;
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : false;

  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : false;

  phone =
    typeof phone === "string" && phone.trim().length === 8
      ? phone.trim()
      : false;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;

  tosArguments =
    typeof tosArguments === "boolean" && tosArguments === true ? true : false;

  if (firstName && lastName && phone && password && tosArguments) {
    // make sure that the user does not exist
    _data.read("users", phone, (err, data) => {
      if (err) {
        // hash the password
        const hashedPassword = helpers.hash(password);
        // create the user object
        const user = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          tosArguments: true,
        };

        // store the user
        _data.create("users", phone, user, (err) => {
          if (!err) {
            callback(200);
            return;
          }
          callback(500, { Error: "Could not create the user" });
        });
        return;
      }
      // user already exist
      callback(400, { Error: "A user withe that phone number already exist" });
    });
    return;
  }
  callback(400, { Error: "Missing resquired fields" });
};

// users - get
// required data : phone
// optional data : none
//TODO
handlers._users.get = (data, callback) => {
  // check that the phone number is valid
  const phone =
    typeof data.queryString.phone.trim() === "string" &&
    data.queryString.phone.trim().length > 0
      ? data.queryString.phone.trim()
      : false;
  // lookup the the user
  _data.read("users", phone, (err, data) => {
    if (!err && data) {
      // remove the hashed password from the data
      delete data.hashedPassword;
      callback(200, data);
      return;
    }
    callback(404, { Error: "Users does not exist." });
  });
  if (phone) {
    return;
  }
  callback(400, { Error: "Missing field required" });
};

// users - put
// required data : phone
// optional data : none
handlers._users.put = (data, callback) => {
  // check for the required field
  const phone =
    typeof data.payload.phone.trim() === "string" &&
    data.queryString.phone.trim().length > 0
      ? data.queryString.phone.trim()
      : false;

  // check for the optional fields
  let { firstName, lastName, password, tosArguments } = data.payload;
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : false;

  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : false;

  password =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;

  tosArguments =
    typeof tosArguments === "boolean" && tosArguments === true ? true : false;

  // error of the phone is invalid
  if (phone) {
    console.log(1);
    if (firstName || lastName || password || tosArguments) {
      console.log(2);
      // lookup user
      _data.read("users", phone, (err, userData) => {
        if (!err && userData) {
          console.log(3);
          const data = JSON.parse(userData);
          console.log("data ", data);
          if (firstName) data.firstName = firstName;
          if (lastName) data.lastName = lastName;
          if (password) data.hashedPassword = helpers.hash(password);
          if (tosArguments) data.tosArguments = tosArguments;

          // store the new updates
          _data.update("users", phone, data, (err) => {
            if (!err) {
              console.log(4);
              callback(200, data);
              return;
            }
            console.log(err);
            callback(500, { Error: "Could not update the user" });
          });
          return;
        }
        callback(400, { Error: "user does not exist" });
      });
      return;
    }
    callback(400, { Error: "Missing fields to update." });
    return;
  }
  callback(400, { Error: "Missing required field" });
};

// users - delete
handlers._users.delete = (data, callback) => {
  // check that the phone number is valid
  const phone =
    typeof data.queryString.phone.trim() === "string" &&
    data.queryString.phone.trim().length > 0
      ? data.queryString.phone.trim()
      : false;
  // lookup the the user
  _data.read("users", phone, (err, data) => {
    if (!err && data) {
      _data.delete("users", phone, (err) => {
        if (!err) {
          callback(200, "deleted");
          return;
        }
        callback(500, { Error: "Error while deleting the user" });
      });
      return;
    }
    callback(404, { Error: "Users does not exist." });
  });
  if (phone) {
    return;
  }
  callback(400, { Error: "Missing field required" });
};

// tokens
handlers.tokens = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._tokens[data.method](data, callback);
    return;
  }
  callback(405);
};

// container for all the tokens methods
handlers._tokens = {};

// tokens - post
// required data : phone and password
// optional data : none
handlers._tokens.post = function (data, callback) {
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (phone && password) {
    // Lookup the user who matches that phone number
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if (hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            phone: phone,
            id: tokenId,
            expires: expires,
          };

          // Store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error:
              "Password did not match the specified user's stored password",
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)." });
  }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {
  // Check that id is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field, or field invalid" });
  }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function (data, callback) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  var extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;
  if (id && extend) {
    // Lookup the existing token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new updates
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration.",
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired, and cannot be extended.",
          });
        }
      } else {
        callback(400, { Error: "Specified user does not exist." });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or field(s) are invalid.",
    });
  }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {
  // Check that id is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Delete the token
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the specified token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified token." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.phone == phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
// ping handler
handlers.ping = (data, callback) => {
  //todo
  callback(200);
};

// not found handler
handlers.notFound = (data, callback) => {
  // todo
  callback(404);
};

// export the handler
export default handlers;
