import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MPC, Song } from 'mpc-js';
import { SortedArray } from 'src/utils/generic';

@Injectable()
export class LibraryService {
  private mpc!: MPC;

  constructor(private readonly configService: ConfigService) {
    this.mpc = new MPC();
  }

  protected async onModuleInit() {
    try {
      await this.mpc.connectTCP(
        this.configService.get('MPD_HOST'),
        this.configService.get('MPD_PORT'),
      );
    } catch (err) {
      console.error('Error connecting to MPD', { err });
    }
  }

  async getAlbums(): Promise<
    Array<{
      albumName: string;
      albumArtistName: string;
    }>
  > {
    const command = 'list album group albumartist';
    const queryOutput = await this.mpc.sendCommand(command);
    const response = new SortedArray<{
      albumName: string;
      albumArtistName: string;
    }>((a, b) => {
      if (a.albumArtistName === b.albumArtistName) {
        return a.albumName > b.albumName ? 1 : -1;
      }
      return a.albumArtistName > b.albumArtistName ? 1 : -1;
    });
    let mostRecentArtist = '';
    queryOutput.forEach((queryOutputLine: string) => {
      const queryOutputTagValueDelimiter = ': ';
      const [tagType, ...rest] = queryOutputLine.split(
        queryOutputTagValueDelimiter,
      );
      const tagValue = rest.join(queryOutputTagValueDelimiter);
      if (!tagType || !tagValue) {
        return;
      }
      if (tagType === 'AlbumArtist') {
        mostRecentArtist = tagValue;
      } else if (tagType === 'Album') {
        response.push({
          albumArtistName: mostRecentArtist,
          albumName: tagValue,
        });
      } else {
        console.warn(
          `Found unrecognized tag type when parsing result from mpd command. Command: ${command}. Tag type: ${tagType}.`,
        );
      }
    });
    return response;
  }

  async getAlbum(
    albumName: string,
    albumArtistName: string,
  ): Promise<{
    albumName: string;
    albumArtistName: string;
    songs: Array<Song>;
  }> {
    const songs = await this.mpc.database.find([
      ['ALBUM', albumName],
      ['ALBUMARTIST', albumArtistName],
    ]);
    return {
      albumArtistName,
      albumName,
      songs,
    };
  }
}
