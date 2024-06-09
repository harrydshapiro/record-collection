import { Controller, Get, Post } from '@nestjs/common';
import { LibraryService } from './library.service';
import { Track } from 'src/entities/track.entity';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('albums')
  async getAlbums() {
    return this.libraryService.getAlbums();
  }

  @Get('artists')
  async getArtists() {
    return this.libraryService.getArtists();
  }

  @Get('tracks')
  async getTracks(): Promise<Track[]> {
    return this.libraryService.getTracks();
  }

  @Post('resync')
  async resyncLibrary() {
    return this.libraryService.syncMusicDatabase();
  }
}
