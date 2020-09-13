import path from "path";
import dotenv from "dotenv";

// local dev
// const ENV_VARS = dotenv.config().parsed as any;
// heroku
const ENV_VARS = process.env;

export const PORT_NUMBER: number = parseInt(
  ENV_VARS.PORT_NUMBER ? ENV_VARS.PORT_NUMBER : "8080"
);

export const USER_INTERFACE_ROOT: string = path.join(
  __dirname,
  "/../../rl-tool-example-client/build"
);

export const TOOL_CONSUMER_NAME: string = ENV_VARS.TOOL_CONSUMER_NAME || "";
export const TOOL_CONSUMER_PRIVATE_KEY: string =
  ENV_VARS.TOOL_CONSUMER_PRIVATE_KEY || "";
export const TOOL_CONSUMER_PUBLIC_KEY: string =
  ENV_VARS.TOOL_CONSUMER_PUBLIC_KEY || "";
