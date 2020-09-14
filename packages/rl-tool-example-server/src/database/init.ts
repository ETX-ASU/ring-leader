import getConnection from "./db";
import ToolConsumer from "./entities/ToolConsumer";
import { TOOL_CONSUMERS } from "../environment";

const ensureToolConsumer = async (toolConsumer: ToolConsumer): Promise<any> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const matchingConsumer = await toolConsumerRepository.findOne({
    client_id: toolConsumer.client_id
  });
  if (matchingConsumer === undefined) {
    await toolConsumerRepository.save(toolConsumer);
  }
};

const initToolConsumers = async (): Promise<any> => {
  TOOL_CONSUMERS.forEach(async (toolConsumerData: ToolConsumer) => {
    const toolConsumer = new ToolConsumer();
    toolConsumer.client_id = toolConsumerData.client_id;
    toolConsumer.private_key = toolConsumerData.private_key;
    await ensureToolConsumer(toolConsumer);
  });
};

export default initToolConsumers;
