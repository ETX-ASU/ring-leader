import shellPromise from "./shell-promise";
import * as path from "path";
import * as dotenv from "dotenv";

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

// also pass in the Heroku hostname and URL so the app has access
allConfigPromises.push(
  shellPromise(
    "heroku config:set APPLICATION_URL=$(heroku info -s | grep web_url | cut -d= -f2)"
  )
);

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
