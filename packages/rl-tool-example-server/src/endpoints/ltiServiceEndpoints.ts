import { Express } from "express";

import log from "../services/LogService";
import requestLogger from "../middleware/requestLogger";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const ltiServiceEndpoints = (app: Express): void => {
  app.get("/lti-service/roster", requestLogger, async (req, res) => {
    // const idToken = req.session.idToken;
    // pass the token from the session to the rl-client-lib to make the call to Canvas
    // const results = await rlClientLib.getUsers(idToken);
    // res.send(results)

    res.send("");
  });

  app.get("/lti-service/assignments", requestLogger, (req, res) => {
    res.send("");
  });

  app.get("/lti-service/grades", requestLogger, (req, res) => {
    res.send("");
  });
};

export default ltiServiceEndpoints;
