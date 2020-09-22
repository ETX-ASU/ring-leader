import { Express } from "express";
import { getUsers } from "@asu-etx/rl-client-lib";
import log from "../services/LogService";
import requestLogger from "../middleware/requestLogger";
import { getAccessToken } from "@asu-etx/rl-server-lib";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const ltiServiceEndpoints = (app: Express): void => {
  app.get("/lti-service/roster", requestLogger, async (req, res) => {
    console.log("/lti-service/roster");
    console.log(req);
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const tokenObject = req.session.tokenObject;
    console.log("This is idtoken from session-" + tokenObject);

    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const results = await getUsers(tokenObject);
    res.send(results);
  });

  app.get("/lti-service/accesstoken", requestLogger, async (req, res) => {
    console.log("/lti-service/accesstoken");
    console.log(req);
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const tokenObject = req.session.tokenObject;

    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const tokenRes = await getAccessToken(
      tokenObject,
      "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
    );
    res.send(tokenRes);
  });

  app.get("/lti-service/assignments", requestLogger, (req, res) => {
    res.send("");
  });

  app.get("/lti-service/grades", requestLogger, (req, res) => {
    res.send("");
  });
};

export default ltiServiceEndpoints;
