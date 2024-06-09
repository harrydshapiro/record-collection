import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LibraryModule } from './library/library.module';
import { PlayerModule } from './player/player.module';
import { CreateTracksTable1717877381152 } from './migrations/1717877381152-CreateTracksTable';
import { DataSource } from 'typeorm';
import { Track } from './entities/track.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get('DB_PATH'),
        autoLoadEntities: true,
        entities: [Track],
        migrations: [CreateTracksTable1717877381152],
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    LibraryModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
