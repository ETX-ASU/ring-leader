import { ToolConsumer } from "./entities/ToolConsumer";
import {
  createConnection,
  getConnection as getTypeOrmConnection,
  Connection
} from "typeorm";

let connectionCreationPromise: any = false;

const getConnection = (): Promise<Connection> => {
  if (connectionCreationPromise === false) {
    connectionCreationPromise = createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      entities: [ToolConsumer],
      logging: false
    });
  }

  return connectionCreationPromise.then(() => {
    return getTypeOrmConnection();
  });
};

export default getConnection;
