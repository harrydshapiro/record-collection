import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MPC } from 'mpc-js';

export type Album = {
  /**
   * <albumArtistId1,albumArtistId2>#<albumName>
   */
  id: string;
  /**
   * List of ids of artists who own the entire album. Not just featured on a given song - like the Alison Kraus / Robert Plant album
   */
  albumArtistIds: string[];
  albumName: string;
  tracksIds: string[];
};

export type Artist = {
  id: string;
  artistName: string;
  /**
   * ID suffix increases serially
   * <artistName>#0
   */
};

export type Track = {
  /**
   * <trackName>#>albumId>#<artistId1,artistId2>
   */
  id: string;
  trackName: string;
  albumId: string;
  artistIds: string[];
  duration: number;
};

type MPCStateChanges = {
  player: {
    trackId: Track['id'];
    isPlaying: boolean;
    volume: number;
  };
  queue: Track['id'][];
};

// TODO: Make this generic so that we can type the currentState field
type OnMpcChangedCallback = (
  payload: Partial<MPCStateChanges>,
) => void | Promise<void>;

@Injectable()
export class PlayerService {
  private mpc!: MPC;

  constructor(private readonly configService: ConfigService) {
    this.mpc = new MPC();
  }

  protected async onModuleInit() {
    await this.initMpcConnection();
    this.attachPlayerChangeListener(console.log);
  }

  /**
   * Handler for any play-related actions (specific album, artist, or currently paused track)
   *
   * @param uri Path relative to the MPD library. Can be a song or directory. If a directory, songs within it are added recursively. If not provided, currently queued song is played (if it exists and is paused).
   */
  async play(uri?: string): Promise<void> {
    if (!uri) {
      this.mpc.playback.pause(false);
    }
    // If no URI, resume playback
    // If URI, check if current track. If so, resume playback
    // Else, insert track(s) at front of queue. If playing, go to next song (aka the new ones we added). If not playing, go to next song and play then.
  }

  async stopPlayback(): Promise<void> {
    await this.mpc.playback.pause(true);
  }

  private async initMpcConnection() {
    try {
      await this.mpc.connectTCP(
        this.configService.get('MPD_HOST'),
        this.configService.get('MPD_PORT'),
      );
    } catch (err) {
      console.error('Error connecting to MPD', { err });
    }
  }

  attachPlayerChangeListener(onMpcChanged: OnMpcChangedCallback) {
    const handler = this.getHandlerForAttachPlayerChangeListener(onMpcChanged);
    const listener = this.mpc.on('changed', handler);
    return {
      removeListener: () => listener.removeListener('changed', handler),
    };
  }

  private getHandlerForAttachPlayerChangeListener(
    onMpcChanged: OnMpcChangedCallback,
  ) {
    return async (subSystemsChanged: string[]) => {
      for (const subsystem of subSystemsChanged) {
        if (subsystem === 'player') {
          this.handlePlayerSystemChanged(onMpcChanged);
        }
      }
    };
  }

  private async handlePlayerSystemChanged(onMpcChanged: OnMpcChangedCallback) {
    const currentState = await this.mpc.status.status();
    console.log(currentState, await this.mpc.currentPlaylist.playlistInfo());
    const parsedState: MPCStateChanges['player'] = {
      trackId: currentState.songId + '',
      volume: currentState.volume,
      isPlaying: currentState.state === 'play',
    };
    onMpcChanged({ player: parsedState });
  }
}
