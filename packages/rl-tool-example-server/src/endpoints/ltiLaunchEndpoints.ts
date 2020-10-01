import { Express } from "express";

import getConnection from "@asu-etx/rl-server-lib/src/database/db";
import ToolConsumer from "@asu-etx/rl-server-lib/src/database/entities/ToolConsumer";
import { initOidcGet, initOidcPost, toolInfoGet, assignmentRedirectPost, ltiLaunchPost } from "@asu-etx/rl-server-lib/src/services/ltiLaunchService";
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
const LTI_ASSIGNMENT_REDIRECT = "/assignment";
const LTI_STUDENT_REDIRECT = "/student";


const ltiLaunchEndpoints = (app: Express): void => {
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

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get("/tool-info", requestLogger, async (req, res) => {
    toolInfoGet(req, res, APPLICATION_URL);
  });
};

export default ltiLaunchEndpoints;
