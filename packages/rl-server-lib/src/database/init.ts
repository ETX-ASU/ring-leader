import { getConnection, createConnectionFromConfig } from "./db";
import ToolConsumer from "./entities/ToolConsumer";
import { createToolConsumer } from "../services/ToolConsumerService";

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
const initToolConsumers = async (toolConsumers: ToolConsumer[]): Promise<any> => {
  console.log("sticking these tool consumers in the DB:", toolConsumers);

  toolConsumers.forEach(async (toolConsumerData: ToolConsumer) => {
    toolConsumerData.public_key_jwk = JSON.stringify(toolConsumerData.public_key_jwk) || "";
    await createToolConsumer(toolConsumerData);
  });
};

const dbInit = (toolConsumers: ToolConsumer[], options: any): void => {
  createConnectionFromConfig(options);
  initToolConsumers(toolConsumers);
}

export { dbInit, initToolConsumers, ensureToolConsumer };
