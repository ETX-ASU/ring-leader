
// eslint-disable-next-line node/no-extraneous-import
import { Express, Request, Response } from "express";
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

import { Session } from "../database/entity/Session";

import { validateRequest } from "../util/externalRedirect";


// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client

async function getPlatform(req: any): Promise<any> {

    const session = await getSession(req);
    return session?.platform;
}

async function getSessionFromKey(req: any, key: string): Promise<any>  {
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



function send(response: Response) {
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET,PUT");
    return response;
}
const cacheLtiServiceExpressEndpoints = (app: Express): void => {
    app.get(ROSTER_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        logger.debug(`roster request role: ${req.query.role}`);
        const platform = await getPlatform(req);
        const users = await getRoster(platform, req.query.role);
        logger.debug("users.found: ${users}");
        send(res).send(users);
    });

    app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {

        const reqQueryString: any = req.query;
        if (reqQueryString && reqQueryString.lineItemId) {
            send(res).send(
                await getUnassignedStudents(await getPlatform(req), req.query.resourceLinkId)
            );
        }
    });

    app.get(GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        const lineItemId: any = req.query.lineItemId;
        const resourceLinkId: any = req.query.resourceLinkId;

        send(res).send(
            await getAssignedStudents(await getPlatform(req), lineItemId, resourceLinkId)
        );
    });

    app.post(PUT_STUDENT_GRADE_VIEW, requestLogger, async (req: Request, res: Response) => {
        const key = validateRequest(req);
        const session = await getSessionFromKey(req, key);
        const title = session.title;
        const score = req.body.params;
       
        send(res).send(await putStudentGradeView(await session.platform, score, title));
    });

    app.post(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        const key = `${req.body.userId}${req.body.courseId}`;
        const session = await getSessionFromKey(req, key);
        const contentItems = req.body.contentItems;
        // eslint-disable-next-line prettier/prettier
        return send(res).send(await postDeepLinkAssignment(session.platform, contentItems));
    });

    app.post(PUT_STUDENT_GRADE, requestLogger, async (req: Request, res: Response) => {
        const key = `${req.body.userId}${req.body.courseId}`;
        const session = await getSessionFromKey(req, key);
        const title = session.title;
        const score = req.body.params;
        send(res).send(await putStudentGrade(session.platform, score, title));
    });

    app.delete(DELETE_LINE_ITEM, requestLogger, async (req: Request, res: Response) => {
        const lineItemId: any = req.query.lineItemId;

        send(res).send(await deleteLineItem(await getPlatform(req), lineItemId));
    });

    app.get(GET_GRADES, requestLogger, async (req: Request, res: Response) => {
        send(res).send(await getGrades(await getPlatform(req), req.query.lineItemId));
    });

    app.get(GET_JWKS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        const query: any = req.query;
        const consumerTool: ToolConsumer | undefined = getToolConsumerByName(
            query.name
        );
        send(res).send(consumerTool);
    });

    app.get(LTI_SESSION_VALIDATION_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        logger.debug(`request hash: ${req.query.hash}`);
        const platform = await getPlatform(req);
        const isValid = validateSession(platform);
        logger.debug(`isValidSession: ${isValid}`);
        send(res).send({ isValid: isValid });
    });
};

export default cacheLtiServiceExpressEndpoints;
