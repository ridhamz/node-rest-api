/*
 * request handlers
 *
 */

// dependencies

// define handlers
let handlers = {};

// users
handles.users = () => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
    return;
  }
  callback(405);
};

// container for the user submethods
handles._users = {};

// users - post
// request data : firstName , lastName , phone , password , tosArguments
// optional data : none
handlers._users.post = (data, callback) => {
  //
};

// users - get

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
