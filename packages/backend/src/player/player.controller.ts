import { Controller, Post, Patch, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('play/:trackId')
  play(@Param('trackId') trackId: string) {
    return this.playerService.play(parseInt(trackId));
  }

  @Post('pause')
  pause() {
    return this.playerService.pause();
  }

  @Post('skip')
  skip() {
    return this.playerService.skip();
  }

  @Patch('volume/up')
  volumeUp() {
    return this.playerService.volumeUp();
  }

  @Patch('volume/down')
  volumeDown() {
    return this.playerService.volumeDown();
  }

  @Post('queue')
  addToQueue() {
    return this.playerService.addToQueue();
  }

  @Get('queue')
  getQueue() {
    return this.playerService.getQueue();
  }
}
