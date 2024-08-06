import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { ConfigModule } from '@nestjs/config';
import { LibraryModule } from './library/library.module';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    LibraryModule,
    PlayerModule,
    SseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
