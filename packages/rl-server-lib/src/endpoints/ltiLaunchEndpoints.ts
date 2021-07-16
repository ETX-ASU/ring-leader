import { Express } from "express";
import {
  initOidcGetPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  deepLinkRedirect,
} from "../services/ltiLaunchService";

import { getToolConsumerByName, getJwks } from "../services/ToolConsumerService";

import requestLogger from "../middleware/requestLogger";
import {
  OIDC_LOGIN_INIT_ROUTE,
  LTI_ADVANTAGE_LAUNCH_ROUTE,
  LTI_ASSIGNMENT_REDIRECT,
  TOOL_INFO,
  APPLICATION_URL,
  logger,
  LTI_DEEPLINK_REDIRECT,
  GET_JWKS_ENDPOINT
} from "@asu-etx/rl-shared";
import ToolConsumer from "../database/entity/ToolConsumer";

/**
 * @description Creates a set of endpoints to support LTI1.3 launch given an Express application.
 * @param {Object} app - the express application that needs to bind endpoints.
 *
 **/
const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req: any, res: any) => {
    initOidcGetPost(req, res);
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req: any, res: any) => {
    initOidcGetPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, async (req: any, res: any) => {
    ltiLaunchPost(req, res);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ASSIGNMENT_REDIRECT, requestLogger, async (req: any, res: any) => {
    assignmentRedirectPost(req, res);
  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get(TOOL_INFO, requestLogger, async (req: any, res: any) => {
    toolInfoGet(req, res, APPLICATION_URL);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_DEEPLINK_REDIRECT, requestLogger, async (req: any, res: any) => {
    logger.debug(`LTI_DEEPLINK_REDIRECT:${LTI_DEEPLINK_REDIRECT}`);
    deepLinkRedirect(req, res);
  });

  app.get(GET_JWKS_ENDPOINT, requestLogger, async (req: any, res: any) => {
    const query: any = req.query;
    const consumerTool: ToolConsumer | undefined = getToolConsumerByName(
      query.name
    );

    if (consumerTool) {
      logger.debug("found jwk" + JSON.stringify([consumerTool.public_key_jwk]));
      res.send([consumerTool.public_key_jwk]);
    } else {
      logger.debug("found jwks" + JSON.stringify(getJwks()));
      res.send(getJwks());
    }
  });
};

export default ltiLaunchEndpoints;
