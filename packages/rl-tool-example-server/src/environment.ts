import path from "path";
import ToolConsumer from "@asu-etx/rl-server-lib/src/database/entities/ToolConsumer";

// local dev
//import dotenv from "dotenv";
//const ENV_VARS = dotenv.config().parsed as any;

// heroku
const ENV_VARS = process.env;

export const PORT: number = parseInt(ENV_VARS.PORT ? ENV_VARS.PORT : "8080");

// this is set by the yarn run heroku-update-configs script
export const APPLICATION_URL: string = ENV_VARS.APPLICATION_URL || "";

export const USER_INTERFACE_ROOT: string = path.join(
  __dirname,
  "/../../rl-tool-example-client/build"
);

export const TOOL_CONSUMERS: ToolConsumer[] = (JSON.parse(
  ENV_VARS.TOOL_CONSUMERS?.replace(/\\"/g, '"') || "[]"
) as unknown) as ToolConsumer[];
