import { Express } from "express";


import { initOidcGet, initOidcPost, toolInfoGet, assignmentRedirectPost, ltiLaunchPost } from "../services/ltiLaunchService";
import requestLogger from "../middleware/requestLogger";



const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";
const LTI_ASSIGNMENT_REDIRECT = "/assignment";
const LTI_DEEPLINK_REDIRECT = "/deeplink";
/**
   * @description Creates a set of endpoints to support LTI1.3 launch given an Express application.
   * @param {Object} app - the express application that needs to bind endpoints.
   * @param {String} applicationUrl - application url.
   * 
**/
const rlLtiLaunchExpressEndpoints = (app: Express, applicationUrl: String): void => {
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

  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get("/tool-info", requestLogger, async (req, res) => {
    toolInfoGet(req, res, applicationUrl);
  });
};

export default rlLtiLaunchExpressEndpoints;
