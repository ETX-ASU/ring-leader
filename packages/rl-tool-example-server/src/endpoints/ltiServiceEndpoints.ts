import { Express } from "express";
import { getUsers } from "@asu-etx/rl-client-lib";
import log from "../services/LogService";
import requestLogger from "../middleware/requestLogger";
import { getAccessToken } from "@asu-etx/rl-server-lib";

// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client
const ltiServiceEndpoints = (app: Express): void => {
  app.get("/lti-service/roster", requestLogger, async (req, res) => {
    console.log("/lti-service/roster");
    console.log(req);
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const tokenObject = req.session.tokenObject;
    console.log("This is idtoken from session-" + tokenObject);

    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const results = await getUsers(tokenObject);
    res.send(results);
  });

  app.get("/lti-service/accesstoken", requestLogger, async (req, res) => {
    console.log("/lti-service/accesstoken");
    console.log(req);
    if (!req.session) {
      throw new Error("no session detected, something is wrong");
    }
    const plateformDetails = {
      platformAccessTokenEndpoint:
        "https://unicon.instructure.com/login/oauth2/token",
      alg: "RS256",
      keyid: "ASU ETX - Ring Leader - canvas-unicon - Public Key",
      platformPrivateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDB6FNGSUu3jmZ\nLlIigYOrEq2rNIK8/0614RUAQKpVkY1FaRNRthsOJ9Xz0wK4QcZn2eRxkfxKYMNB\n4Z/pvKlXACtkjwbJ/zResrzG9QTIKpskXs3C/tNDgDdIQXvJcfz/2gN4zFdihR7m\nDR+qrG/MFUA85zY/gG2wRSveSia3pA45D4t3odakWX7OizNR0A7pbHHpXz0gmGLz\nv64B6WVpwqWEc7vvNBQBpYA5P5Y7XRotZ/kmwzP+shYOE3Mm5x5HMORxsK7+ZPDw\ng8Qy5dAaXR+OTtW6fKpwZZwBsS5R5BTpB2nu45Cz2BscjdFbJRzUOT8AmljqFj1x\n1MUGiMOfAgMBAAECggEAO/qNvcM87zQCrLxVIC2Ki8Mby+pDRtKRp1fIeKJqgBRa\nSP1uppOFsI3Ju8mqLXZ1CR02p0LJPyqRAiLcZirSPWJc9fkSkm688V6wtdNGnDSW\nL9JEH3L1D+5PkhYpdqNqtlia9ryJJ1BfV0qz8W5El5P1hIVq5o6drTcorZ1KWPE+\nDB4bcdCWHCYq4Iw0SExQGRBao/YcLK+73BtFLDaF/yG6zVwRige+Utn0tnuJT69F\nObPaSjL7EvV+yMV7j5ZZgiQ8Ki6h74BV0Or3/o4ADwTS87rI7aHxRYL6euZcrwlz\nazrV7lRr3dRc7MVa/S3/4iPlShzizQBk98ZXBtEmiQKBgQD38WPYiNiCYFhv9P2j\n17+K11Tq6zLBLmxpyRJTr6WBEo7B6JtE2Mte47Rf5w8tuY5LFw9PDQp3QfeHuFFM\no7AfljayV3Sh6kIQ7LivplEV5fPDVpnShUwh8T4Pt3ltYODwx9xDkdcNPr0LhOQY\npdwwgJMbvyv8ZAWmH0jM8L5EKwKBgQDJXg/Edj+LJwdBi516SMMeyJuNFeqJMkCX\n/TQzptLIKQX2CaB3HJdRVrBd1EM8DH0jl1Ro1tTuZq5dokGrfz2I9EyCugkXRrxe\nkenu+KVbznUlzA1OMUd18ld/G3PgHmSrr0h5yQU4ZpW8WD2SHS8MnMMRANqn8m6b\nxA6ErT4AXQKBgGTVwhKFDPBw+GaHz0N78cUob7uebaTNGYAoKxDnxTpp7q8Dx2nH\ndWYg2vGJyc2BwlHdjfdLSW9Y369NkZrGk1E1SQdcs+1JlRbG/xFIZX+vZmSR6rsI\nRP8k2mWP641FMhYaYgUE4d3cHwv5Pr6bbaI4GBvXsq7Ris6VuIjIe8jDAoGBAMYZ\n7XUfx9/D45WOHrzgvGSagr1H5FZYw8dC6IowAom8Igss6VqFHDB/Ej8cxZBb0Pik\ntfv17cEj70JakDSBly4W+PZawvrNMh/veK8KmtM4x3MJzcUxIdZdNcrsXRENlYh5\nhtmY87PK6GBEhz4py9Ginx0pM/OpwzsmpAnOzYJZAoGAQXuFrooAf4HaKlEg3WJX\nuIU5GBLnEmreFTeEuoThwW7ZIBpItlZ2S07h8Lbt8kUT/Bmx6g2/MMwu79OgTt3u\nEZP+SwmaR+04J8x/iGpTnXQ5DPCLQ1XECCX9zXtNfzdgdEKC1+Qsx+X4eGXVG6t0\nv4Bi04mrNCbBi+qfMZwKN8I=\n-----END PRIVATE KEY-----\n" //plateform.platformKid
    };
    const tokenDetails = req.session.tokenObject;
    const tokenObject = { tokenDetails, ...plateformDetails };
    // pass the token from the session to the rl-client-lib to make the call to Canvas
    const tokenRes = await getAccessToken(
      tokenObject,
      "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
    );
    res.send(tokenRes);
  });

  app.get("/lti-service/assignments", requestLogger, (req, res) => {
    res.send("");
  });

  app.get("/lti-service/grades", requestLogger, (req, res) => {
    res.send("");
  });
};

export default ltiServiceEndpoints;
