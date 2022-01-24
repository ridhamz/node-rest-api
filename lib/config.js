/*
 * create and export configuration variables
 *
 */

// container for all the environment
const environments = {};

// staging environment (default)
environments.dev = {
  port: 5000,
  envName: "dev",
  hashingSecret: "123456",
};

// production environment
environments.production = {
  port: 3000,
  envName: "production",
  hashingSecret: "123456",
};

// determine which environment was passed as command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "dev";

// check if the environment exists
const envToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments["env"];

export default envToExport;
