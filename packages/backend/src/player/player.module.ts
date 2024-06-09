import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
