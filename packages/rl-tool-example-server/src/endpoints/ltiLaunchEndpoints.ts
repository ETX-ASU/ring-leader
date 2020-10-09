import { Express } from "express";


import { rlLtiLaunchExpressEndpoints } from "@asu-etx/rl-server-lib";


const ltiLaunchEndpoints = (app: Express): void => {
  rlLtiLaunchExpressEndpoints(app);
};

export default ltiLaunchEndpoints;
