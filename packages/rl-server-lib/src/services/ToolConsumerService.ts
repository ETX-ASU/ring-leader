import ToolConsumer from "../models/ToolConsumer";
import ToolConsumerRequest from "../models/ToolConsumerRequest";
import { logger } from "@asu-etx/rl-shared";

const toolConsumers: ToolConsumer[] | undefined = process.env.toolConsumers
  ? JSON.parse(process.env.toolConsumers)
  : undefined;

const getToolConsumerByName = (name: string): ToolConsumer | undefined => {
  let toolConsumer = undefined;
  logger.debug("toolConsumers", toolConsumers);
  toolConsumers?.forEach((tc) => {
    if (tc.name == name) {
      return (toolConsumer = tc);
    }
  });
  return toolConsumer;
};


const getToolConsumer = (request: ToolConsumerRequest): ToolConsumer | undefined => {
  let toolConsumer: ToolConsumer | undefined = undefined;
  toolConsumers?.forEach((tc) => {
    if (
      tc.iss === request.iss &&
      tc.client_id === request.client_id &&
      tc.deployment_id === request.deployment_id
    ) {
      return (toolConsumer = tc);
    }

    if (!toolConsumer) {
      if (tc.iss === request.iss && tc.client_id === request.client_id) {
        return (toolConsumer = tc);
      }
    }

    if (!toolConsumer) {
      if (tc.iss === request.iss) {
        return (toolConsumer = tc);
      }
    }
  });
  return toolConsumer;
};

export { getToolConsumer, getToolConsumerByName };
