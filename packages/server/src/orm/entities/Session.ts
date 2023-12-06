import { Column, Entity } from "typeorm";

@Entity("session", { schema: "public" })
export class Session {
  @Column("character varying", { primary: true, name: "sid" })
  sid!: string;

  @Column("json", { name: "sess" })
  sess!: object;

  @Column("timestamp without time zone", { name: "expire" })
  expire!: Date;
}
