import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
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

  @OneToMany(() => SubmittedTrack, (submittedTrack) => submittedTrack.track)
  submissions!: SubmittedTrack[]
}

export type ITrack = InstanceType<typeof Track>;
