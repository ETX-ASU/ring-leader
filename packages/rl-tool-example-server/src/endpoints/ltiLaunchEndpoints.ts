import path from "path";
import { Express } from "express";
import {
  rlInitiateOIDC,
  validateToken,
  getAccessToken
} from "@asu-etx/rl-server-lib";
import getConnection from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import requestLogger from "../middleware/requestLogger";
import { APPLICATION_URL } from "../environment";

const getToolConsumers = async (): Promise<ToolConsumer[]> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumers = await toolConsumerRepository.find();
  return toolConsumers;
};

const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";
const LTI_INSTRUCTOR_REDIRECT = "/instructor";
const LTI_STUDENT_REDIRECT = "/student";
const plateformAccessToken = {
  // we get this during plateform registration
  platformAccessTokenEndpoint:
    "https://lti-ri.imsglobal.org/platforms/1285/access_tokens", // we get this during plateform registration
  clientId: "SDF7ASDLSFDS9",
  platformKid: "ASU ETX - Ring Leader - rl-ims-platform - Public Key",
  alg: "RS256",
  platformPrivateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOI9+BLsd6mNl0\n++IgU3aYXWaTPSFr141+9j+LewXuxAjcyM7dz5JT/AsHIvzy5IgmQVJaNA3ZoGvi\nYAPsPlJwdUzCe1NOLuCZGCTIDRWJceDrmyCyWUgTabpxqd6dPPH+5w+3Fhhewb/2\n7FjaZrOF04KLM8+1rt/8AUaJE15rUEZR8LnVTAkKNOmUGX3jo8dhVwrMbz9GRCx0\n2yIP04D2LkcLAjgYQMh4gkCnq/qoFfe2Q3y586Qz3nuH/P4N6qn8lUtzJhPx96sZ\nt0DtZAFxWV+Zf+Tn4FFeAvRtw82pqoQsUFG0CxQMR757iBEQIzW5nJDgbLN0Xn0n\nVlxJ5yUBAgMBAAECggEAYok1SkvxIII12Dya/7bFxtlGsfUTp7gWs+zDvUmmMVbV\noav/bnnNSYX+Q4APB5AEIL0yv1mIkVGkoEYjOeckgwsfEQvga0vvIl8vHc1bUSL1\nT8oMXBRfZqAwdiqr9d9vEdijY3IVXh4hQ8gARQ24nKzZBu9SR1d7S7vUWqu+g260\n9GziOCpMie2Fhu7XyiD50IeyzawXgwJylX75IiVQO9ID77aOlOmgDQhkSCC4TVtp\n2+yMco+lC4KnGWjJQSpTf7icg8v4H6i+f8aqmWoh/kEHJwe/UZQa7Fm7O9Zde/Dm\n9jmIRteNNDTTp+rdXMa5eD2/uNi/QEQ5TOkLUWYC0QKBgQDx8M42/OmPsgvMXCGX\nuujllpfWyzVVIwPy7MjUtE3RAORLmwqkRK0tm/2ItYG4zM1rvxyigQDisxwKup3o\n6fNDbC7VJNw5iXB+5QgqWwaguy4Ne0L+Sx7/kASrqlFkSW/aFTBUQD+tUlV1iYHi\nvxuoJUWmi5SFN7fPU5a1228WzQKBgQDaHnyE2NJbf7ZBPqIx3yTv2gQSqRoI3wpo\nfM5dRGRmdZXRrm3F2+TTTJFCgPwXQ6Ha87EVq//LEBJuFrLQcr0KOLtIvoyzHOPs\nC1MkuYjhpvxYd5kZ41tKKx1Q8nA8O2U5amaAP4VA7N+MSJ38w+iraDOUnKN81XPx\nhZLh/hx/BQKBgGVMngsH+gLgWXBHYwlUiQ8X7ptQmhP7hTvBSJVGqQ5JgUzmrZ35\n40ild5I17QqjNZ9XdXXU7bn9pFAZsuRCkEg6k6FKvaqZkTCQVMrnMe86cB3U7kfq\nzB/U/R+jQFDtLpfxJzsfa4n2XzHHUUrPGZVdhbwl1RmyKpP0O7YJGopBAoGBAK3Y\n/LA5zLgm+5HXJRmQ3HTblMF2zIxjkX0kdKq71zYe5FGisFWyZRjQ/zo9ai/0tO25\nq9w1IgSsg7QBHXas7OVXwFZDogskrLk3cYZk5qfMG3c7o+iRYPKlmJErGq+3O3/e\nwWHYvxG3epnqSxnq3+i2fd4mVtwpmWbYavD7Q6UtAoGAApJHttSFafziSyYgBs6a\nnOHrvRX8YAw2WtczJXRUnzQtQ/CGJ3QvU7LlKrcuOKmx9LFKQcuwl6X5HcIZBBUG\nQ6hRwFQAMhnrTsNilpkc2u3PY1SSNFC74oDJMWZe028lqGXH9xp03Vw82Mlb4flZ\naEnctW0oRkooi+MT/fcp6Ig=\n-----END PRIVATE KEY-----\n"
};

const plateformLaunch = {
  plateformOIDCAuthEndPoint:
    "https://lti-ri.imsglobal.org/platforms/1285/authorizations/new", // we get this during plateform registration
  nounce: "SDF7ASDLSFDS9", //This is the same value that passed during the OIDC request. Tool need to pass this.
  state: "SDF7ASDLSFDS9", //This is the same value that passed during the OIDC request. Tool need to pass this.
  clientId: "SDF7ASDLSFDS9"
};
const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    console.log(req);
    rlInitiateOIDC(req, res, plateformLaunch);
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    // OIDC POST initiation
    console.log(req);
    rlInitiateOIDC(req, res, plateformLaunch);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, (req, res) => {
    console.log("LTI Advantage Token");
    console.log(req);
    const verified = validateToken(req, plateformLaunch);
    console.log(verified);
    if (verified) getAccessToken(plateformAccessToken);
    res.redirect(LTI_INSTRUCTOR_REDIRECT);
  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get("/tool-info", requestLogger, async (req, res) => {
    const integrationInfo = {
      "OpenID Connect Initiation Url": `${path.join(
        APPLICATION_URL,
        OIDC_LOGIN_INIT_ROUTE
      )}`,
      "Target Link URI": `${path.join(
        APPLICATION_URL,
        LTI_ADVANTAGE_LAUNCH_ROUTE
      )}`,
      "Redirect URIS:": [
        `${path.join(APPLICATION_URL, LTI_INSTRUCTOR_REDIRECT)}`,
        `${path.join(APPLICATION_URL, LTI_STUDENT_REDIRECT)}`
      ]
    };

    const toolConsumers = await getToolConsumers();
    const sanitizedToolConsumers = toolConsumers.map(
      ({ name, public_key_jwk, client_id }) => {
        return {
          name,
          public_key_jwk: JSON.parse(public_key_jwk), // a string that needs to be parsed
          client_id
        };
      }
    );

    const data = JSON.stringify(
      {
        integrationInfo,
        toolConsumers: sanitizedToolConsumers
      },
      null,
      2
    );

    res.send(`<pre>${data}</pre>`);
  });
};

export default ltiLaunchEndpoints;
