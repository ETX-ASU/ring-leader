import path from "path";
import { Express } from "express";

import getConnection from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import requestLogger from "../middleware/requestLogger";
import { APPLICATION_URL } from "../environment";

const getToolConsumers = async (): Promise<ToolConsumer[]> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumers = await toolConsumerRepository.find();
  console.log("toolConsumers:", toolConsumers);
  return toolConsumers;
};

const OIDC_LOGIN_INIT_ROUTE = "/init-oidc";
const LTI_ADVANTAGE_LAUNCH_ROUTE = "/lti-advantage-launch";

const ltiLaunchEndpoints = (app: Express): void => {
  // OIDC initiation
  app.get(OIDC_LOGIN_INIT_ROUTE, requestLogger, (req, res) => {
    res.send("");
  });

  // post to accept the LMS launch with idToken
  app.post(LTI_ADVANTAGE_LAUNCH_ROUTE, requestLogger, (req, res) => {
    res.redirect(`/instructor`);
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
      )}`
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
