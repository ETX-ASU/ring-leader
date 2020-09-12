import path from "path";
import dotenv from "dotenv";

const configsFromEnvFile = dotenv.config().parsed as any;

export const PORT_NUMBER: number =
  parseInt(configsFromEnvFile.PORT_NUMBER) || 3000;

export const USER_INTERFACE_ROOT: string = path.join(
  __dirname,
  "/../../rl-tool-example-client/build"
);
