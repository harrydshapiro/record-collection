import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { AuditableEntity } from "./AuditableEntity";
import { SubmittedTrack } from "./SubmittedTrack";

@Entity("tracks", { schema: "public" })
export class Track extends AuditableEntity<Track> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("character varying", { name: "uri" })
  uri!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("integer", { name: "duration_ms" })
  durationMs?: number ;

  @Column("integer", { name: "track_number" })
  trackNumber?: number ;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: "artists_tracks",
    joinColumn: {
      name: "track_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "artist_id",
      referencedColumnName: "id",
    },
  })
  artists!: Artist[];

  @ManyToOne(() => Album, (albums) => albums.tracks)
  @JoinColumn([{ name: "album_id", referencedColumnName: "id" }])
  album!: Album;

  @OneToMany(() => SubmittedTrack, (submittedTrack) => submittedTrack.track)
  submissions!: SubmittedTrack[];

  @Column("numeric")
  acousticness!: number;

  @Column("numeric")
  energy!: number;

  @Column("numeric")
  danceability!: number;

  @Column("numeric")
  key!: number;

  @Column("numeric")
  liveness!: number;

  @Column("numeric")
  loudness!: number;

  @Column("numeric")
  mode!: number;

  @Column("numeric")
  speechiness!: number;

  @Column("numeric")
  tempo!: number;

  @Column("numeric", { name: "time_signature" })
  timeSignature!: number;

  @Column("numeric")
  valence!: number;
}

export type ITrack = InstanceType<typeof Track>;
