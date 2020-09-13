import { Express } from "express";

import log from "../services/LogService";
import requestLogger from "../middleware/requestLogger";
import { APPLICATION_URL } from "../environment";

const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";

const ltiLaunchEndpoints = (app: Express): void => {
  app.get("/tool-info", requestLogger, (req, res) => {
    res.send({
      "OpenID Connect Initiation Url": `${APPLICATION_URL}${OIDC_LOGIN_INIT_ROUTE}`,
      "Target Link URI": `${APPLICATION_URL}${LTI_ADVANTAGE_LAUNCH_ROUTE}`
    });
  });

  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    res.send("");
  });

  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, (req, res) => {
    res.redirect(`/instructor`);
  });
};

export default ltiLaunchEndpoints;
