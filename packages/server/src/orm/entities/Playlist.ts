import { Column, Entity, getRepository, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { SubmissionRequest } from './SubmissionRequest';
import { User } from './User';

@Entity()
export class Playlist {
    @PrimaryColumn('int4')
    id!: number;

    @Column('varchar', { nullable: false })
    uri!: string;

    @Column('varchar', { nullable: false })
    name!: string;

    @OneToMany(() => SubmissionRequest, (submissionRequest) => submissionRequest.playlist)
    submissionRequests!: Array<SubmissionRequest>;

    @OneToOne(() => User, (user) => user.personalPlaylist)
    user?: User;
}

export type IPlaylist = InstanceType<typeof Playlist>