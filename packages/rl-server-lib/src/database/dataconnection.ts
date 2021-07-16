import { Session } from "./entity/Session";
import { ToolConsumer } from "./entity/ToolConsumer";

const initDBTables = (): void => {
  Session.createTable();
  ToolConsumer.createTable();
}

export default initDBTables;