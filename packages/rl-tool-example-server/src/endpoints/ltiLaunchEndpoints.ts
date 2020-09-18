import path from "path";
import { Express } from "express";
import url from "url";
import {
  rlProcessOIDCRequest,
  rlValidateToken,
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

const plateformLaunch = {
  plateformOIDCAuthEndPoint:
    "https://unicon.instructure.com/api/lti/authorize_redirect" // we get this during plateform registration
};

const plateformAccessToken = {
  platformAccessTokenEndpoint:
    "https://unicon.instructure.com/login/oauth2/token", // we get this during plateform registration
  platformPrivateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDB6FNGSUu3jmZ\nLlIigYOrEq2rNIK8/0614RUAQKpVkY1FaRNRthsOJ9Xz0wK4QcZn2eRxkfxKYMNB\n4Z/pvKlXACtkjwbJ/zResrzG9QTIKpskXs3C/tNDgDdIQXvJcfz/2gN4zFdihR7m\nDR+qrG/MFUA85zY/gG2wRSveSia3pA45D4t3odakWX7OizNR0A7pbHHpXz0gmGLz\nv64B6WVpwqWEc7vvNBQBpYA5P5Y7XRotZ/kmwzP+shYOE3Mm5x5HMORxsK7+ZPDw\ng8Qy5dAaXR+OTtW6fKpwZZwBsS5R5BTpB2nu45Cz2BscjdFbJRzUOT8AmljqFj1x\n1MUGiMOfAgMBAAECggEAO/qNvcM87zQCrLxVIC2Ki8Mby+pDRtKRp1fIeKJqgBRa\nSP1uppOFsI3Ju8mqLXZ1CR02p0LJPyqRAiLcZirSPWJc9fkSkm688V6wtdNGnDSW\nL9JEH3L1D+5PkhYpdqNqtlia9ryJJ1BfV0qz8W5El5P1hIVq5o6drTcorZ1KWPE+\nDB4bcdCWHCYq4Iw0SExQGRBao/YcLK+73BtFLDaF/yG6zVwRige+Utn0tnuJT69F\nObPaSjL7EvV+yMV7j5ZZgiQ8Ki6h74BV0Or3/o4ADwTS87rI7aHxRYL6euZcrwlz\nazrV7lRr3dRc7MVa/S3/4iPlShzizQBk98ZXBtEmiQKBgQD38WPYiNiCYFhv9P2j\n17+K11Tq6zLBLmxpyRJTr6WBEo7B6JtE2Mte47Rf5w8tuY5LFw9PDQp3QfeHuFFM\no7AfljayV3Sh6kIQ7LivplEV5fPDVpnShUwh8T4Pt3ltYODwx9xDkdcNPr0LhOQY\npdwwgJMbvyv8ZAWmH0jM8L5EKwKBgQDJXg/Edj+LJwdBi516SMMeyJuNFeqJMkCX\n/TQzptLIKQX2CaB3HJdRVrBd1EM8DH0jl1Ro1tTuZq5dokGrfz2I9EyCugkXRrxe\nkenu+KVbznUlzA1OMUd18ld/G3PgHmSrr0h5yQU4ZpW8WD2SHS8MnMMRANqn8m6b\nxA6ErT4AXQKBgGTVwhKFDPBw+GaHz0N78cUob7uebaTNGYAoKxDnxTpp7q8Dx2nH\ndWYg2vGJyc2BwlHdjfdLSW9Y369NkZrGk1E1SQdcs+1JlRbG/xFIZX+vZmSR6rsI\nRP8k2mWP641FMhYaYgUE4d3cHwv5Pr6bbaI4GBvXsq7Ris6VuIjIe8jDAoGBAMYZ\n7XUfx9/D45WOHrzgvGSagr1H5FZYw8dC6IowAom8Igss6VqFHDB/Ej8cxZBb0Pik\ntfv17cEj70JakDSBly4W+PZawvrNMh/veK8KmtM4x3MJzcUxIdZdNcrsXRENlYh5\nhtmY87PK6GBEhz4py9Ginx0pM/OpwzsmpAnOzYJZAoGAQXuFrooAf4HaKlEg3WJX\nuIU5GBLnEmreFTeEuoThwW7ZIBpItlZ2S07h8Lbt8kUT/Bmx6g2/MMwu79OgTt3u\nEZP+SwmaR+04J8x/iGpTnXQ5DPCLQ1XECCX9zXtNfzdgdEKC1+Qsx+X4eGXVG6t0\nv4Bi04mrNCbBi+qfMZwKN8I=\n-----END PRIVATE KEY-----\n",
  alg: "RS256",
  platformKid: "ASU ETX - Ring Leader - canvas-unicon - Public Key"
};
const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC GET initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    console.log(req);

    const response: any = rlProcessOIDCRequest(req);
    //req.cookies.response = response;

    //This resposne will be save in session or DB and will be used in validating the nonce and other properties
    res.redirect(
      url.format({
        pathname: plateformLaunch.plateformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  app.post(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    // OIDC POST initiation
    console.log(req);
    const response: any = rlProcessOIDCRequest(req);
    //req.cookies.response = response;
    res.redirect(
      url.format({
        pathname: plateformLaunch.plateformOIDCAuthEndPoint,
        query: response
      })
    );
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, (req, res) => {
    console.log("LTI Advantage Token");
    console.log(req);
    //console.log("req.cookies.response");
    //console.log(req.cookies.response);

    /* const verified = rlValidateToken(req, req.cookies.response);
    console.log(verified);
    if (verified.isValidToken) {
      console.log("Is Valid Token");
      console.log(verified.isValidToken);
      console.log("id_token from plateform");
      console.log(verified.token);
    }*/
    getAccessToken(plateformAccessToken);
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
