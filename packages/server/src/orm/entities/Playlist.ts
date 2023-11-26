import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubmissionRequest } from "./SubmissionRequest";
import { User } from "./User";
import { AuditableEntity } from "./AuditableEntity";

@Entity("playlists", { schema: "public" })
export class Playlist extends AuditableEntity<Playlist> {
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
