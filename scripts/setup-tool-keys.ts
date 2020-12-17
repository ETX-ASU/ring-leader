import * as path from "path";
import * as fs from "fs";
import { pem2jwk } from "pem-jwk";
import { v4 as uuid } from "uuid";
import * as dotenv from 'dotenv';


import shellPromise from "./shell-promise";


const SRC_ROOT = path.resolve(
  __dirname, "../"
);

dotenv.config({ path: `${SRC_ROOT}/.env` });


const getKeyFileNames = (platformName: string) => {
  return {
    publicKeyFile: `rsa-rl-${platformName}-public.pem`,
    privateKeyFile: `rsa-rl-${platformName}-private.pem`
  };
};

// Get the TOOL_CONSUMERS from the environment variables

const ENV_VARIABLES_PATH = path.resolve(SRC_ROOT, `environments/${process.env.environment}/.tool_consumers.${process.env.environment}.json`);

console.log(`${ENV_VARIABLES_PATH} is where the script is expecting to find your tool consumer json. Please adjust for your project, if necessary`);

const toolConsumers = JSON.parse(
  fs.readFileSync(ENV_VARIABLES_PATH, "utf8")
);
const toolNames = [];
for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  const args = arg.split(/:|=/);
  if (args.length == 2 && (args[0] == "-n" || args[0] == "--name")) {
    args[1].split(",").forEach((value) => { toolConsumers.push({ name: value }) })
  }
}


let hasDuplicates = false;
for (let i = 0; i < toolConsumers.length; i++) {
  if (toolNames.indexOf(toolConsumers[i].name) >= 0) {
    hasDuplicates = true;
    console.log(
      `You can not have duplicate names for tool consumers ( ${toolConsumers[i].name} ), please remove/update duplicate names.`);

  } else {
    toolNames.push(toolConsumers[i].name);
  }
}
if (hasDuplicates) {
  throw Error("terminating");
}



const toolConsumerPromises = toolConsumers.map(
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
        const id = toolConsumer.uuid ? toolConsumer.uuid : uuid().replace(/-/g, "").toUpperCase();
        Object.assign(jwk, {
          alg: "RS256",
          use: "sig",
          kid: `${toolConsumer.name}:${id}`
        });
        toolConsumer.uuid = id;
        toolConsumer.private_key = private_key_str;
        toolConsumer.public_key = public_key_str;
        toolConsumer.public_key_jwk = jwk;
        toolConsumer.alg = jwk.alg;
        toolConsumer.keyid = jwk.kid;

        toolConsumer.client_id = toolConsumer.client_id ? toolConsumer.client_id : "client_id supplied by consumer/platform";
        toolConsumer.iss = toolConsumer.iss ? toolConsumer.iss : "iss supplied by consumer/platform";
        toolConsumer.platformOIDCAuthEndPoint = toolConsumer.platformOIDCAuthEndPoint ? toolConsumer.platformOIDCAuthEndPoint : "client_id supplied by consumer/platform";
        toolConsumer.platformAccessTokenEndpoint = toolConsumer.platformAccessTokenEndpoint ? toolConsumer.platformAccessTokenEndpoint : "platformAccessTokenEndpoint supplied by consumer/platform";
        toolConsumer.platformPublicJWKEndpoint = toolConsumer.platformPublicJWKEndpoint ? toolConsumer.platformPublicJWKEndpoint : "platformPublicJWKEndpoint supplied by consumer/platform, may not be required";
        toolConsumer.deployment_id = toolConsumer.deployment_id ? toolConsumer.deployment_id : "deployment_id supplied by consumer/platform";
        toolConsumer.toolApplicationUrl = toolConsumer.toolApplicationUrl ? toolConsumer.toolApplicationUrl : "you will need to supply the url of the react application"
        fs.unlinkSync(keyFileNames.privateKeyFile);
        fs.unlinkSync(keyFileNames.publicKeyFile);
        console.log(
          "The JWK needed to create a developer key in Canvas...",
          jwk
        );
      })
      .catch((err) => {
        console.log(
          `There was an error updating your tool consumers ( ${toolConsumer.name} ) with private and public keys`,
          err
        );
      });
  }
);

Promise.all(toolConsumerPromises).then(() => {
  fs.writeFileSync(
    ENV_VARIABLES_PATH,
    JSON.stringify(toolConsumers, null, 2),
    "utf8"
  );
});
