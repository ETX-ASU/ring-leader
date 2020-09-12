import getConnection from "./db";
import { ToolConsumer } from "./entities/ToolConsumer";

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
  toolConsumer.name = "Canvas";
  toolConsumer.private_key = ""; // TODO get these from env variable?
  toolConsumer.public_key = "";

  await ensureToolConsumer(toolConsumer);
};

export default initToolConsumers;
