import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./Message";
import { Playlist } from "./Playlist";
import { Omit } from "utils/helpers";
import { AuditableEntity } from "./AuditableEntity";
import { SubmittedTrack } from "./SubmittedTrack";

@Entity("submission_requests", { schema: "public" })
export class SubmissionRequest extends AuditableEntity<SubmissionRequest> {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "request_text" })
  requestText!: string;

  @Column("timestamp without time zone", {
    name: "requested_at",
    nullable: true,
  })
  requestedAt?: Date | null;

  @Column("timestamp without time zone", {
    name: "scheduled_for",
    nullable: true,
  })
  scheduledFor?: Date | null;

  @Column("character varying", {
    name: "submission_response",
    nullable: true,
    default: () => "''",
  })
  submissionResponse?: string | null;

  @Column("boolean", { name: "is_active", default: () => "false" })
  isActive!: boolean;

  @Column("character varying", { name: "type", default: () => "'playlist'" })
  type!: string;

  @Column("character varying", { name: "media_url", nullable: true })
  mediaUrl?: string | null;

  @OneToMany(() => Message, (messages) => messages.submissionRequest)
  messages!: Message[];

  @ManyToOne(() => Playlist, (playlists) => playlists.submissionRequests)
  @JoinColumn([{ name: "playlist_id", referencedColumnName: "id" }])
  playlist!: Playlist;

  @OneToMany(() => SubmittedTrack, (submittedTrack) => submittedTrack.track)
  submissions!: SubmittedTrack[]
}

export type ISubmissionRequest = InstanceType<typeof SubmissionRequest>;
