import {
  Config,
  Decorator,
  Query,
  Table,
} from "dynamo-types";

import { SESSION_TABLE_NAME } from "@asu-etx/rl-shared";

@Decorator.Table({ name: SESSION_TABLE_NAME })
export class Session extends Table {

  @Decorator.HashPrimaryKey("session_id")
  public static readonly primaryKey: Query.HashPrimaryKey<Session, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<Session>;

  @Decorator.Attribute({ name: "session_id" })
  public sessionId: string;

  @Decorator.Attribute({ name: "session" })
  public session: string;

  @Decorator.Attribute({ name: "modified_on" })
  public modifiedOn: number;

  @Decorator.Attribute({ name: "ttl" })
  public ttl: number;

}
