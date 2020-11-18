
import path from "path";
import globalRequestLog from "global-request-logger";
import { Express, Request, Response } from "express";
import expressSession from "express-session";
import getLaunchParameters from "../util/getLaunchParameters"
import bodyParser from "body-parser";
import { logger, SESSION_SECRET, LTI_STUDENT_REDIRECT, LTI_INSTRUCTOR_REDIRECT, LTI_ASSIGNMENT_REDIRECT, LTI_DEEPLINK_REDIRECT } from "@asu-etx/rl-shared";


const cacheApp = (app: Express): void => {
    /*========================== LOG ALL REQUESTS =========================*/
    globalRequestLog.initialize();
    globalRequestLog.on("success", (request: any, response: any) => {
        logger.info({ request: request });
        logger.info({ response: response });
    });
    globalRequestLog.on("error", (request: any, response: any) => {
        logger.info({ request: request });
        logger.info({ response: response });
    });

    // avoid signature failure for LTI https://github.com/omsmith/ims-lti/issues/4
    app.enable("trust proxy");
    /*========================== GLOBAL MIDDLEWARE ==========================*/
    // make req.body access easier for all request handlers
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Enable CORS for all methods
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    });
    
    app.use(expressSession({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            sameSite: "none",
            secure: true,
            httpOnly: false // ideally set this to true so the client window can't access the cookie
        }
    }));

    /*========================== UI ENDPOINTS ==========================*/
    // Instructor
    const APPLICATION_URL = process.env.APPLICATION_URL;


    app.route(LTI_INSTRUCTOR_REDIRECT).get(async (req : any, res: any) => {
        logger.debug(`hitting instructor request ${APPLICATION_URL}:${JSON.stringify(req.session)}`);
        const params = await getLaunchParameters(req, "instructor");
        res.status(301).redirect(APPLICATION_URL + params);
    });
    // Student
    app.route(LTI_STUDENT_REDIRECT).get(async (req, res) => {
        const params = await getLaunchParameters(req, "learner");
        res.status(301).redirect(APPLICATION_URL + params);
    });
    // Student Assignment
    app.route(LTI_ASSIGNMENT_REDIRECT).get(async (req, res) => {
        const params = await getLaunchParameters(req, null);
        res.status(301).redirect(APPLICATION_URL + params);
    });
    // Deep Link
    app.route(LTI_DEEPLINK_REDIRECT).get(async (req, res) => {
        const params = await getLaunchParameters(req, null);
        res.status(301).redirect(APPLICATION_URL + params + "&mode=selectAssignment");
    });


    app.listen(3000, function () {
        console.log("App started")
    });
}

export default cacheApp;