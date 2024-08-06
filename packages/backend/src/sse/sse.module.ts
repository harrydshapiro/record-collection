import { Module } from '@nestjs/common';
import { PlayerModule } from 'src/player/player.module';
import { SSEController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [PlayerModule],
  controllers: [SSEController],
  providers: [SseService],
})
export class SseModule {}
