import {
  Config,
  Decorator,
  Query,
  Table,
} from "dynamo-types";

import { TOOL_CONSUMER_TABLE_NAME } from "@asu-etx/rl-shared";

@Decorator.Table({ name: TOOL_CONSUMER_TABLE_NAME })
export class ToolConsumer extends Table {
  @Decorator.HashPrimaryKey("uuid")
  public static readonly primaryKey: Query.HashPrimaryKey<ToolConsumer, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<ToolConsumer>;

  @Decorator.Attribute({ name: "name" })
  name: string;

  @Decorator.Attribute({ name: "uuid" })
  uuid: string;

  @Decorator.Attribute({ name: "iss" })
  iss: string;

  @Decorator.Attribute({ name: "client_id" })
  client_id: string;

  @Decorator.Attribute({ name: "keyid" })
  keyid: string;

  @Decorator.Attribute({ name: "alg" })
  alg: string;

  @Decorator.Attribute({ name: "deployment_id" })
  deployment_id: string;

  @Decorator.Attribute({ name: "private_key" })
  private_key: string;

  @Decorator.Attribute({ name: "public_key" })
  public_key: string;

  @Decorator.Attribute({ name: "public_key_jwk" })
  public_key_jwk: string;

  @Decorator.Attribute({ name: "platformOIDCAuthEndPoint" })
  platformOIDCAuthEndPoint: string;

  @Decorator.Attribute({ name: "platformAccessTokenEndpoint" })
  platformAccessTokenEndpoint: string;

  @Decorator.Attribute({ name: "platformPublicJWKEndpoint" })
  platformPublicJWKEndpoint: string;

  @Decorator.Attribute({ name: "platformPublicKey" })
  platformPublicKey: string;

  @Decorator.Attribute({ name: "toolApplicationUrl" })
  toolApplicationUrl: string;

  @Decorator.Attribute({ name: "accessTokenPostContentType" })
  accessTokenPostContentType: string;
}

export default ToolConsumer;
