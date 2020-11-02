import ToolConsumer from "./entities/ToolConsumer";
import Assignment from "./entities/Assignment";
import { logger, PLATFORM } from "@asu-etx/rl-shared";
import {
  createConnection,
  getConnection as getTypeOrmConnection,
  Connection
} from "typeorm";

let connectionCreationPromise: any = false;

const getConnection = async (): Promise<Connection> => {
  if (connectionCreationPromise === false) {
    connectionCreationPromise = await createConnection({
      type: "aurora-data-api",
      database: "LtiData",
      secretArn:
        "arn:aws:secretsmanager:us-west-2:540838891768:secret:dev/aurora/lti-48pdM7",
      resourceArn: "arn:aws:rds:us-west-2:540838891768:cluster:dev-lti",
      region: "us-west-2",
      serviceConfigOptions: {}
    });
  }

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