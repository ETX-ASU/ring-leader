import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

const SERVER_ROOT = path.resolve(
  __dirname,
  "../packages/rl-tool-example-server"
);
const ENV_VARIABLES_PATH = path.resolve(SERVER_ROOT, ".env.local.json");

const configsFromEnvFile = JSON.parse(
  fs.readFileSync(ENV_VARIABLES_PATH, "utf8")
);

const herokuAppName = configsFromEnvFile["HEROKU_APP_NAME"];

exec(`heroku create ${herokuAppName}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
