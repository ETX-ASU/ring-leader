import { Express } from "express";
import {
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  deepLinkRedirect
} from "../services/ltiLaunchService";

import validateSession from "../services/validationService";
import requestLogger from "../middleware/requestLogger";
import {
  OIDC_LOGIN_INIT_ROUTE,
  LTI_ADVANTAGE_LAUNCH_ROUTE,
  LTI_ASSIGNMENT_REDIRECT,
  LTI_DEEPLINK_REDIRECT,
  LTI_SESSION_VALIDATION_ENDPOINT,
  TOOL_INFO,
  APPLICATION_URL,
  logger
}  from "@asu-etx/rl-shared";

/**
 * @description Creates a set of endpoints to support LTI1.3 launch given an Express application.
 * @param {Object} app - the express application that needs to bind endpoints.
 *
 **/
const rlLtiLaunchExpressEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req, res) => {
    initOidcGet(req, res);
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req, res) => {
    initOidcPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, async (req, res) => {
    ltiLaunchPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ASSIGNMENT_REDIRECT, requestLogger, async (req, res) => {
    assignmentRedirectPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_DEEPLINK_REDIRECT, requestLogger, async (req, res) => {
    logger.debug(`LTI_DEEPLINK_REDIRECT:${LTI_DEEPLINK_REDIRECT}`);
    deepLinkRedirect(req, res);
  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get(TOOL_INFO, requestLogger, async (req, res) => {
    toolInfoGet(req, res, APPLICATION_URL);
  });

  app.get(LTI_SESSION_VALIDATION_ENDPOINT, requestLogger, async (req, res) => {
    res.send({ isValid: validateSession(req.session) });
  });
};

export default rlLtiLaunchExpressEndpoints;
