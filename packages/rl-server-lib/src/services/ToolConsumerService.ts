import ToolConsumer from "../database/entity/ToolConsumer";
import ToolConsumerRequest from "../models/ToolConsumerRequest";
import { logger } from "@asu-etx/rl-shared";
import { HTTPError } from "got/dist/source";



const getToolConsumers = async (): Promise<(ToolConsumer | undefined)[]> => {
  let toolConsumers: (ToolConsumer | undefined)[];
  const value = await ToolConsumer.primaryKey.batchGetFull([]);
  toolConsumers = await value.records;
  if (!toolConsumers) {

  }
  //logger.info(`first toolConsumer parsed ${JSON.stringify(toolConsumers[0])}`);
  return toolConsumers;
};

const addConsumerToolsFromFile = (): ToolConsumer[] {
  const toolConsumers = JSON.parse(process.env.TOOL_CONSUMERS ? process.env.TOOL_CONSUMERS : "[]");
  if (toolConsumers)
    toolConsumers.forEach((tc: ToolConsumer) => {
      if (tc) {
        ToolConsumer.writer.put(tc);
      }
    });
  return toolConsumers;
}

const getToolConsumerByName = async (name: string): Promise<ToolConsumer | undefined> => {
  let toolConsumer = undefined;
  let tools = await getToolConsumers();
  tools.forEach((tc) => {
    if (tc && tc.name == name) {
      return (toolConsumer = tc);
    }
  });
  //logger.debug(`found toolConsumer: ${JSON.stringify(toolConsumer)}`);
  return toolConsumer;
};

const getToolConsumerById = async (uuid: string): Promise<ToolConsumer | undefined> => {
  let toolConsumer = undefined;
  let tools = await getToolConsumers();
  tools.forEach((tc) => {
    if (tc && tc.uuid == uuid) {
      return (toolConsumer = tc);
    }
  });
  //logger.debug(`found toolConsumer: ${toolConsumer}`);
  return toolConsumer;
};


const getToolConsumer = async (request: ToolConsumerRequest): Promise<ToolConsumer | undefined> => {
  let toolConsumer: ToolConsumer | undefined = undefined;
  logger.info("Tool Consumer Request: " + JSON.stringify(request));
  if (!request.iss && !request.client_id && !request.deployment_id) {
    logger.error(`ToolConsumer not found for ${JSON.stringify(request)}`);
    return toolConsumer;
  }

  let tools = await getToolConsumers();

  tools.forEach((tc) => {
    if (
      tc &&
      tc.iss == request.iss &&
      tc.client_id == request.client_id &&
      tc.deployment_id == request.deployment_id
    ) {
      return (toolConsumer = tc);
    }
  });
  if (!toolConsumer && request.iss && request.client_id && request.deployment_id) {
    logger.error(`ToolConsumer not found for ${JSON.stringify(request)}`);
    throw new Error(`ToolConsumer not found for ${JSON.stringify(request)}`);
  }
  if (!toolConsumer) {
    tools.forEach((tc) => {
      if (
        tc &&
        tc.iss == request.iss &&
        tc.deployment_id == request.deployment_id
      ) {
        return (toolConsumer = tc);
      }
    });
  }
  if (!toolConsumer && request.iss && request.deployment_id) {
    logger.error(`ToolConsumer not found for ${JSON.stringify(request)}`);
    throw new Error(`ToolConsumer not found for ${JSON.stringify(request)}`);
  }
  if (!toolConsumer) {
    tools.forEach((tc) => {
      if (
        tc && tc.iss == request.iss && tc.client_id == request.client_id) {
        return (toolConsumer = tc);
      }
    });
  }
  if (!toolConsumer) {
    tools.forEach((tc) => {
      if (
        tc && tc.iss == request.iss) {
        return (toolConsumer = tc);
      }
    });
  }
  if (!toolConsumer) {
    logger.error(`ToolConsumer not found for ${JSON.stringify(request)}`);
    throw new Error(`ToolConsumer not found for ${JSON.stringify(request)}`);
  }

  logger.info("Tool Consumer Found from request: " + JSON.stringify(toolConsumer));
  return toolConsumer;
};

const getJwks = async (): Promise<any> => {
  const jwks: any[] = [];
  const tools = await getToolConsumers();
  tools.forEach((tc) => {
    if (tc) {
      jwks.push(tc.public_key_jwk);
    }
  });
  const keys = { "keys": jwks };
  return keys;
}

export { getToolConsumer, getToolConsumerByName, getToolConsumers, getToolConsumerById, getJwks };
