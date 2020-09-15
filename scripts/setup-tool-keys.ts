import * as path from "path";
import * as fs from "fs";
import { pem2jwk } from "pem-jwk";

import shellPromise from "./shell-promise";

const getKeyFileNames = (platformName: string) => {
  return {
    publicKeyFile: `rsa-rl-${platformName}-public.pem`,
    privateKeyFile: `rsa-rl-${platformName}-private.pem`
  };
};

// Get the TOOL_CONSUMERS from the environment variables
const SERVER_ROOT = path.resolve(
  __dirname,
  "../packages/rl-tool-example-server"
);
const ENV_VARIABLES_PATH = path.resolve(SERVER_ROOT, ".env.local.json");
const configsFromEnvFile = JSON.parse(
  fs.readFileSync(ENV_VARIABLES_PATH, "utf8")
);

const toolConsumerPromises = configsFromEnvFile.TOOL_CONSUMERS.map(
  (toolConsumer) => {
    if (toolConsumer.private_key && toolConsumer.private_key.trim() !== "") {
      return Promise.resolve(true);
    }

    const keyFileNames = getKeyFileNames(toolConsumer.name);

    // NOTE: If any of these key generation commands fail
    // USE IMS Globals site: https://lti-ri.imsglobal.org/keygen/index
    return shellPromise(
      `openssl genpkey -algorithm RSA -out ${keyFileNames.privateKeyFile} -pkeyopt rsa_keygen_bits:2048`
    )
      .then(() => {
        return shellPromise(
          `openssl rsa -in ${keyFileNames.privateKeyFile} -pubout -out ${keyFileNames.publicKeyFile}`
        );
      })
      .then(() => {
        console.log("Public and Private Key Generated...");
        console.log("JWK created...");
        const private_key_str = fs.readFileSync(
          keyFileNames.privateKeyFile,
          "ascii"
        );
        const public_key_str = fs.readFileSync(
          keyFileNames.publicKeyFile,
          "ascii"
        );
        const jwk = pem2jwk(public_key_str);

        Object.assign(jwk, {
          use: "sig",
          kid: `ASU ETX - Ring Leader - ${toolConsumer.name} - Public Key`
        });

        toolConsumer.private_key = private_key_str;
        toolConsumer.public_key = public_key_str;
        toolConsumer.public_key_jwk = jwk;

        console.log("Private Key Configured with Heroku");
        console.log(
          "The JWK needed to create a developer key in Canvas...",
          jwk
        );
      })
      .catch((err) => {
        console.error(
          `There was an error updating your tool consumers ( ${toolConsumer.name} ) with private and public keys`,
          err
        );
      });
  }
);

Promise.all(toolConsumerPromises).then(() => {
  fs.writeFileSync(
    ENV_VARIABLES_PATH,
    JSON.stringify(configsFromEnvFile, null, 2),
    "utf8"
  );
});
