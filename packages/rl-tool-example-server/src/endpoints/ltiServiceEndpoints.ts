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
  requestLogger,
  getDeepLinkItems,
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  CREATE_ASSIGNMENT_ENDPOINT,
  GET_ASSIGNMENT_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES
  
} from "@asu-etx/rl-server-lib";

import {APPLICATION_URL} from "../environment";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const ltiServiceEndpoints = (app: Express): void => {

  app.get(ROSTER_ENDPOINT , requestLogger, async (req, res) => {
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

  app.get(CREATE_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
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
        external_tool_url: `${APPLICATION_URL}/assignment?resourceId="${resourceId}`
      }
    };
    const results = await createLineItem(platform, lineItem);

    res.send(results);
  });

  app.get(GET_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    console.log(`createassignment - platform - ${JSON.stringify(platform)}`);

    const results = await getLineItems(platform);

    res.send(results);
  });

  app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT,
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

  app.post(PUT_STUDENT_GRADE_VIEW,
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

  app.get(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error(`${DEEP_LINK_ASSIGNMENT_ENDPOINT}: no session detected, something is wrong`);
    }
    const platform: any = req.session.platform;
    const items = getDeepLinkItems(DEEP_LINK_ASSIGNMENT_ENDPOINT, platform);
    console.log("deeplink - platform - " + JSON.stringify(platform));
    

    // Creates the deep linking request form
    const form = await createDeepLinkingForm(platform, items, {
      message: "Successfully registered resource!"
    });

    return res.send(form);
  });

  app.post(PUT_STUDENT_GRADE, requestLogger, async (req, res) => {
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

  app.delete(DELETE_LINE_ITEM, requestLogger, async (req, res) => {
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

  app.get(GET_GRADES, requestLogger, async (req, res) => {
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
