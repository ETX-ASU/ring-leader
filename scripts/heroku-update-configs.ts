import shellPromise from "./shell-promise";
import * as path from "path";
import * as dotenv from "dotenv";
import { exec } from "child_process";

const SERVER_ROOT = path.resolve(
  __dirname,
  "../packages/rl-tool-example-server"
);
const ENV_VARIABLES_PATH = path.resolve(SERVER_ROOT, ".env.local");

const configsFromEnvFile = dotenv.config({ path: ENV_VARIABLES_PATH })
  .parsed as any;

const allConfigPromises = Object.keys(configsFromEnvFile).map((configKey) => {
  return shellPromise(
    `heroku config:set ${configKey}=${configsFromEnvFile[configKey]}`
  );
});

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
