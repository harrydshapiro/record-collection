import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubmissionRequest } from "./SubmissionRequest";
import { User } from "./User";

@Entity("messages", { schema: "public" })
export class Message {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt!: Date;

  @Column("character varying", { name: "body", default: () => "''" })
  body!: string;

  @ManyToOne(
    () => SubmissionRequest,
    (submissionRequests) => submissionRequests.messages
  )
  @JoinColumn([{ name: "submission_request_id", referencedColumnName: "id" }])
  submissionRequest!: SubmissionRequest;

  @ManyToOne(() => User, (users) => users.messages)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: User;
}

export type IMessage = InstanceType<typeof Message>;
