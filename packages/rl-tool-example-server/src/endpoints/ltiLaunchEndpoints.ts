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
  alg: "RS256"
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
    if (verified) getAccessToken([], plateformAccessToken);
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
