import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Album } from "./Album";
import { Artist } from "./Artist";

@Entity("tracks", { schema: "public" })
export class Track {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id!: string;

  @Column("character varying", { name: "uri" })
  ur!: string;

  @Column("integer", { name: "duration_ms", nullable: true })
  durationMs?: number | null;

  @Column("integer", { name: "popularity", nullable: true })
  popularity?: number | null;

  @Column("integer", { name: "track_number", nullable: true })
  trackNumber?: number | null;

  @ManyToMany(type => Artist)
  @JoinTable({
      name: "artists_tracks",
      joinColumn: {
        name: "track_id",
        referencedColumnName: "id"
      },
      inverseJoinColumn: {
        name: "artist_id",
        referencedColumnName: "id"
      }
  })
  artists!: Artist[];

  @ManyToOne(() => Album, (albums) => albums.tracks)
  @JoinColumn([{ name: "album_id", referencedColumnName: "id" }])
  album!: Album;
}

export type ITrack = InstanceType<typeof Track>;
