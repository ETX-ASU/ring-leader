import path from "path";
import dotenv from "dotenv";

const configsFromEnvFile = dotenv.config().parsed as any;

export const PORT_NUMBER: number =
  parseInt(configsFromEnvFile.PORT_NUMBER) || 443;

export const USER_INTERFACE_ROOT: string = path.join(
  __dirname,
  "/../../rl-tool-example-client/build"
);

export const TOOL_CONSUMER_NAME: string =
  configsFromEnvFile.TOOL_CONSUMER_NAME || "";
export const TOOL_CONSUMER_PRIVATE_KEY: string =
  configsFromEnvFile.TOOL_CONSUMER_PRIVATE_KEY || "";
export const TOOL_CONSUMER_PUBLIC_KEY: string =
  configsFromEnvFile.TOOL_CONSUMER_PUBLIC_KEY || "";
