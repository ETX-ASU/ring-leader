import path from "path";
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
      database: path.join(__dirname, "../../db.sqlite"),
      entities: [ToolConsumer],
      logging: true
    });
  }

  return connectionCreationPromise.then(() => {
    return getTypeOrmConnection();
  });
};

export default getConnection;
