// eslint-disable-next-line node/no-extraneous-import
import { Express } from "express";
import { getToolConsumerByName } from "../services/ToolConsumerService";
import requestLogger from "../middleware/requestLogger";
import {
  getGrades,
  deleteLineItem,
  putStudentGrade,
  postDeepLinkAssignment,
  putStudentGradeView,
  getAssignedStudents,
  getUnassignedStudents,
  getRoster
} from "../services/ltiAppService";

import validateSession from "../services/validationService";
import ToolConsumer from "../models/ToolConsumer";

import {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES,
  GET_JWKS_ENDPOINT,
  LTI_SESSION_VALIDATION_ENDPOINT,
  logger
} from "@asu-etx/rl-shared";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const rlLtiServiceExpressEndpoints = (app: Express): void => {
  app.get(ROSTER_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    res.send(getRoster(platform, req.query.role));
  });

  app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }

    const reqQueryString: any = req.query;
    if (reqQueryString && reqQueryString.lineItemId) {
      const platform: any = req.session.platform;
      res.send(getUnassignedStudents(platform, req.query.resourceLinkId));
    }
  });

  app.get(GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const lineItemId: any = req.query.lineItemId;
    const resourceLinkId: any = req.query.resourceLinkId;
    const platform: any = req.session.platform;

    res.send(getAssignedStudents(platform, lineItemId, resourceLinkId));
  });

  app.post(PUT_STUDENT_GRADE_VIEW, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const title = req.session.title;
    const platform: any = req.session.platform;
    const score = req.body.params;
    res.send(putStudentGradeView(platform, score, title));
  });

  app.post(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error(
        `${DEEP_LINK_ASSIGNMENT_ENDPOINT}: no session detected, something is wrong`
      );
    }
    const platform: any = req.session.platform;
    const contentItems = req.body.contentItems;
    return res.send(postDeepLinkAssignment(platform, contentItems));
  });

  app.post(PUT_STUDENT_GRADE, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const title = req.session.title;
    const platform: any = req.session.platform;
    const score = req.body.params;
    res.send(putStudentGrade(platform, score, title));
  });

  app.delete(DELETE_LINE_ITEM, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;
    const lineItemId: any = req.query.lineItemId;

    res.send(deleteLineItem(platform, lineItemId));
  });

  app.get(GET_GRADES, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const platform: any = req.session.platform;

    res.send(getGrades(platform, req.query.lineItemId));
  });

  app.get(GET_JWKS_ENDPOINT, requestLogger, async (req, res) => {
    const query: any = req.query;
    const consumerTool: ToolConsumer | undefined = getToolConsumerByName(
      query.name
    );
    res.send(consumerTool);
  });

  app.get(LTI_SESSION_VALIDATION_ENDPOINT, requestLogger, async (req, res) => {
    logger.debug(`sessionquery: ${JSON.stringify(req.query["platform"])}`);
    res.send({ isValid: validateSession(req.query.platform) });
  });
};

export default rlLtiServiceExpressEndpoints;
