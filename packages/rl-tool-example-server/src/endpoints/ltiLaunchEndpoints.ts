import { Express } from "express";


import { rlLtiLaunchExpressEndpoints } from "@asu-etx/rl-server-lib";

import { APPLICATION_URL } from "../environment";


const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";
const LTI_ASSIGNMENT_REDIRECT = "/assignment";

const LTI_STUDENT_REDIRECT = "/student"
const LTI_INSTRUCTOR_REDIRECT = "/instructor";

const ltiLaunchEndpoints = (app: Express): void => {
  rlLtiLaunchExpressEndpoints(app, APPLICATION_URL)
};

export default ltiLaunchEndpoints;
