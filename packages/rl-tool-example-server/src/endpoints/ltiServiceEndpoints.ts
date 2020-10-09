import { Express } from "express";


import { rlLtiServiceExpressEndpoints } from "@asu-etx/rl-server-lib";

import { APPLICATION_URL } from "../environment";

const ltiServiceEndpoints = (app: Express): void => {
  rlLtiServiceExpressEndpoints(app, APPLICATION_URL)
};

export default ltiServiceEndpoints;
