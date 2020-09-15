import * as fs from "fs";
import * as path from "path";

import shellPromise from "./shell-promise";

const isWindows = process.platform === "win32";

const SERVER_ROOT = path.resolve(
  __dirname,
  "../packages/rl-tool-example-server"
);
const ENV_VARIABLES_PATH = path.resolve(SERVER_ROOT, ".env.local.json");

const configsFromEnvFile = JSON.parse(
  fs.readFileSync(ENV_VARIABLES_PATH, "utf8")
);

const getConfigValue = (configValue) => {
  if (typeof configValue === "object") {
    return `'${JSON.stringify(configValue).replace(/"/g, '\\"')}'`;
  }
  return configValue;
};

const allConfigPromises = Object.keys(configsFromEnvFile).map((configKey) => {
  const configValue = getConfigValue(configsFromEnvFile[configKey]);
  console.log(configKey, configValue);
  return shellPromise(`heroku config:set ${configKey}=${configValue}`);
});

// get the heroku url
const WEB_URL_REGEX = /web_url=(.*)/;
const setApplicationUrlPromise = shellPromise("heroku info -s").then(
  (herokuInfo: string) => {
    const applicationUrl = herokuInfo.match(WEB_URL_REGEX)[1];
    return shellPromise(`heroku config:set APPLICATION_URL=${applicationUrl}`);
  }
);

// also pass in the Heroku hostname and URL so the app has access
allConfigPromises.push(setApplicationUrlPromise);

Promise.all(allConfigPromises)
  .then(() => {
    console.log("Heroku App Configs ( ENV Variables ) updated");
  })
  .catch((err) => {
    console.error(
      "There was an error updating the Heroku configs ( env variables )",
      err
    );
  });
