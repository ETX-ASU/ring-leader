import { Express } from "express";
import {
  getUsers,
  createLineItem,
  getLineItems,
  putGrade,
  getGrades
} from "@asu-etx/rl-client-lib";
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
    const lineItemData = req.query;
    console.log(
      "createassignment - lineItemData - " + JSON.stringify(lineItemData)
    );
    const newLineItemData = {
      scoreMaximum: lineItemData.scoreMaximum,
      label: lineItemData.label,
      resourceId: "1",
      tag: lineItemData.tag,
      "https://canvas.instructure.com/lti/submission_type": {
        type: "external_tool",
        external_tool_url:
          "https://ring-leader-devesh-tiwari.herokuapp.com/assignment/" +
          lineItemData.label
      }
    };
    const results = await createLineItem(platform, newLineItemData);

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
  app.get("/lti-service/putgrades", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("createassignment - platform - " + platform);

    const results = await putGrade(
      platform,
      {
        timestamp: "2017-04-16T18:54:36.736+00:00",
        scoreGiven: 83,
        scoreMaximum: 100,
        comment: "This is exceptional work.",
        activityProgress: "Completed",
        gradingProgress: "FullyGraded",
        userId: "7cae08ba-5ecc-457a-835e-4b9b7bff806c"
      },
      {
        id: "https://unicon.instructure.com/api/lti/courses/718/line_items/188"
      }
    );

    res.send(results);
  });
  app.get("/lti-service/grades", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("createassignment - platform - " + platform);

    const results = await getGrades(platform, { resourceId: "1", id: 188 });

    res.send(results);
  });
};

export default ltiServiceEndpoints;
