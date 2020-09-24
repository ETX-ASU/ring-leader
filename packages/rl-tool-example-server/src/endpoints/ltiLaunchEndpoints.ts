import path from "path";
import { Express } from "express";
import url from "url";
import {
  rlProcessOIDCRequest,
  rlValidateToken,
  RlPlatform
} from "@asu-etx/rl-server-lib";
import getConnection from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import requestLogger from "../middleware/requestLogger";
import { APPLICATION_URL } from "../environment";
import { generateUniqueString } from "../generateUniqueString";

const getToolConsumers = async (): Promise<ToolConsumer[]> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumers = await toolConsumerRepository.find();
  return toolConsumers;
};

const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";
const LTI_INSTRUCTOR_REDIRECT = "/instructor";
const LTI_ASSIGNMENT_REDIRECT = "/assignment";
const LTI_STUDENT_REDIRECT = "/student";

const plateformDetails = {
  plateformOIDCAuthEndPoint:
    "https://unicon.instructure.com/api/lti/authorize_redirect",
  platformAccessTokenEndpoint:
    "https://unicon.instructure.com/login/oauth2/token",
  alg: "RS256",
  keyid: "ASU ETX - Ring Leader - canvas-unicon - Public Key",
  platformPulicKey:
    "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwwehTRklLt45mS5SIoGD\nqxKtqzSCvP9OteEVAECqVZGNRWkTUbYbDifV89MCuEHGZ9nkcZH8SmDDQeGf6byp\nVwArZI8Gyf80XrK8xvUEyCqbJF7Nwv7TQ4A3SEF7yXH8/9oDeMxXYoUe5g0fqqxv\nzBVAPOc2P4BtsEUr3komt6QOOQ+Ld6HWpFl+zoszUdAO6Wxx6V89IJhi87+uAell\nacKlhHO77zQUAaWAOT+WO10aLWf5JsMz/rIWDhNzJuceRzDkcbCu/mTw8IPEMuXQ\nGl0fjk7VunyqcGWcAbEuUeQU6Qdp7uOQs9gbHI3RWyUc1Dk/AJpY6hY9cdTFBojD\nnwIDAQAB\n-----END PUBLIC KEY-----\n" //plateform.platformKid
};
const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req, res) => {
    const nonce = generateUniqueString(25, false);
    const state = generateUniqueString(30, false);
    //This resposne will be save in session or DB and will be used in validating the nonce and other properties
    const response: any = rlProcessOIDCRequest(req, state, nonce);

    if (req.session) {
      req.session.nonce = nonce;
      req.session.state = state;
      req.session.client_id = response.client_id;
      req.session.plateformDetails = plateformDetails;
      await req.session.save(() => {
        console.log("session data saved");
      });
    } else {
      throw new Error("no session detected, something is wrong");
    }

    res.redirect(
      url.format({
        pathname: plateformDetails.plateformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req, res) => {
    // OIDC POST initiation

    const nonce = generateUniqueString(25, false);
    const state = generateUniqueString(30, false);
    const response: any = rlProcessOIDCRequest(req, state, nonce);

    if (req.session) {
      req.session.nonce = nonce;
      req.session.state = state;
      req.session.client_id = response.client_id;

      await req.session.save(() => {
        console.log("session data saved");
      });
    } else {
      throw new Error("no session detected, something is wrong");
    }
    console.log("req.session");
    console.log(req.session);

    res.redirect(
      url.format({
        pathname: plateformDetails.plateformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    console.log("req.session-LTI_ADVANTAGE_LAUNCH_ROUTE");
    console.log(req.session);

    const verifiedTokenData = rlValidateToken(req, req.session);

    const rlPlatform = RlPlatform(
      plateformDetails.platformPulicKey,
      plateformDetails.plateformOIDCAuthEndPoint,
      plateformDetails.platformAccessTokenEndpoint,
      plateformDetails.keyid,
      plateformDetails.alg,
      verifiedTokenData.token
    );

    req.session.platform = rlPlatform;
    console.log(
      "req.session.platform - " + JSON.stringify(req.session.platform)
    );
    await req.session.save(() => {
      console.log("session data saved");
    });
    res.redirect(LTI_ASSIGNMENT_REDIRECT);
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
