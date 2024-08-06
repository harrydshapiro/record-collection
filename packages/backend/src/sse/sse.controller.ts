import { Controller, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SSEController {
  constructor(private readonly sseService: SseService) {}

  @Sse('stream')
  sseStream(): Observable<string> {
    return this.sseService.initStream();
  }
}
