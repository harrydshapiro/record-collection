import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { Album } from "./Album";
import { Artist } from "./Artist";

@Entity("genres", { schema: "public" })
export class Genre {
  @Column("character varying", { name: "name" })
  name!: string;

  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id!: string;

  @ManyToMany(type => Genre)
  @JoinTable({
      name: "albums_genres",
      joinColumn: {
        name: "genres",
        referencedColumnName: "id"
      },
      inverseJoinColumn: {
        name: "albums",
        referencedColumnName: "id"
      }
  })
  albums!: Album[];

  @ManyToMany(type => Genre)
  @JoinTable({
      name: "artists_genres",
      joinColumn: {
        name: "genre_id",
        referencedColumnName: "id"
      },
      inverseJoinColumn: {
        name: "artist_id",
        referencedColumnName: "id"
      }
  })
  artists!: Artist[];
}

export type IGenre = InstanceType<typeof Genre>;
