import * as path from "path";
import * as fs from "fs";
import shellPromise from "./shell-promise";
import { pem2jwk } from "pem-jwk";

const PRIVATE_KEY_FILE = "rsa_ring_leader_private.pem";
const PUBLIC_KEY_FILE = "rsa_ring_leader_public.pem";

// NOTE: If any of these key generation commands fail
// USE IMS Globals site: https://lti-ri.imsglobal.org/keygen/index

shellPromise(
  `openssl genpkey -algorithm RSA -out ${PRIVATE_KEY_FILE} -pkeyopt rsa_keygen_bits:2048`
)
  .then(() => {
    return shellPromise(
      `openssl rsa -in ${PRIVATE_KEY_FILE} -pubout -out ${PUBLIC_KEY_FILE}`
    );
  })
  .then(() => {
    console.log("Public and Private Key Generated...");
    // create the JWK
    return true;
  })
  .then(() => {
    console.log("JWK created...");
    const rsaPrivateKey = "awesome";
    const public_key_str = fs.readFileSync(PUBLIC_KEY_FILE, "ascii");
    const jwk = pem2jwk(public_key_str);

    Object.assign(jwk, {
      use: "sig",
      kid: "ASU ETX - Ring Leader Public Key"
    });

    console.log("Private Key Configured with Heroku");
    console.log("The JWK needed to create a developer key in Canvas...", jwk);

    return true;
  })
  .catch((err) => {
    console.error(
      "There was an error setting up your public and private keys",
      err
    );
  });
