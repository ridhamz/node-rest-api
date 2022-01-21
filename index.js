/*
 * primary file for the PI
 *
 */

// dependencies
import http from "http";
import url from "url";
import { StringDecoder } from "string_decoder";
import { type } from "os";
import config from "./config.js";
import _data from "./lib/data.js";

// testing
// @todo delete the file
_data.create("test", "newFile", { foo: "bar" }, (err) => console.log(err));

// the server should respond to all requests with a string
const server = http.createServer((req, res) => {
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // get the path from the url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // get the query string as an object
  const queryStringObject = parsedUrl.query;

  // get the http method
  const method = req.method.toLowerCase();

  // get the headers s an object
  const headers = req.headers;

  // get the payload if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // choose the handler should the request should go to
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // construct the data object to send to the handler
    const data = { trimmedPath, method, headers, payload: buffer };

    // route the request to the handler specified
    chosenHandler(data, (statusCode, payload) => {
      // use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // use the payload called by the handler, or default to an empty object
      payload = typeof payload === "object" ? payload : {};

      // convert the payload to string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the request path
      console.log("payload:", statusCode, payloadString);
    });
  });
});

// srtart the server, and have it listen on port 5000
server.listen(config.port, () =>
  console.log(`server is lestening on port ${config.port}`)
);

//handlers
let handlers = {};

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

// define request router
const router = {
  ping: handlers.sample,
};
