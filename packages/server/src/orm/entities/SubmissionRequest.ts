import { Column, Entity, getRepository, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { Message } from './Message';
import { Playlist } from './Playlist';

@Entity()
export class SubmissionRequest {
    @Column('varchar', { nullable: false })
    requestText!: string;

    @ManyToOne(() => Playlist, (playlist) => playlist.submissionRequests)
    @JoinColumn()
    playlist!: Playlist;

    @Column('timestamp', { nullable: true })
    requestedAt?: Date;

    @Column('timestamp', { nullable: false })
    scheduledFor!: Date;

    @Column('varchar', { nullable: true })
    submissionResponse?: string;

    @Column('boolean', { default: false })
    isActive!: boolean;

    @PrimaryColumn('int4')
    id!: number;

    @Column('varchar', { nullable: false })
    type!: 'playlist' | 'prompt';

    @OneToMany(() => Message, (message) => message.submissionRequest)
    messages!: Array<Message>;

    @Column("varchar", { nullable: true })
    mediaUrl?: string
}
