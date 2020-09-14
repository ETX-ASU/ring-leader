import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("TOOL_CONSUMER")
class ToolConsumer {
  @PrimaryGeneratedColumn("uuid")
  id: number | undefined = undefined;

  @Column("varchar", { length: 150 })
  client_id = "";

  @Column("varchar", { length: 64 })
  private_key = "";
}

export default ToolConsumer;
