import ToolConsumer from "../models/ToolConsumer";
import ToolConsumerRequest from "../models/ToolConsumerRequest";
import { logger } from "@asu-etx/rl-shared";

const getToolConsumers = (): ToolConsumer[] => {
  const toolConsumers = JSON.parse(process.env.TOOL_CONSUMERS ? process.env.TOOL_CONSUMERS : "[]");
  //logger.info(`first toolConsumer parsed ${JSON.stringify(toolConsumers[0])}`);
  return toolConsumers;
};

const getToolConsumerByName = (name: string): ToolConsumer | undefined => {
  let toolConsumer = undefined;
  getToolConsumers().forEach((tc) => {
    if (tc.name == name) {
      return (toolConsumer = tc);
    }
  });
  //logger.debug(`found toolConsumer: ${JSON.stringify(toolConsumer)}`);
  return toolConsumer;
};

const getToolConsumerById = (uuid: string): ToolConsumer | undefined => {
  let toolConsumer = undefined;
  getToolConsumers().forEach((tc) => {
    if (tc.uuid == uuid) {
      return (toolConsumer = tc);
    }
  });
  //logger.debug(`found toolConsumer: ${toolConsumer}`);
  return toolConsumer;
};


const getToolConsumer = (request: ToolConsumerRequest): ToolConsumer | undefined => {
  let toolConsumer: ToolConsumer | undefined = undefined;
  logger.info("Tool Consumer Request: " + JSON.stringify(request));
  getToolConsumers().forEach((tc) => {
    if (
      tc.iss == request.iss &&
      tc.client_id == request.client_id &&
      tc.deployment_id == request.deployment_id
    ) {
      return (toolConsumer = tc);
    }
  });
  if (!toolConsumer) {
    getToolConsumers().forEach((tc) => {
      if (tc.iss == request.iss && tc.client_id == request.client_id) {
        return (toolConsumer = tc);
      }
    });
  }

  if (!toolConsumer) {
    getToolConsumers().forEach((tc) => {
      if (tc.iss == request.iss) {
        return (toolConsumer = tc);
      }
    });
  }

  logger.info("Tool Consumer Found from request: " + JSON.stringify(toolConsumer));
  return toolConsumer;
};

const getJwks = (): any[] => {
  const jwks: any[] = [];
  getToolConsumers().forEach((tc) => {
    jwks.push(tc.public_key_jwk);
  });
  return jwks;
}

export { getToolConsumer, getToolConsumerByName, getToolConsumers, getToolConsumerById, getJwks };
