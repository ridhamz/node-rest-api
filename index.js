/*
 * Primary file for API
 *
 */

// Dependencies
import server from "./lib/server.js";
import workers from "./lib/workers.js";

// Declare the app
var app = {};

// Init function
app.init = function () {
  // Start the server
  server.init();

  // Start the workers
  workers.init();
};

// Self executing
app.init();

// Export the app
export default app;
