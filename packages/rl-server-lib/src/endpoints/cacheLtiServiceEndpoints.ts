
// eslint-disable-next-line node/no-extraneous-import
import { Express, Request, Response } from "express";
import requestLogger from "../middleware/requestLogger";
import {
  getGrades,
  deleteLineItem,
  putStudentGrade,
  postDeepLinkAssignment,
  forwardDeepLinkAssignmentPost,
  putStudentGradeView,
  getAssignedStudents,
  getUnassignedStudents,
  getRoster
} from "../services/ltiAppService";

import validateSession from "../services/validationService";
import {
  DEEP_LINK_ASSIGNMENT_ENDPOINT,
  ROSTER_ENDPOINT,
  GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT,
  PUT_STUDENT_GRADE_VIEW,
  PUT_STUDENT_GRADE,
  DELETE_LINE_ITEM,
  GET_GRADES,
  LTI_SESSION_VALIDATION_ENDPOINT,
  DEEP_LINK_FORWARD_SERVER_SIDE,
  SESSION_TTL,
  logger
} from "@asu-etx/rl-shared";

import { Session } from "../database/entity/Session";

import { validateRequest } from "../util/externalRedirect";
import { Platform } from "../util/Platform";

const URL_ROOT = process.env.URL_ROOT ? process.env.URL_ROOT : "";


// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client

async function getPlatform(req: any): Promise<any> {
  const session = await getSession(req);
  return session?.platform;
}

async function getSessionFromKey(req: any, key: string): Promise<any> {
  logger.debug(`session_key: ${key}`);
  let session = req.session;

  if (!req.session.platform) {
    try {
      const foundSession: Session | null = await Session.primaryKey.get(key);
      if (foundSession) {
        session = JSON.parse(foundSession.session);
      }
    } catch (err) {
      console.error(`attempting to find session:${key} failed`, err)
    }
  }
  logger.debug(`stored session: ${JSON.stringify(session)}`);
  return session;
}
async function getSession(req: any): Promise<any> {
  const key = validateRequest(req);
  const session = await getSessionFromKey(req, key);
  return session;
}

async function updateSession(req: any, platform: Platform) {
  if (platform.accessTokensUpdated) {
    const key = validateRequest(req);
    const session = await getSessionFromKey(req, key);
    session.platform = platform;
    const storeSession = new Session();
    storeSession.sessionId = key;
    storeSession.session = JSON.stringify(session);
    storeSession.modifiedOn = Math.round(Date.now() / 1000)
    storeSession.ttl = Math.round(Date.now() / 1000) + Number(SESSION_TTL);
    await Session.writer.put(storeSession);
    await storeSession.save();
  }
}

function send(response: Response) {
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET,PUT");
  return response;
}
const cacheLtiServiceEndpoints = (app: Express): void => {
  app.get(ROSTER_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
    logger.debug(`roster request role: ${req.query.role}`);
    const platform = await getPlatform(req);
    const users = await getRoster(platform, req.query.role);

    await updateSession(req, platform);
    logger.debug("users.found: ${users}");
    send(res).send(users);
  });

  app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {

    const reqQueryString: any = req.query;
    if (reqQueryString && reqQueryString.lineItemId) {
      const platform = await getPlatform(req);
      const students = await getUnassignedStudents(platform, req.query.resourceLinkId);
      await updateSession(req, platform);
      send(res).send(
        students
      );
    }
  });

  app.get(GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
    const lineItemId: any = req.query.lineItemId;
    const resourceLinkId: any = req.query.resourceLinkId;
    const platform = await getPlatform(req);
    const students = await getAssignedStudents(platform, lineItemId, resourceLinkId);
    await updateSession(req, platform);
    send(res).send(
      students
    );
  });

  app.post(PUT_STUDENT_GRADE_VIEW, requestLogger, async (req: Request, res: Response) => {
    const key = validateRequest(req);
    const session = await getSessionFromKey(req, key);
    const title = session.title;
    const score = req.body.params;
    const grades = await putStudentGradeView(session.platform, score, title);
    await updateSession(req, session.platform);
    send(res).send(grades);
  });

  app.post(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
    logger.debug(`body of deep link: ${JSON.stringify(req.body)}`);
    logger.debug(`body of deep link: ${req.body}`)
    const key = validateRequest(req);
    const session = await getSessionFromKey(req, key);
    const contentItems = req.body.contentItems;
    // eslint-disable-next-line prettier/prettier
    let canvasResponse = null;
    if (DEEP_LINK_FORWARD_SERVER_SIDE == "TRUE") {
      canvasResponse = await forwardDeepLinkAssignmentPost(res, session.platform, contentItems);
    } else {
      canvasResponse = await postDeepLinkAssignment(session.platform, contentItems);
    }
    await updateSession(req, session.platform);
    send(res).send(canvasResponse);
  });

  app.post(PUT_STUDENT_GRADE, requestLogger, async (req: Request, res: Response) => {
    const key = validateRequest(req);
    const session = await getSessionFromKey(req, key);
    const title = session.title;
    const score = req.body.params;
    const canvasResponse = await putStudentGrade(session.platform, score, title);
    await updateSession(req, session.platform);
    send(res).send(canvasResponse);
  });

  app.delete(DELETE_LINE_ITEM, requestLogger, async (req: Request, res: Response) => {
    const lineItemId: any = req.query.lineItemId;
    const platform: Platform = await getPlatform(req);
    const value = await deleteLineItem(platform, lineItemId);
    await updateSession(req, platform);
    send(res).send(value);
  });

  app.get(GET_GRADES, requestLogger, async (req: Request, res: Response) => {
    const platform: Platform = await getPlatform(req);
    const grades = await getGrades(platform, req.query.resourceId, req.query.userId);
    await updateSession(req, platform);
    send(res).send(grades);
  });

  app.get(LTI_SESSION_VALIDATION_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
    logger.debug(`request hash: ${req.query.hash}`);
    const platform = await getPlatform(req);
    const isValid = await validateSession(platform);
    logger.debug(`isValidSession: ${isValid}`);
    send(res).send({ isValid: isValid });
  });
};

export default cacheLtiServiceEndpoints;
