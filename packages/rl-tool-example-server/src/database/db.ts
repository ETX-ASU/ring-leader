import ToolConsumer from "@asu-etx/rl-server-lib/src/models/ToolConsumer";
import { logger, Assignment } from "@asu-etx/rl-shared";
//const ENV_VARS = process.env;
import {
  createConnection,
  getConnection as getTypeOrmConnection,
  Connection
} from "typeorm";

let connectionCreationPromise: any = false;

const getConnection = async (): Promise<Connection> => {
  if (connectionCreationPromise === false) {
    logger.debug("creating connection")
    connectionCreationPromise = createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      entities: [ToolConsumer, Assignment],
      logging: true
    });
  }
  /*
  if (connectionCreationPromise === false) {
    connectionCreationPromise = await createConnection({
      type: ENV_VARS.db_type,
      database: ENV_VARS.db_database,
      secretArn: ENV_VARS.db_secretArn
      resourceArn: ENV_VARS.db_resourceArn,
      region: ENV_VARS.aws_region,
      logging: ENV_VARS.db_logging,
      entities: [ToolConsumer, Assignment],
      serviceConfigOptions: {}
    });
  }*/

  return connectionCreationPromise.then(() => {
    return getTypeOrmConnection();
  });
}
const createConnectionFromConfig = async (options: any): Promise<Connection> => {
  if (options == null || options == undefined) {
    return getConnection();
  }
  return getConnection();
}

export { getConnection, createConnectionFromConfig };