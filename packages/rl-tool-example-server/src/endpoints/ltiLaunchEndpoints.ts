import path from "path";
import { Express } from "express";
import url from "url";

import { inspect } from 'util';
import {
  rlProcessOIDCRequest,
  rlValidateDecodedToken,
  rlDecodeIdToken,
  RlPlatform
} from "@asu-etx/rl-server-lib";
import getConnection from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import { getToolConsumer } from "../services/ToolConsumerService";
import requestLogger from "../middleware/requestLogger";
import { APPLICATION_URL } from "../environment";
import { generateUniqueString } from "../generateUniqueString";
import ToolConsumerRequest from "../database/entities/ToolConsumerRequest";

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

/*var platformDetails = {
  platformOIDCAuthEndPoint:
    "https://unicon.instructure.com/api/lti/authorize_redirect",
  platformAccessTokenEndpoint:
    "https://unicon.instructure.com/login/oauth2/token",
  alg: "RS256",
  keyid: "ASU ETX - Ring Leader - james-stanley - Public Key",
  platformPrivateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/Q9PPIoH8qIZ8\nlHeijZledVEIFFqDs8DgBEJnkJkxIW7Iy0ldl1AqKJtN7OUUP3vqUlBmw1NuZejE\nQrOGjvBLn5cRhe1RaGAOZVnjpE+mF5rL4dTMKKQMwgpq86mnv6uLtsg56P1E2Own\nlXOsUjUiotlZPgLIn94/NopFTJ2kty87WaLiAZFuUKkHaOb+VpRS0AbnJcymS60y\njDHW4mssoeNnyvxuNbDiarKFslzHRQp6Ehz/vIyh7JmlFi2i7HRo49Gkv6XxvW46\n5WG4u8AeXrTC6FesI0fOXf2gDIjX47a9Lu3Q9OdRmRjIvFB6HkJr6Nr/OPqQUAQ2\nAH7j4udnAgMBAAECggEBAImN4V395lhsZ1Rffm7kwWGCpAVYhgRkGZnC1nMfNl10\nOvWj5h6uPRQk4hS4A8R9J8RM8NAHOBCUsEO96NkkIcNxgjczB4tdsn+H+o7SVAoS\nvdxVjTJLJDicsNtcZC5llZ1Ellm3q7aA/840GN3cvaQsVH5vL5dUCoWR1v2h7VpQ\nue8bMC1gjwa080W8op7IMC7ePHhUh2ab69vOBWv+a9e3arkA6KZKqyLsaLVT6m/n\nqYmxj2TXak27oOsK9Hxblys9481Y3l0G17CGr9thvnWQ/X2xkOSdLQ3j+Pm/s+Km\n6kwt45EfwUTHL30azvFuY2r3AXFI3awG5B7o/3L+aIkCgYEA5JIeBNRpHJ6PMek6\nSDBzmmSBgk8Jgw5YSM0k1EtEhD7qaMg1+mlQ2CYYXFkFoYNQ24u/2LfsuZIEpeL9\nDhAD5/B+VWmmOFK6n2ZEm5NElWyic+rvdDITU9W2ECF33NEskUtRAGlieRjDg26v\nscZzX53H9XqNf+4j4v0jwZ12SuUCgYEA1jelAIcHE4LlQ5dvHeGgIbtu/wE/MmD7\nm35+A2ZTTVk1ewXkAS58dR1JQHdrNp1Iv5hqzNBXyfPrEPhi1JzleiJ55t1w/tTK\nvaCQzbIX0Zhjy+w7LnkfTzrgPHVOO8+Pa8amkOsADRgYuE/2JPXTedXVWpjFGXA/\nvIkCB5fwqFsCgYEA3rfuHkCnZ2atGzIqQztK+c8jTska+KParJ2QXHg2/DGeEZm8\n1xMV3nhIVnu7++RLvpHOzypwtWWtt8KVV8WNOMzjHPEEMW+TP0zUX0/BjWQ8a30p\n9Gvy30anz9H8zKLZrX3ZIPCPLnZN1FzfP/eiZjIFLJJNHLH8L+r/k2KOaG0CgYA/\nB4JaJGC1ofb5K057eU6XfkHLcD97AEQn3VEQiQQLpyrwNqx+mIHwJ5zNBhYarK6i\nCSOrfcXG2ykYBi12J2/xvsElZ5R+tnes0dipXTRa7D642poTM3o94rHluBI70Pd/\nG6UY0LxkHenwGT7wYxBFMeCj1n1v3bIzNBDP0SnzLwKBgF5uqqawvZpvdvKszxzg\nI7lyRsctc/TWdPqh1QNBHjU3gqWqVBQP/WYPxrFj/x2Xbyw0cO8s7jtxLLx7QWnG\n2FSbrnsmLU/17YtFzDzzHQLJR2a7RfUT/5cJU3IdJ0HRqqShEYuC8pY2NLsDs/Ly\nlBKfrr464JAX9v0oj4pIWgR6\n-----END PRIVATE KEY-----\n" //platform.platformKid
};*/;
const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req, res) => {
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
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, async (req, res) => {
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
    console.log(`Redirection from OIDC_LOGIN_INIT_ROUTE: ${OIDC_LOGIN_INIT_ROUTE} with platform details:${platformDetails.platformOIDCAuthEndPoint} : ${JSON.stringify(platformDetails)}`);

    res.redirect(
      url.format({
        pathname: platformDetails.platformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }

    const sessionObject = req.session;
    console.log(`request session for POST LTI_ADVANTAGE_LAUNCH_ROUTE: ${LTI_ADVANTAGE_LAUNCH_ROUTE} : Session Object: ${inspect(sessionObject)} Request body: ${inspect(req.body)}`);

    const decodedToken = rlDecodeIdToken(sessionObject.id_token)
    const idToken = rlValidateDecodedToken(decodedToken, sessionObject);
    const platformDetails = await getToolConsumer({ name: "", client_id: decodedToken["aud"], iss: decodedToken["iss"], deployment_id: decodedToken["https://purl.imsglobal.org/spec/lti/claim/deployment_id"] });

    if (platformDetails == undefined) {
      return;
    }
    const rlPlatform = RlPlatform(
      platformDetails.private_key,
      platformDetails.platformOIDCAuthEndPoint,
      platformDetails.platformAccessTokenEndpoint,
      platformDetails.keyid,
      platformDetails.alg,
      idToken
    );

    req.session.platform = rlPlatform;
    console.log("req.session.platform - " + JSON.stringify(rlPlatform));
    await req.session.save(() => {
      console.log("session data saved");
    });
    res.redirect(LTI_INSTRUCTOR_REDIRECT);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ASSIGNMENT_REDIRECT, requestLogger, async (req, res) => {
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    console.log(
      "LTI_ASSIGNMENT_REDIRECT -  req.query" + JSON.stringify(req.query)
    );

    res.redirect(
      LTI_ASSIGNMENT_REDIRECT + "?resourceId=" + req.query.resourceId
    );
  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get("/tool-info", requestLogger, async (req, res) => {
    const integrationInfo = {
      "OpenID Connect Initiation Url": `${path.join(
        APPLICATION_URL,
        OIDC_LOGIN_INIT_ROUTE
      )
        } `,
      "Target Link URI": `${path.join(
        APPLICATION_URL,
        LTI_ADVANTAGE_LAUNCH_ROUTE
      )
        } `,
      "Redirect URIS:": [
        `${path.join(APPLICATION_URL, LTI_INSTRUCTOR_REDIRECT)} `,
        `${path.join(APPLICATION_URL, LTI_STUDENT_REDIRECT)} `
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
  });
};

export default ltiLaunchEndpoints;
