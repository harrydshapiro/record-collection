import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Track } from "./Track";
import { Artist } from "./Artist";
import { Genre } from "./Genre";

@Entity("albums", { schema: "public" })
export class Album {
  @Column("uuid", { primary: true, name: "id" })
  id!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("jsonb", { name: "images", default: [] })
  images!: object;

  @Column("timestamp without time zone", {
    name: "release_date",
    nullable: true,
  })
  releaseDate?: Date | null;

  @Column("integer", { name: "popularity", nullable: true })
  popularity?: number | null;

  @Column("character varying", { name: "uri" })
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

  @ManyToMany(type => Genre)
  @JoinTable({
      name: "albums_genres",
      joinColumn: {
        name: "album_id",
        referencedColumnName: "id"
      },
      inverseJoinColumn: {
        name: "genre_id",
        referencedColumnName: "id"
      }
  })
  genres!: Genre[];

  @OneToMany(() => Track, (tracks) => tracks.album)
  tracks!: Track[];
}

export type IAlbum = InstanceType<typeof Album>;
