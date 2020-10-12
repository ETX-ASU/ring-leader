import path from "path";
import { Express } from "express";
import url from "url";

import { inspect } from "util";
import { rlProcessOIDCRequest } from "../util/auth";

import { getConnection } from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import { getToolConsumer } from "../services/ToolConsumerService";
import { generateUniqueString } from "../util/generateUniqueString";
import processRequest from "../util/processRequest";

const getToolConsumers = async (): Promise<ToolConsumer[]> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumers = await toolConsumerRepository.find();
  return toolConsumers;
};

const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";
const LTI_INSTRUCTOR_REDIRECT = "/instructor";
const LTI_ASSIGNMENT_REDIRECT = "/assignment";
const LTI_STUDENT_REDIRECT = "/student";
const LTI_DEEPLINK_REDIRECT = "/deeplink";

const initOidcGet = async (req: any, res: any): Promise<void> => {
  const nonce = generateUniqueString(25, false);
  const state = generateUniqueString(30, false);
  //This resposne will be save in session or DB and will be used in validating the nonce and other properties
  const response: any = rlProcessOIDCRequest(req, state, nonce);

  const platformDetails = await getToolConsumer({
    name: "",
    client_id: response.client_id,
    iss: response.iss,
    deployment_id: ""
  });
  if (platformDetails == undefined) {
    return;
  }
  if (req.session) {
    req.session.nonce = nonce;
    req.session.state = state;
    console.log(
      `request for GET OIDC_LOGIN_INIT_ROUTE{ ${OIDC_LOGIN_INIT_ROUTE} : ${inspect(
        req
      )}`
    );
    await req.session.save(() => {
      console.log("session data saved");
    });
  } else {
    throw new Error("no session detected, something is wrong");
  }

  res.redirect(
    url.format({
      pathname: platformDetails.platformOIDCAuthEndPoint,
      query: response
    })
  );
};

const initOidcPost = async (req: any, res: any): Promise<void> => {
  // OIDC POST initiation

  const nonce = generateUniqueString(25, false);
  const state = generateUniqueString(30, false);
  const response: any = rlProcessOIDCRequest(req, state, nonce);
  console.log(
    `request for POST OIDC_LOGIN_INIT_ROUTE:${OIDC_LOGIN_INIT_ROUTE} : ${inspect(
      req.body
    )}`
  );

  const platformDetails = await getToolConsumer({
    name: "",
    client_id: response.client_id,
    iss: response.iss,
    deployment_id: ""
  });
  console.log(
    "initOidcPost - platformDetails-" + JSON.stringify(platformDetails)
  );

  if (platformDetails == undefined) {
    return;
  }
  console.log("initOidcPost - req.session-" + JSON.stringify(req.session));
  if (req.session) {
    req.session.nonce = nonce;
    req.session.state = state;

    await req.session.save(() => {
      console.log("session data saved");
    });
  } else {
    throw new Error("no session detected, something is wrong");
  }
  console.log(
    `Redirection from OIDC_LOGIN_INIT_ROUTE: ${OIDC_LOGIN_INIT_ROUTE} to :${
      platformDetails.platformOIDCAuthEndPoint
    } with platform details: ${JSON.stringify(platformDetails)}`
  );

  res.redirect(
    url.format({
      pathname: platformDetails.platformOIDCAuthEndPoint,
      query: response
    })
  );
};
const ltiLaunchPost = async (request: any, response: any): Promise<void> => {
  if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }
  const processedRequest = await processRequest(request);
  if (!processedRequest) {
    throw new Error("Unable to process request");
  }

  request.session.platform = processedRequest.rlPlatform;

  await request.session.save(() => {
    console.log("session data saved");
  });

  if (processedRequest.session.redirectUrl) {
    // This means that student/instrucot click on assignmnet and platform SSO was not performed
    // it's a work around to get the SSO flow start so that we can get id_token
    //Note:- this code will not execute when external tool is accessed from course navigation or deep linking
    request.session.redirectUrl = null;
    response.redirect(processedRequest.session.redirectUrl);
    return;
  } else {
    response.redirect(LTI_INSTRUCTOR_REDIRECT);
  }

  await request.session.save(() => {
    console.log("session data saved");
  });
};

const assignmentRedirectPost = async (
  req: any,
  request: any
): Promise<void> => {
  if (!req.session) {
    throw new Error("no session detected, something is wrong");
  }
  const reqQueryString = req.query;
  const reqBody = req.body;
  console.log(
    "LTI_ASSIGNMENT_REDIRECT -  req.query" + JSON.stringify(reqQueryString)
  );

  console.log("LTI_ASSIGNMENT_REDIRECT -  req.body" + JSON.stringify(reqBody));

  if (!req.body.id_token) {
    ///if id_token is not present then it means that the platform SSO was not performed.
    //we will redirect user to external tool url that will start SSO process internally
    //user will automatically redirected to the assignment
    //and we will get id_token
    //Note:- if a deep link assignment is launch then this code section will not be executed.
    req.session.redirectUrl = req.url;
    req.session.title = reqBody.resource_link_title;
    req.session.resourceId = reqBody.resourceId;

    request.redirect(
      url.format({
        pathname:
          "https://unicon.instructure.com/courses/718/external_tools/412",
        query: { assignmenturl: req.url }
      })
    );
    return;
  } else {
    req.session.redirectUrl = null;
  }

  const processedRequest = await processRequest(request);
  if (!processedRequest) {
    throw new Error("Unable to process request");
  }
  processedRequest.session.platform = processedRequest.rlPlatform;
  processedRequest.session.assignmentId = reqQueryString.resourceId;
  await req.session.save(() => {
    console.log("req.session- " + JSON.stringify(req.session));
  });
  request.redirect(
    LTI_ASSIGNMENT_REDIRECT +
      "?resource_link_id=" +
      reqBody.resource_link_id +
      "&resourceId=" +
      reqQueryString.resourceId
  );
};

const deepLinkRedirect = async (req: any, request: any): Promise<void> => {
  if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }
  console.log("req.session-LTI_DEEPLINK_REDIRECT");
  const processedRequest = await processRequest(request);
  if (!processedRequest) {
    throw new Error("Unable to process request");
  }

  request.session.platform = processedRequest.rlPlatform;
  console.log(
    "req.session.platform - " + JSON.stringify(processedRequest.rlPlatform)
  );
  await req.session.save(() => {
    console.log("session data saved");
  });
  request.redirect(LTI_DEEPLINK_REDIRECT);
};

const toolInfoGet = async (
  req: any,
  res: any,
  applicationURL: any
): Promise<void> => {
  const integrationInfo = {
    "OpenID Connect Initiation Url": `${path.join(
      applicationURL,
      OIDC_LOGIN_INIT_ROUTE
    )} `,
    "Target Link URI": `${path.join(
      applicationURL,
      LTI_ADVANTAGE_LAUNCH_ROUTE
    )} `,
    "Redirect URIS:": [
      `${path.join(applicationURL, LTI_INSTRUCTOR_REDIRECT)} `,
      `${path.join(applicationURL, LTI_STUDENT_REDIRECT)} `
    ]
  };

  const toolConsumers = await getToolConsumers();
  const sanitizedToolConsumers = toolConsumers.map(
    ({ name, public_key_jwk, client_id }) => {
      return {
        name,
        public_key_jwk: JSON.parse(public_key_jwk), // a string that needs to be parsed
        client_id
      };
    }
  );

  const data = JSON.stringify(
    {
      integrationInfo,
      toolConsumers: sanitizedToolConsumers
    },
    null,
    2
  );

  res.send(`< pre > ${data} </pre>`);
};

export {
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  deepLinkRedirect
};
