import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Track } from "./Track";
import { Artist } from "./Artist";
import { AuditableEntity } from "./AuditableEntity";

@Entity("albums", { schema: "public" })
export class Album extends AuditableEntity<Album> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("jsonb", { name: "images", default: [] })
  images!: { url: string; height: number; width: number }[];

  @Column("timestamp without time zone", {
    name: "release_date",
    nullable: true,
  })
  releaseDate?: Date;

  @Column("integer", { name: "popularity", nullable: true })
  popularity?: number;

  @Column("character varying", { name: "uri", unique: true })
  uri!: string;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: "albums_artists",
    joinColumn: {
      name: "album_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "artist_id",
      referencedColumnName: "id",
    },
  })
  artists!: Artist[];

  @OneToMany(() => Track, (tracks) => tracks.album)
  tracks!: Track[];
}

export type IAlbum = InstanceType<typeof Album>;
