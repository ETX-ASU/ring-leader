import { Express } from "express";
import {
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  deepLinkRedirect
} from "../services/ltiLaunchService";


import requestLogger from "../middleware/requestLogger";
import {
  OIDC_LOGIN_INIT_ROUTE,
  LTI_ADVANTAGE_LAUNCH_ROUTE,
  LTI_ASSIGNMENT_REDIRECT,
  LTI_DEEPLINK_REDIRECT,
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
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req: any, res: any) => {
    initOidcGet(req, res);
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req: any, res: any) => {
    initOidcPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, async (req: any, res: any) => {
    ltiLaunchPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ASSIGNMENT_REDIRECT, requestLogger, async (req: any, res: any) => {
    assignmentRedirectPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_DEEPLINK_REDIRECT, requestLogger, async (req: any, res: any) => {
    logger.debug(`LTI_DEEPLINK_REDIRECT:${LTI_DEEPLINK_REDIRECT}`);
    deepLinkRedirect(req, res);
  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get(TOOL_INFO, requestLogger, async (req: any, res: any) => {
    toolInfoGet(req, res, APPLICATION_URL);
  });
};

export default rlLtiLaunchExpressEndpoints;
