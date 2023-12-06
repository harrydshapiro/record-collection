import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./Message";
import { Playlist } from "./Playlist";
import { AuditableEntity } from "./AuditableEntity";
import { SubmittedTrack } from "./SubmittedTrack";

@Entity("users", { schema: "public" })
export class User extends AuditableEntity<User> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("character varying", { name: "first_name" })
  firstName!: string;

  @Column("character varying", { name: "last_name" })
  lastName!: string;

  @Column("character varying", { name: "spotify_uri" })
  spotifyUri!: string;

  @Column("character varying", { name: "phone_number" })
  phoneNumber!: string;

  @Column("boolean", { name: "active", default: () => "false" })
  active!: boolean;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt!: Date;

  @Column("character varying", { name: "reference", nullable: true })
  reference?: string | null;

  @OneToMany(() => Message, (messages) => messages.user)
  messages!: Message[];

  @OneToOne(() => Playlist, (playlists) => playlists.users)
  @JoinColumn([{ name: "personal_playlist_id", referencedColumnName: "id" }])
  personalPlaylist!: Playlist;

  @OneToMany(() => SubmittedTrack, (submittedTrack) => submittedTrack.track)
  trackSubmissions!: SubmittedTrack[];
}

export type IUser = InstanceType<typeof User>;
