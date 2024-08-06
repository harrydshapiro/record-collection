import { Controller, Post, Body } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('pause')
  pausePlayback() {
    this.playerService.stopPlayback();
  }

  @Post('play')
  startPlayback(@Body() playConfig: { id?: string }) {
    this.playerService.play(playConfig.id);
  }
}
