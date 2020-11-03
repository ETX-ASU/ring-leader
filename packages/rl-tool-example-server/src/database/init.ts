import { getConnection, createConnectionFromConfig } from "./db";
import ToolConsumer from "@asu-etx/rl-server-lib/src/models/ToolConsumer";
import { logger } from "@asu-etx/rl-shared";

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



const dbInit = async (options: any): Promise<any> => {
  // Init DB
  logger.debug("Initializing the DB");
  const connection = await getConnection();
  await connection.synchronize(); // this creates the tables based on our entity definitions
  await createConnectionFromConfig(options);
}

export { dbInit, ensureToolConsumer };
