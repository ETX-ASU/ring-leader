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

import {
  requestLogger
} from "@asu-etx/rl-server-lib";

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
    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const results = await getUsers(platform, { role: req.query.role });

    // we are storing member data in session only for demo purpose. We are using this in grade call. more comment in Grade service call
    //In production env, we should call the Name and Role service and get the user details from there
    req.session.members = results.members;
    await req.session.save(() => {
      console.log("session data saved");
    });
    res.send(results);
  });
<<<<<<< HEAD
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
=======
>>>>>>> feature/example-app-canvas-integration

  app.get("/lti-service/createassignment", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    const reqQueryString = req.query;

    const resourceId = Math.floor(Math.random() * 100) + 1;

    //external_tool_url - Tool needs to pass this URL that will be launched when student
    //clicks on the assignment.
    //resourceId - this id is passed from platform to the tool so that the tool can
    //identify the correct content that needs to be displayed
    const lineItem = {
      scoreMaximum: reqQueryString.scoreMaximum,
      label: reqQueryString.label,
      resourceId: resourceId,
      tag: reqQueryString.tag,
      "https://canvas.instructure.com/lti/submission_type": {
        type: "external_tool",
        external_tool_url:
          "https://ring-leader-devesh-tiwari.herokuapp.com/assignment?resourceId=" +
          resourceId
      }
    };
    const results = await createLineItem(platform, lineItem);

    res.send(results);
  });

  app.get("/lti-service/getassignment", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log(`createassignment - platform - ${JSON.stringify(platform)}`);

    const results = await getLineItems(platform);

    res.send(results);
  });

  app.get(
    "/lti-service/getunassignedstudets",
    requestLogger,
    async (req, res) => {
      if (!req.session) {
        throw new Error("no session detected, something is wrong");
      }
      //The idea here is that once all the students are graded
      //we get list of all the students associated to the course and try to find out all the students who are not graded.
      // we assume that if a student is not graded then he was assigned that assignment
      const scoreData = [];
      const platform: any = req.session.platform;
      const results: any = ([] = await getGrades(platform, {
        id: req.query.assignmentId,
        resourceLinkId: false
      }));
      const members = req.session.members;
      for (const key in members) {
        const score = members[key];

        const tooltipsData = results[0].results.filter(function (member: any) {
          return member.userId == score.user_id;
        });
        if (tooltipsData.length <= 0)
          scoreData.push({
            userId: score.userId,
            StudenName: score.name
          });
      }
      res.send(scoreData);
    }
  );

  app.post(
    "/lti-service/putGradeStudentView",
    requestLogger,
    async (req, res) => {
      if (!req.session) {
        throw new Error("no session detected, something is wrong");
      }
      const sessionObject = req.session;
      const platform: any = sessionObject.platform;
      const score = req.body.params;

      const results = await putGrade(
        platform,
        {
          timestamp: new Date().toISOString(),
          scoreGiven: score.grade,
          comment: score.comment,
          activityProgress: score.activityProgress,
          gradingProgress: score.gradingProgress,
          userId: platform.userId
        },
        {
          id: platform.lineitem,
          userId: platform.userId,
          title: platform.lineitem || sessionObject.title || null
          //if platform.lineitem is null then it means that the SSO was not performed hence we
          //will fetch line item id by matching the assignment title.
        }
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
          duedate: "2020-10-30T20:05:02Z"
        }
      }
    ];

    // Creates the deep linking request form
    const form = await createDeepLinkingForm(platform, items, {
      message: "Successfully registered resource!"
    });

    return res.send(form);
  });

  app.post("/lti-service/putGrade", requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const sessionObject = req.session;
    const platform: any = req.session.platform;
    const score = req.body.params;

    const results = await putGrade(
      platform,
      {
        timestamp: new Date().toISOString(),
        scoreGiven: score.grade,
        comment: score.comment,
        activityProgress: score.activityProgress,
        gradingProgress: score.gradingProgress
      },
      {
        id: score.assignmentId || null,
        userId: score.userId,
        title: platform.lineitem || sessionObject.title || null
        //if platform.lineitem is null then it means that the SSO was not performed hence we
        //will fetch line item id by matching the assignment title.
      }
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
    const results: any = ([] = await getGrades(platform, {
      id: req.query.assignmentId,
      resourceLinkId: false
    }));
    const scoreData = [];
    console.log(" results[0].results - " + JSON.stringify(results[0].results));

    const members = req.session.members;

    for (const key in results[0].results) {
      const score = results[0].results[key];
      //Grades service call will only return user Id along with the score
      //so for this demo, we are retrieving the user info from the session
      //so that we can display name of the student
      //In production env, we can call the Name and Role service and get the user details from there
      const tooltipsData = members.filter(function (member: any) {
        return member.user_id == score.userId;
      });

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
