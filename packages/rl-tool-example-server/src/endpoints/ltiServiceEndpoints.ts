import { Express } from "express";
import { getUsers, createLineItem, getLineItems } from "@asu-etx/rl-client-lib";
import log from "../services/LogService";
import requestLogger from "../middleware/requestLogger";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const ltiServiceEndpoints = (app: Express): void => {
  app.get("/lti-service/roster", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("req.session.platform - " + JSON.stringify(platform));

    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const results = await getUsers(platform, { role: req.query.role });
    res.send(results);
  });

  app.get("/lti-service/assignments", requestLogger, (req, res) => {
    res.send("");
  });
  app.get("/lti-service/createassignment", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("createassignment - platform - " + platform);
    console.log("req.query - " + req.query);

    const results = await createLineItem(platform, req.query);

    res.send(results);
  });
  app.get("/lti-service/getassignment", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("createassignment - platform - " + platform);

    const results = await getLineItems(platform);

    res.send(results);
  });

  app.get("/lti-service/grades", requestLogger, (req, res) => {
    res.send("");
  });
};

export default ltiServiceEndpoints;
