import getConnection from "./db";
import { ToolConsumer } from "./entities/ToolConsumer";
import {
  TOOL_CONSUMER_NAME,
  TOOL_CONSUMER_PUBLIC_KEY,
  TOOL_CONSUMER_PRIVATE_KEY
} from "../environment";

const ensureToolConsumer = async (toolConsumer: ToolConsumer): Promise<any> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const matchingConsumer = await toolConsumerRepository.findOne({
    name: toolConsumer.name
  });
  if (matchingConsumer === undefined) {
    await toolConsumerRepository.save(toolConsumer);
  }
};

const initToolConsumers = async (): Promise<any> => {
  const toolConsumer = new ToolConsumer();
  toolConsumer.name = TOOL_CONSUMER_NAME;
  toolConsumer.public_key = TOOL_CONSUMER_PUBLIC_KEY;
  toolConsumer.private_key = TOOL_CONSUMER_PRIVATE_KEY;

  await ensureToolConsumer(toolConsumer);
};

export default initToolConsumers;
