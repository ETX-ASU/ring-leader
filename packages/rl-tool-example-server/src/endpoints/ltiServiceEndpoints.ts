import { Express } from "express";
import {
  getUsers,
  createLineItem,
  getLineItems,
  putGrade,
  getGrades,
  createDeepLinkingForm,
  deleteLineItems
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
        external_tool_url:
          "https://ring-leader-devesh-tiwari.herokuapp.com/assignment?resourceId=" +
          resourceId
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
    req.session.assignments = results;
    await req.session.save(() => {
      console.log("session data saved");
    });
    res.send(results);
  });

  app.get(
    "/lti-service/getunassignedstudets",
    requestLogger,
    async (req, res) => {
      if (!req.session) {
        throw new Error("no session detected, something is wrong");
      }
      const scoreData = [];
      const platform: any = req.session.platform;
      console.log("getunassignedstudets - platform - " + platform);
      const results: any = ([] = await getGrades(platform, {
        id: req.query.assignmentId,
        resourceLinkId: false
      }));
      const members = req.session.members;
      console.log("members - " + JSON.stringify(members));
      console.log("results[0].results - " + JSON.stringify(results[0].results));
      for (const key in members) {
        const score = members[key];
        console.log("score-" + JSON.stringify(score));

        const tooltipsData = results[0].results.filter(function (member: any) {
          return member.userId == score.user_id;
        });
        console.log("tooltipsData - " + JSON.stringify(tooltipsData));
        if (tooltipsData.length <= 0)
          scoreData.push({
            userId: score.userId,
            StudenName: score.name
          });
      }
      console.log("scoreData-" + JSON.stringify(scoreData));

      res.send(scoreData);
    }
  );
  app.get(
    "/lti-service/putGradesStudentView",
    requestLogger,
    async (req, res) => {
      if (!req.session) {
        throw new Error("no session detected, something is wrong");
      }
      const sessionObject = req.session;
      const platform: any = req.session.platform;
      console.log(
        "putGradesStudentView -platform - " + JSON.stringify(platform)
      );
      const scoreData = req.query;
      console.log(
        "putGradesStudentView -req.session - " + JSON.stringify(req.session)
      );

      scoreData.userId = platform.userId;
      scoreData.grade = scoreData.grade;

      console.log(
        "putGradesStudentView - platform - " + JSON.stringify(platform)
      );

      const options = {
        id: platform.lineitem,
        userId: scoreData.userId,
        title: platform.lineitem || sessionObject.title || null
      };
      console.log("sessionObject.title" + JSON.stringify(sessionObject.title));
      console.log(
        "putGradesStudentView - options - " + JSON.stringify(options)
      );
      const results = await putGrade(
        platform,
        {
          timestamp: "2020-10-05T18:54:36.736+00:00",
          scoreGiven: scoreData.grade,
          scoreMaximum: 100,
          comment: "This is exceptional work.",
          activityProgress: "Completed",
          gradingProgress: "FullyGraded",
          userId: scoreData.userId
        },
        options
      );

      res.send(results);
    }
  );
  app.get("/lti-service/deeplink", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;

    console.log("deeplink - platform - " + JSON.stringify(platform));
    const items = [
      {
        type: "ltiResourceLink",
        title: "DeepLink ltiResourceLink",
        url:
          "https://ring-leader-devesh-tiwari.herokuapp.com/assignment?resourceId=76",
        lineItem: {
          scoreMaximum: 100,
          label: "Chapter 12 quiz",
          resourceId: "Chapter12quiz",
          tag: "quiz"
        },
        available: {
          startDateTime: "2020-10-06T20:05:02Z",
          endDateTime: "2020-10-30T20:05:02Z"
        },
        submission: {
          endDateTime: "2020-10-30T20:05:02Z"
        },
        custom: {
          quiz_id: "az-123",
          duedate: "$Resource.submission.endDateTime"
        }
      }
    ];

    // Creates the deep linking request form
    const form = await createDeepLinkingForm(platform, items, {
      message: "Successfully registered resource!"
    });

    return res.send(form);
  });

  app.post("/lti-service/putgrades", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    const scoreData = req.body.params;
    console.log("createassignment - platform - " + platform);
    const options = {
      id: scoreData.assignmentId,
      userId: scoreData.userId
    };
    console.log("scoreData - " + JSON.stringify(scoreData));
    console.log("options - " + JSON.stringify(options));

    const results = await putGrade(
      platform,
      {
        timestamp: "2020-10-05T18:54:36.736+00:00",
        scoreGiven: scoreData.grade,
        scoreMaximum: 100,
        comment: "This is exceptional work.",
        activityProgress: "Completed",
        gradingProgress: "FullyGraded",
        userId: scoreData.userId
      },
      options
    );

    res.send(results);
  });

  app.delete("/lti-service/deleteLineItem", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    const options = {
      id: req.query.assignmentId
    };
    console.log("delete line item options -" + JSON.stringify(options));

    const results = await deleteLineItems(platform, options);

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
    console.log(" results - " + JSON.stringify(results));
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
