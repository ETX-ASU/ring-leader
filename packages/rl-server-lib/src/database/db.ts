import ToolConsumer from "./entities/ToolConsumer";
import Assignment from "./entities/Assignment";
import {
  createConnection,
  getConnection as getTypeOrmConnection,
  Connection
} from "typeorm";

let connectionCreationPromise: any = false;

const getConnection = (): Promise<Connection> => {
  if (connectionCreationPromise === false) {
    console.log("creating connection")
    connectionCreationPromise = createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      entities: [ToolConsumer, Assignment],
      logging: true
    });
  }

  return connectionCreationPromise.then(() => {
    return getTypeOrmConnection();
  });
};


export default getConnection;
