
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

const cacheLtiServiceExpressEndpoints = (app: Express): void => {
    app.get(ROSTER_ENDPOINT, requestLogger, async (req: any, res: any) => {

        res.send(await getRoster(getPlatform(req), req.query.role));
    });

    app.get(GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: any, res: any) => {

        const reqQueryString: any = req.query;
        if (reqQueryString && reqQueryString.lineItemId) {
            res.send(
                await getUnassignedStudents(getPlatform(req), req.query.resourceLinkId)
            );
        }
    });

    app.get(GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger, async (req: any, res: any) => {
        const lineItemId: any = req.query.lineItemId;
        const resourceLinkId: any = req.query.resourceLinkId;

        res.send(
            await getAssignedStudents(getPlatform(req), lineItemId, resourceLinkId)
        );
    });

    app.post(PUT_STUDENT_GRADE_VIEW, requestLogger, async (req: any, res: any) => {
        const title = getSession(req).title;
        const score = req.body.params;
        res.send(await putStudentGradeView(getPlatform(req), score, title));
    });

    app.post(DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger, async (req: any, res: any) => {

        const contentItems = req.body.contentItems;
        // eslint-disable-next-line prettier/prettier
        return res.send(await postDeepLinkAssignment(getPlatform(req), contentItems));
    });

    app.post(PUT_STUDENT_GRADE, requestLogger, async (req: any, res: any) => {

        const title = getSession(req).title;
        const score = req.body.params;
        res.send(await putStudentGrade(getPlatform(req), score, title));
    });

    app.delete(DELETE_LINE_ITEM, requestLogger, async (req: any, res: any) => {
        const lineItemId: any = req.query.lineItemId;

        res.send(await deleteLineItem(getPlatform(req), lineItemId));
    });

    app.get(GET_GRADES, requestLogger, async (req: any, res: any) => {
        res.send(await getGrades(getPlatform(req), req.query.lineItemId));
    });

    app.get(GET_JWKS_ENDPOINT, requestLogger, async (req: any, res: any) => {
        const query: any = req.query;
        const consumerTool: ToolConsumer | undefined = getToolConsumerByName(
            query.name
        );
        res.send(consumerTool);
    });

    app.get(LTI_SESSION_VALIDATION_ENDPOINT, requestLogger, async (req: any, res: any) => {
        logger.debug(`sessionquery: ${JSON.stringify(req.query["platform"])}`);
        res.send({ isValid: validateSession(req.query.platform) });
    });
};

export default cacheLtiServiceExpressEndpoints;
