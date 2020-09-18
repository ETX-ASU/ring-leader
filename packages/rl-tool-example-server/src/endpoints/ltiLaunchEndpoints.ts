import path from "path";
import { Express } from "express";
import url from "url";
import {
  rlProcessOIDCRequest,
  rlValidateToken,
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

const plateformLaunch = {
  plateformOIDCAuthEndPoint:
    "https://unicon.instructure.com/api/lti/authorize_redirect" // we get this during plateform registration
};

const ltiLaunchEndpoints = (app: Express, session: any): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    console.log(req);

    const nonce = "state";
    const state = "state";

    const response: any = rlProcessOIDCRequest(req, state, nonce);
    session.response = response;

    //This resposne will be save in session or DB and will be used in validating the nonce and other properties
    res.redirect(
      url.format({
        pathname: plateformLaunch.plateformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    // OIDC POST initiation
    console.log(req);
    const response: any = rlProcessOIDCRequest(req);
    session.response = response;
    res.redirect(
      url.format({
        pathname: plateformLaunch.plateformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, (req, res) => {
    console.log("LTI Advantage Token");
    console.log(req);
    console.log("session.response");
    console.log(session.response);

    const verified = rlValidateToken(req, session.response);
    console.log(verified);
    console.log("Is Valid Token");
    console.log(verified.isValidToken);
    console.log("id_token from plateform");
    console.log(verified.token);

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
