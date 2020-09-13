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
