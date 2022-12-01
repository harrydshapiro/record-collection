import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Message } from './Message';
import { Playlist } from './Playlist';

@Entity()
export class User {
    @Column('varchar', { nullable: false })
    firstName!: string;

    @Column('varchar', { nullable: false })
    lastName!: string;

    @Column('varchar', { nullable: false })
    spotifyUri!: string;

    @Column('varchar', { nullable: false })
    phoneNumber!: string;

    @Column('boolean', { default: false })
    active!: boolean;

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToMany(() => Message, (message) => message.user)
    messages!: Array<Message>;

    @OneToOne(() => Playlist, (playlist) => playlist.user)
    @JoinColumn()
    personalPlaylist!: Playlist;
}

export type IUser = InstanceType<typeof User>
