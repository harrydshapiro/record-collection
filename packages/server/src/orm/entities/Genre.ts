import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Artist } from "./Artist";
import { AuditableEntity } from "./AuditableEntity";

@Entity("genres", { schema: "public" })
export class Genre extends AuditableEntity<Genre> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @ManyToMany(() => Genre)
  @JoinTable({
    name: "artists_genres",
    joinColumn: {
      name: "genre_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "artist_id",
      referencedColumnName: "id",
    },
  })
  artists!: Artist[];
}

export type IGenre = InstanceType<typeof Genre>;
