import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  getArtists(): string[] {
    // Logic to fetch artists from the music database
    return ['Artist 1', 'Artist 2', 'Artist 3'];
  }

  getAlbums(): string[] {
    // Logic to fetch albums by the given artist from the music database
    return ['Album 1', 'Album 2', 'Album 3'];
  }

  getTracks(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  syncMusicDatabase(): void {
    // Logic to sync the music database with an external source
    console.log('Syncing music database...');
  }
}
