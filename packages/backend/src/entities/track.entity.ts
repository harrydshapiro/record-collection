import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tracks',
})
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'relative_file_path' })
  relativeFilePath: string;
}
