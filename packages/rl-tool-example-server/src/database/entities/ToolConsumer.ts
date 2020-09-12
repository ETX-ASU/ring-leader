import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("TOOL_CONSUMER")
export class ToolConsumer {
  @PrimaryGeneratedColumn("uuid")
  id: number | undefined = undefined;

  @Column("varchar", { length: 150 })
  name = "";

  @Column("varchar", { length: 64 })
  public_key = "";

  @Column("varchar", { length: 64 })
  private_key = "";
}

export default ToolConsumer;
