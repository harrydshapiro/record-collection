import { Injectable } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { PlayerService } from 'src/player/player.service';
import { EventEmitter } from 'node:events';

@Injectable()
export class SseService {
  constructor(private readonly playerService: PlayerService) {}

  initStream() {
    const eventEmitter = new EventEmitter();
    this.playerService.attachPlayerChangeListener((payload) => {
      eventEmitter.emit('player-state-change', JSON.stringify(payload));
    });
    return fromEvent(eventEmitter, 'player-state-change') as Observable<string>;
  }
}
