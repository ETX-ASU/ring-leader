import path from "path";
import { Express } from "express";
import {
  rlInitiateOIDC,
  validateToken,
  getAccessToken
} from "@asu-etx/rl-server-lib";
import getConnection from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import requestLogger from "../middleware/requestLogger";
import { APPLICATION_URL } from "../environment";

const getToolConsumers = async (): Promise<ToolConsumer[]> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumers = await toolConsumerRepository.find();
  return toolConsumers;
};

const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";
const LTI_INSTRUCTOR_REDIRECT = "/instructor";
const LTI_STUDENT_REDIRECT = "/student";
const plateformAccessToken = {
  // we get this during plateform registration
  platformAccessTokenEndpoint:
    "https://lti-ri.imsglobal.org/platforms/1285/access_tokens", // we get this during plateform registration
  clientId: "SDF7ASDLSFDS9",
  platformKid: "ASU ETX - Ring Leader - rl-ims-platform - Public Key",
  alg: "RS256",
  platformPrivateKey:
    "-----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDB6FNGSUu3jmZ LlIigYOrEq2rNIK8/0614RUAQKpVkY1FaRNRthsOJ9Xz0wK4QcZn2eRxkfxKYMNB 4Z/pvKlXACtkjwbJ/zResrzG9QTIKpskXs3C/tNDgDdIQXvJcfz/2gN4zFdihR7m DR+qrG/MFUA85zY/gG2wRSveSia3pA45D4t3odakWX7OizNR0A7pbHHpXz0gmGLz v64B6WVpwqWEc7vvNBQBpYA5P5Y7XRotZ/kmwzP+shYOE3Mm5x5HMORxsK7+ZPDw g8Qy5dAaXR+OTtW6fKpwZZwBsS5R5BTpB2nu45Cz2BscjdFbJRzUOT8AmljqFj1x 1MUGiMOfAgMBAAECggEAO/qNvcM87zQCrLxVIC2Ki8Mby+pDRtKRp1fIeKJqgBRa SP1uppOFsI3Ju8mqLXZ1CR02p0LJPyqRAiLcZirSPWJc9fkSkm688V6wtdNGnDSW L9JEH3L1D+5PkhYpdqNqtlia9ryJJ1BfV0qz8W5El5P1hIVq5o6drTcorZ1KWPE+ DB4bcdCWHCYq4Iw0SExQGRBao/YcLK+73BtFLDaF/yG6zVwRige+Utn0tnuJT69F ObPaSjL7EvV+yMV7j5ZZgiQ8Ki6h74BV0Or3/o4ADwTS87rI7aHxRYL6euZcrwlz azrV7lRr3dRc7MVa/S3/4iPlShzizQBk98ZXBtEmiQKBgQD38WPYiNiCYFhv9P2j 17+K11Tq6zLBLmxpyRJTr6WBEo7B6JtE2Mte47Rf5w8tuY5LFw9PDQp3QfeHuFFM o7AfljayV3Sh6kIQ7LivplEV5fPDVpnShUwh8T4Pt3ltYODwx9xDkdcNPr0LhOQY pdwwgJMbvyv8ZAWmH0jM8L5EKwKBgQDJXg/Edj+LJwdBi516SMMeyJuNFeqJMkCX /TQzptLIKQX2CaB3HJdRVrBd1EM8DH0jl1Ro1tTuZq5dokGrfz2I9EyCugkXRrxe kenu+KVbznUlzA1OMUd18ld/G3PgHmSrr0h5yQU4ZpW8WD2SHS8MnMMRANqn8m6b xA6ErT4AXQKBgGTVwhKFDPBw+GaHz0N78cUob7uebaTNGYAoKxDnxTpp7q8Dx2nH dWYg2vGJyc2BwlHdjfdLSW9Y369NkZrGk1E1SQdcs+1JlRbG/xFIZX+vZmSR6rsI RP8k2mWP641FMhYaYgUE4d3cHwv5Pr6bbaI4GBvXsq7Ris6VuIjIe8jDAoGBAMYZ 7XUfx9/D45WOHrzgvGSagr1H5FZYw8dC6IowAom8Igss6VqFHDB/Ej8cxZBb0Pik tfv17cEj70JakDSBly4W+PZawvrNMh/veK8KmtM4x3MJzcUxIdZdNcrsXRENlYh5 htmY87PK6GBEhz4py9Ginx0pM/OpwzsmpAnOzYJZAoGAQXuFrooAf4HaKlEg3WJX uIU5GBLnEmreFTeEuoThwW7ZIBpItlZ2S07h8Lbt8kUT/Bmx6g2/MMwu79OgTt3u EZP+SwmaR+04J8x/iGpTnXQ5DPCLQ1XECCX9zXtNfzdgdEKC1+Qsx+X4eGXVG6t0 v4Bi04mrNCbBi+qfMZwKN8I= -----END PRIVATE KEY-----"
};

const plateformLaunch = {
  plateformOIDCAuthEndPoint:
    "https://lti-ri.imsglobal.org/platforms/1285/authorizations/new", // we get this during plateform registration
  nounce: "SDF7ASDLSFDS9", //This is the same value that passed during the OIDC request. Tool need to pass this.
  state: "SDF7ASDLSFDS9", //This is the same value that passed during the OIDC request. Tool need to pass this.
  clientId: "SDF7ASDLSFDS9"
};
const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    console.log(req);
    rlInitiateOIDC(req, res, plateformLaunch);
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    // OIDC POST initiation
    console.log(req);
    rlInitiateOIDC(req, res, plateformLaunch);
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, (req, res) => {
    console.log("LTI Advantage Token");
    console.log(req);
    const verified = validateToken(req, plateformLaunch);
    console.log(verified);
    if (verified) getAccessToken(plateformAccessToken);
    res.redirect(LTI_INSTRUCTOR_REDIRECT);
  });

  // a convenience endpoint for sharing integration info ( not recommended to do this in production )
  app.get("/tool-info", requestLogger, async (req, res) => {
    const integrationInfo = {
      "OpenID Connect Initiation Url": `${path.join(
        APPLICATION_URL,
        OIDC_LOGIN_INIT_ROUTE
      )}`,
      "Target Link URI": `${path.join(
        APPLICATION_URL,
        LTI_ADVANTAGE_LAUNCH_ROUTE
      )}`,
      "Redirect URIS:": [
        `${path.join(APPLICATION_URL, LTI_INSTRUCTOR_REDIRECT)}`,
        `${path.join(APPLICATION_URL, LTI_STUDENT_REDIRECT)}`
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

    res.send(`<pre>${data}</pre>`);
  });
};

export default ltiLaunchEndpoints;
