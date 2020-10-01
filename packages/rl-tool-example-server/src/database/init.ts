import getConnection from "./db";
import ToolConsumer from "./entities/ToolConsumer";
import { createToolConsumer } from "../services/ToolConsumerService";
import { TOOL_CONSUMERS } from "../environment";

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

// because this is an in-memory database we don't have to clear the table
// assume it is empty and simply iterate through each tool consumer and add it
const initToolConsumers = async (): Promise<any> => {
  console.log("sticking these tool consumers in the DB:", TOOL_CONSUMERS);

  TOOL_CONSUMERS.forEach(async (toolConsumerData: ToolConsumer) => {
    toolConsumerData.public_key_jwk = JSON.stringify(toolConsumerData.public_key_jwk) || "";
    await createToolConsumer(toolConsumerData);
  });
};

export default initToolConsumers;
