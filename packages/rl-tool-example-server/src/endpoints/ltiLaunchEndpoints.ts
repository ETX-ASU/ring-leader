import { Express } from "express";


import { rlLtiLaunchExpressEndpoints } from "@asu-etx/rl-server-lib";

import { APPLICATION_URL } from "../environment";

const ltiLaunchEndpoints = (app: Express): void => {
  rlLtiLaunchExpressEndpoints(app, APPLICATION_URL);
};

export default ltiLaunchEndpoints;
