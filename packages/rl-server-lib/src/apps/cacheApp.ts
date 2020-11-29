
import globalRequestLog from "global-request-logger";
import { Express } from "express";
import expressSession from "express-session";
import getLaunchParameters from "../util/getLaunchParameters"
import bodyParser from "body-parser";
import ltiLaunchEndpoints from "../endpoints/ltiLaunchEndpoints";
import cacheLtiServiceEndpoints from "../endpoints/cacheLtiServiceEndpoints";

import { logger, SESSION_SECRET, LTI_STUDENT_REDIRECT, LTI_INSTRUCTOR_REDIRECT, LTI_ASSIGNMENT_REDIRECT, LTI_DEEPLINK_REDIRECT } from "@asu-etx/rl-shared";


const cacheApp = (app: Express, sessionParams: any): void => {
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

  // In Memory Sessions ( not recommended for production servers )
  if (!sessionParams)
    sessionParams = {
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true, // don't create cookie or session unless we actually set the user through authentication
      cookie: {
        sameSite: "none",
        secure: true, // set this to true when served from https
        httpOnly: false // ideally set this to true so the client window can't access the cookie
      }
    };

  app.use(
    expressSession(sessionParams)
  );

  /*========================== UI ENDPOINTS ==========================*/
  // Instructor
  const APPLICATION_URL = process.env.APPLICATION_URL;

  // lti 1.3 launch with context and establish session
  ltiLaunchEndpoints(app);

  // lti 1.3 advantage service endpoints. NOTE: If we decide to only make calls client side with the idToken
  // then these endpoints will not be needed. They could be completed to show what a server side flow might look like
  cacheLtiServiceEndpoints(app);

  app.route(LTI_INSTRUCTOR_REDIRECT).get(async (req: any, res: any) => {
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