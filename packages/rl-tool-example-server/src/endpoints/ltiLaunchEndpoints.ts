import path from "path";
import { Express } from "express";
import url from "url";
import { rlProcessOIDCRequest, rlValidateToken } from "@asu-etx/rl-server-lib";
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

const plateformLaunch = {
  plateformOIDCAuthEndPoint:
    "https://unicon.instructure.com/api/lti/authorize_redirect" // we get this during plateform registration
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
      await req.session.save(() => {
        console.log("session data saved");
      });
    } else {
      throw new Error("no session detected, something is wrong");
    }

    res.redirect(
      url.format({
        pathname: plateformLaunch.plateformOIDCAuthEndPoint,
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
        pathname: plateformLaunch.plateformOIDCAuthEndPoint,
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
    const oidcOriginalResponseData = {
      nonce: req.session.nonce,
      state: req.session.state,
      client_id: req.session.client_id
    };
    console.log("oidcOriginalResponseData - " + oidcOriginalResponseData);
    const verified = rlValidateToken(req, oidcOriginalResponseData);
    console.log("Is Valid Token");
    console.log(verified.isValidToken);

    req.session.token = verified.token;

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
