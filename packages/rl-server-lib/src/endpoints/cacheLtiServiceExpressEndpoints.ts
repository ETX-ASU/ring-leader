
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
import Cache from '@aws-amplify/cache';
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

function getPlatform(req: any): any {
    let session = req.session;
    if (!req.session) {
        session = Cache.getItem(req.query.userId + req.query.courseId);
    }
    return session.platform;
}

function getSession(req: any): any {
    let session = req.session;
    if (!req.session) {
        session = Cache.getItem(req.query.userId + req.query.courseId);
    }
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
        
        send(res).send(await getRoster(getPlatform(req), req.query.role));
    });

    app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {

        const reqQueryString: any = req.query;
        if (reqQueryString && reqQueryString.lineItemId) {
            send(res).send(
                await getUnassignedStudents(getPlatform(req), req.query.resourceLinkId)
            );
        }
    });

    app.get(GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        const lineItemId: any = req.query.lineItemId;
        const resourceLinkId: any = req.query.resourceLinkId;

        send(res).send(
            await getAssignedStudents(getPlatform(req), lineItemId, resourceLinkId)
        );
    });

    app.post(PUT_STUDENT_GRADE_VIEW, requestLogger, async (req: Request, res: Response) => {
        const title = getSession(req).title;
        const score = req.body.params;
        send(res).send(await putStudentGradeView(getPlatform(req), score, title));
    });

    app.post(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req: Request, res: Response) => {

        const contentItems = req.body.contentItems;
        // eslint-disable-next-line prettier/prettier
        return send(res).send(await postDeepLinkAssignment(getPlatform(req), contentItems));
    });

    app.post(PUT_STUDENT_GRADE, requestLogger, async (req: Request, res: Response) => {

        const title = getSession(req).title;
        const score = req.body.params;
        send(res).send(await putStudentGrade(getPlatform(req), score, title));
    });

    app.delete(DELETE_LINE_ITEM, requestLogger, async (req: Request, res: Response) => {
        const lineItemId: any = req.query.lineItemId;

        send(res).send(await deleteLineItem(getPlatform(req), lineItemId));
    });

    app.get(GET_GRADES, requestLogger, async (req: Request, res: Response) => {
        send(res).send(await getGrades(getPlatform(req), req.query.lineItemId));
    });

    app.get(GET_JWKS_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        const query: any = req.query;
        const consumerTool: ToolConsumer | undefined = getToolConsumerByName(
            query.name
        );
        send(res).send(consumerTool);
    });

    app.get(LTI_SESSION_VALIDATION_ENDPOINT, requestLogger, async (req: Request, res: Response) => {
        
        logger.debug(`request url: ${req.url} request userId: ${req.query.userId}, request courseId: ${req.query.courseId}, , request courseId: ${req.query.role}`);
       
        send(res).send({ isValid: validateSession( getPlatform(req)) });
    });
};

export default cacheLtiServiceExpressEndpoints;
