
import getConnection from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import ToolConsumerRequest from "../database/entities/ToolConsumerRequest";


const createToolConsumer = async (consumer: ToolConsumer): Promise<ToolConsumer> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  return toolConsumerRepository.save(consumer);
}

const getDeploymentConsumer = async (request: ToolConsumerRequest): Promise<ToolConsumer | undefined> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const consumerDeployment = await toolConsumerRepository.findOne({
    where: {
      iss: request.iss,
      client_id: request.client_id,
      deployment_id: request.deployment_id
    }
  });
  if (consumerDeployment == undefined) {
    const toolConsumer: ToolConsumer | undefined = await getToolConsumer(request);
    if (toolConsumer != undefined) {
      toolConsumer.id = 0;
      toolConsumer.deployment_id = request.deployment_id;
      toolConsumer.name = `toolConsumer.name - ${request.deployment_id}`;
      return createToolConsumer(toolConsumer);
    }
  }
  return consumerDeployment;
};

const getToolConsumer = async (request: ToolConsumerRequest): Promise<ToolConsumer | undefined> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumer: ToolConsumer | undefined = await toolConsumerRepository.findOne({
    where: {
      iss: request.iss,
      client_id: request.client_id,
      deployment_id: "0"
    }
  });
  console.log(`found tool consumer: ${JSON.stringify(toolConsumer)}`)
  return toolConsumer;
};

const getToolConsumerByName = async (name: String): Promise<ToolConsumer | undefined> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumer = await toolConsumerRepository.findOne({
    where: {
      name: name
    }
  });
  return toolConsumer;
};

export { createToolConsumer, getDeploymentConsumer, getToolConsumer, getToolConsumerByName }

