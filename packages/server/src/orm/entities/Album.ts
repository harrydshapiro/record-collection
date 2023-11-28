import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./Track";
import { Artist } from "./Artist";
import { Genre } from "./Genre";
import { AuditableEntity } from "./AuditableEntity";

@Entity("albums", { schema: "public" })
export class Album extends AuditableEntity<Album> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("jsonb", { name: "images", default: [] })
  images!: { url: string, height: number, width: number }[];

  @Column("timestamp without time zone", {
    name: "release_date",
    nullable: true,
  })
  releaseDate?: Date | null;

  @Column("integer", { name: "popularity", nullable: true })
  popularity?: number | null;

  @Column("character varying", { name: "uri", unique: true })
  uri!: string;

  @ManyToMany(type => Artist)
  @JoinTable({
      name: "albums_artists",
      joinColumn: {
        name: "album_id",
        referencedColumnName: "id"
      },
      inverseJoinColumn: {
        name: "artist_id",
        referencedColumnName: "id"
      }
  })
  artists!: Artist[];

  @OneToMany(() => Track, (tracks) => tracks.album)
  tracks!: Track[];
}

export type IAlbum = InstanceType<typeof Album>;
