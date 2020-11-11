import {Session} from "./entity/Session";


const initDBTables = (): void => {
    Session.createTable();
}

export default initDBTables;