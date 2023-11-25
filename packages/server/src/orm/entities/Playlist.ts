import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubmissionRequest } from "./SubmissionRequest";
import { User } from "./User";

@Entity("playlists", { schema: "public" })
export class Playlist {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "uri" })
  uri!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @OneToMany(
    () => SubmissionRequest,
    (submissionRequests) => submissionRequests.playlist
  )
  submissionRequests!: SubmissionRequest[];

  @OneToMany(() => User, (users) => users.personalPlaylist)
  users!: User[];
}

export type IPlaylist = InstanceType<typeof Playlist>;
