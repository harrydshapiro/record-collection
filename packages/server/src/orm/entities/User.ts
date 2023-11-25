import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Message } from "./Message";
import { Playlist } from "./Playlist";

@Entity("users", { schema: "public" })
export class User {
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

  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id!: string;

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
}

export type IUser = InstanceType<typeof User>;
