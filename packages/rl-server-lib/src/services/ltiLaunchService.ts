import path from "path";
import { Express } from "express";
import url from "url";

import { inspect } from 'util';
import {
  rlProcessOIDCRequest,
  rlValidateDecodedToken,
  rlDecodeIdToken
} from "../util/auth";

import { RlPlatform } from "../util/rlPlatform"
import { getConnection } from "@asu-etx/rl-server-lib/src/database/db";
import ToolConsumer from "@asu-etx/rl-server-lib/src/database/entities/ToolConsumer";
import { getToolConsumer } from "@asu-etx/rl-server-lib/src/services/ToolConsumerService";
import { generateUniqueString } from "../util/generateUniqueString";

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


const initOidcGet = async (req: any, res: any): Promise<void> => {
  const nonce = generateUniqueString(25, false);
  const state = generateUniqueString(30, false);
  //This resposne will be save in session or DB and will be used in validating the nonce and other properties
  const response: any = rlProcessOIDCRequest(req, state, nonce);
  const platformDetails = await getToolConsumer({ name: "", client_id: response.client_id, iss: response.iss, deployment_id: "" });
  if (platformDetails == undefined) {
    return;
  }
  if (req.session) {
    req.session.nonce = nonce;
    req.session.state = state;
    console.log(`request for GET OIDC_LOGIN_INIT_ROUTE{ ${OIDC_LOGIN_INIT_ROUTE} : ${inspect(req)}`);
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
}

const initOidcPost = async (req: any, res: any): Promise<void> => {
  // OIDC POST initiation

  const nonce = generateUniqueString(25, false);
  const state = generateUniqueString(30, false);
  const response: any = rlProcessOIDCRequest(req, state, nonce);
  console.log(`request for POST OIDC_LOGIN_INIT_ROUTE:${OIDC_LOGIN_INIT_ROUTE} : ${inspect(req.body)}`);
  const platformDetails = await getToolConsumer({ name: "", client_id: response.client_id, iss: response.iss, deployment_id: "" });
  if (platformDetails == undefined) {
    return;
  }

  if (req.session) {
    req.session.nonce = nonce;
    req.session.state = state;

    await req.session.save(() => {
      console.log("session data saved");
    });
  } else {
    throw new Error("no session detected, something is wrong");
  }
  console.log(`Redirection from OIDC_LOGIN_INIT_ROUTE: ${OIDC_LOGIN_INIT_ROUTE} to :${platformDetails.platformOIDCAuthEndPoint} with platform details: ${JSON.stringify(platformDetails)}`);

  res.redirect(
    url.format({
      pathname: platformDetails.platformOIDCAuthEndPoint,
      query: response
    })
  );
}
const ltiLaunchPost = async (req: any, res: any): Promise<void> => {
  if (!req.session) {
    throw new Error("no session detected, something is wrong");
  }

  const sessionObject = req.session;
  console.log(`request session for POST LTI_ADVANTAGE_LAUNCH_ROUTE: ${LTI_ADVANTAGE_LAUNCH_ROUTE} : Session Object: ${inspect(sessionObject)} \nRequest body: ${inspect(req.body)}`);

  const decodedToken = rlDecodeIdToken(req.body.id_token)
  rlValidateDecodedToken(decodedToken, sessionObject);
  const platformDetails = await getToolConsumer({ name: "", client_id: decodedToken["aud"], iss: decodedToken["iss"], deployment_id: decodedToken["https://purl.imsglobal.org/spec/lti/claim/deployment_id"] });

  if (platformDetails == undefined) {
    return;
  }

  console.log("Attempting to create RLPlatform");
  const rlPlatform = RlPlatform(
    platformDetails.private_key,
    platformDetails.platformOIDCAuthEndPoint,
    platformDetails.platformAccessTokenEndpoint,
    platformDetails.keyid,
    platformDetails.alg,
    req.body.id_token
  );

  req.session.platform = rlPlatform;
  console.log("req.session.platform - " + JSON.stringify(rlPlatform));
  await req.session.save(() => {
    console.log("session data saved");
  });
  res.redirect(LTI_INSTRUCTOR_REDIRECT);
}

const assignmentRedirectPost = async (req: any, res: any): Promise<void> => {
  if (!req.session) {
    throw new Error("no session detected, something is wrong");
  }
  console.log(
    "LTI_ASSIGNMENT_REDIRECT -  req.query" + JSON.stringify(req.query)
  );

  res.redirect(
    LTI_ASSIGNMENT_REDIRECT + "?resourceId=" + req.query.resourceId
  );
}

const toolInfoGet = async (req: any, res: any, applicationURL: any): Promise<void> => {
  const integrationInfo = {
    "OpenID Connect Initiation Url": `${path.join(
      applicationURL,
      OIDC_LOGIN_INIT_ROUTE
    )
      } `,
    "Target Link URI": `${path.join(
      applicationURL,
      LTI_ADVANTAGE_LAUNCH_ROUTE
    )
      } `,
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

export { initOidcGet, initOidcPost, toolInfoGet, assignmentRedirectPost, ltiLaunchPost };
