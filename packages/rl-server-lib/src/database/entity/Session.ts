import {
    Config,
    Decorator,
    Query,
    Table,
  } from "dynamo-types";
  
  @Decorator.Table({ name: `Session` })
  export class Session extends Table {
      
    @Decorator.HashPrimaryKey("session_id")
    public static readonly primaryKey: Query.HashPrimaryKey<Session, string>;
  
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Session>;
  
    @Decorator.Attribute({ name: "session_id" })
    public sessionId: string;
  
    @Decorator.Attribute({ name: "session" })
    public session: string;

  }
