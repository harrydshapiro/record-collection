import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditableEntity<
  T extends AuditableEntity<T>,
> extends BaseEntity {
  public constructor(init?: Partial<T>) {
    super();
    Object.assign(this, init);
  }

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
