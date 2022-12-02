import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { SubmissionRequest } from './SubmissionRequest';
import { User } from './User';

@Entity()
export class Message {
    @PrimaryColumn('int4')
    id!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Column('varchar', { nullable: false })
    body!: string;

    @ManyToOne(() => SubmissionRequest, (submissionRequest) => submissionRequest.messages)
    @JoinColumn()
    submissionRequest?: SubmissionRequest;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn()
    user!: User;
}

export type IMessage = InstanceType<typeof Message>
