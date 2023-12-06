import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuditableEntity } from "./AuditableEntity";
import { Track } from "./Track";
import { User } from "./User";
import { SubmissionRequest } from "./SubmissionRequest";

@Entity("submitted_tracks", { schema: "public" })
export class SubmittedTrack extends AuditableEntity<SubmittedTrack> {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Track, (track) => track.submissions)
  @JoinColumn([{ name: "track_id", referencedColumnName: "id" }])
  track!: Track;

  @ManyToOne(() => User, (user) => user.trackSubmissions)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: User;

  @ManyToOne(
    () => SubmissionRequest,
    (submissionRequest) => submissionRequest.submissions,
  )
  @JoinColumn([{ name: "submission_request_id", referencedColumnName: "id" }])
  submissionRequest!: SubmissionRequest;

  @Column("timestamp", { name: "submitted_at" })
  submittedAt!: Date;

  @Column("integer", { name: "popularity_at_submission_time" })
  popularityAtSubmissionTime!: number;
}

export type ISubmittedTrack = InstanceType<typeof SubmittedTrack>;
