import { Express } from "express";


import { rlLtiServiceExpressEndpoints } from "@asu-etx/rl-server-lib";


const ltiServiceEndpoints = (app: Express): void => {
  rlLtiServiceExpressEndpoints(app);
};

export default ltiServiceEndpoints;
