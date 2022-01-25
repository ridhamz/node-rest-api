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

// users - delete

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
