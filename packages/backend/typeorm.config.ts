import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Track } from 'src/entities/track.entity';
import { CreateTracksTable1717877381152 } from 'src/migrations/1717877381152-CreateTracksTable';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'sqlite',
  database: configService.get('DB_PATH'),
  entities: [Track],
  migrations: [CreateTracksTable1717877381152],
});
