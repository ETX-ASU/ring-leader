import { Express } from "express";

import { Grade } from "../services/assignmentAndGradeService";
import { DeepLinking } from "../services/DeepLinking";
import { NamesAndRoles } from "../services/namesAndRolesService";

import requestLogger from "../middleware/requestLogger";

const DEFAULT_ENDPOINTS: any = {
  LTI_ROSTER_ENDOINT: "/lti-service/roster",
  LTI_ASSIGNMENT_ENDOINT: "/lti-service/assignments",
  LTI_ASSIGNMENT_SCORE: "/lti-service/assignments",
}
const rlLtiServiceEndpoints = (app: Express): void => {

  app.get("/lti-service/roster", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("req.session.platform - " + JSON.stringify(platform));

    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const results = await new NamesAndRoles().getMembers(platform, { role: req.query.role });
    req.session.members = results.members;
    await req.session.save(() => {
      console.log("session data saved");
    });
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
    const resourceId = Math.floor(Math.random() * 100) + 1;
    const newLineItemData = {
      scoreMaximum: lineItemData.scoreMaximum,
      label: lineItemData.label,
      resourceId: resourceId,
      tag: lineItemData.tag,
      "https://canvas.instructure.com/lti/submission_type": {
        type: "external_tool",
        external_tool_url: `https://ring-leader-devesh-tiwari.herokuapp.com/assignment?resourceId=${resourceId}`
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
    console.log(`createassignment - platform - ${JSON.stringify(platform)}`);

    const results = await getLineItems(platform);
    req.session.assignments = results;
    await req.session.save(() => {
      console.log("session data saved");
    });
    res.send(results);
  });


  app.get("/lti-service/putgrades", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    const scoreData = req.query;
    console.log("createassignment - platform - " + platform);
    const options = {
      id: scoreData.assignmentId
    };
    const results = await putGrade(
      platform,
      {
        timestamp: "2020-10-05T18:54:36.736+00:00",
        scoreGiven: scoreData.grade,
        scoreMaximum: 100,
        comment: "This is exceptional work.",
        activityProgress: "Completed",
        gradingProgress: "FullyGraded",
        userId: "fa8fde11-43df-4328-9939-58b56309d20d"
      },
      options
    );

    res.send(results);
  });
  app.get("/lti-service/grades", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log("createassignment - platform - " + platform);

    const results: any = ([] = await getGrades(platform, {
      id: req.query.assignmentId,
      resourceLinkId: false
    }));
    const scoreData = [];
    console.log("req.session.members - " + JSON.stringify(req.session.members));
    console.log(" results[0].results - " + JSON.stringify(results[0].results));

    const members = req.session.members;

    for (const key in results[0].results) {
      console.log("key - " + JSON.stringify(key));
      const score = results[0].results[key];
      console.log("score - " + JSON.stringify(score));
      const tooltipsData = members.filter(function (member: any) {
        return member.user_id == score.userId;
      });
      console.log("tooltipsData - " + JSON.stringify(tooltipsData));

      scoreData.push({
        userId: score.userId,
        StudenName: tooltipsData[0].name,
        score: score.resultScore,
        comment: score.comment
      });
    }
    console.log("scoreData - " + scoreData);

    res.send(scoreData);
  });
};

export default ltiServiceEndpoints;
