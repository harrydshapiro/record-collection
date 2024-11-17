import { Controller, Get, Query } from '@nestjs/common';
import { LibraryService } from './library.service';
import { Song } from 'mpc-js';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('albums')
  getAllAlbums(): Promise<
    Array<{
      albumName: string;
      albumArtistName: string;
    }>
  > {
    return this.libraryService.getAlbums();
  }

  @Get('album')
  getAlbum(
    @Query('albumName') albumName: string,
    @Query('albumArtistName') albumArtistName: string,
  ): Promise<{
    albumName: string;
    albumArtistName: string;
    songs: Song[];
  }> {
    return this.libraryService.getAlbum(albumName, albumArtistName);
  }
}
