import { MPC, Song } from "mpc-js";
import { Subject, Subscription } from "rxjs";
import { MpdSubsystem } from "../types/mpc";
import {
  AlbumId,
  GetAlbumsReturnType,
  SoundSystemUpdate,
  SoundSystemUpdates,
} from "../types/api-contract";

class _MpcService {
  mpc!: MPC;
  private $stateStream = new Subject<SoundSystemUpdates>();

  constructor({ port }: { port: number }) {
    if (!port) {
      throw new Error("No MPD port MPC to connect to");
    }
    this.initMpc(port).catch((err) => {
      console.error("Error initializing MPD client");
      console.error(err);
    });
  }

  private async initMpc(port: number) {
    this.mpc = new MPC();
    this.attachConnectionEventListeners();
    this.attachMpdStateListener();
    await this.mpc.connectTCP("0.0.0.0", port);
  }

  private attachConnectionEventListeners() {
    this.mpc.on("socket-error", (e) => {
      console.error("MPC socket error", e);
    });
    this.mpc.on("socket-end", () => {
      console.log("Socket closed by MPD");
    });
    this.mpc.on("ready", () => {
      console.log("MPD connection established");
    });
  }

  async addStateStreamSubscriber(
    stateStreamSubscribeFn: Subject<SoundSystemUpdates>["next"],
  ): Promise<Subscription> {
    // Send current state so that UI has proper info on page load
    // Arguably should be a different route - stream open/clsoe != page load, maybe
    // diff data is needed on page load than SSE ...
    // Doing it this way bc I'm lazy and it's simplest for the current implementation.
    stateStreamSubscribeFn(await this.getCurrentPlayerState());
    stateStreamSubscribeFn(await this.getQueueState());
    return this.$stateStream.subscribe({ next: stateStreamSubscribeFn });
  }

  /**
   * Attaches listeners for every event emitted by MPC
   * Handlers should not modify state further - they will be run in parallel with no ordering guarantee
   * Further state modifications should depend on user action
   */
  attachMpdStateListener() {
    this.mpc.on("changed", (subsystemsChanged: MpdSubsystem[]) => {
      subsystemsChanged.forEach((subsystem) => {
        switch (subsystem) {
          case "player":
            void this.handlePlayerChanged();
            break;
          case "playlist":
            void this.handlePlaylistChanged();
            break;
          default:
            console.log("subsystem changed:", subsystem);
        }
      });
    });
  }

  async handlePlayerChanged() {
    await this.sendPlayerStateToStream();
  }

  async handlePlaylistChanged() {
    await this.sendQueueStateToStream();
  }

  async sendPlayerStateToStream() {
    this.$stateStream.next(await this.getCurrentPlayerState());
  }

  async sendQueueStateToStream() {
    this.$stateStream.next(await this.getQueueState());
  }

  async getCurrentPlayerState(): Promise<SoundSystemUpdate<"player">> {
    return {
      type: "player",
      payload: {
        currentSong: await this.mpc.status.currentSong(),
        status: await this.mpc.status.status(),
      },
    };
  }

  play() {
    return this.mpc.playback.play();
  }

  pause() {
    return this.mpc.playback.pause();
  }

  next() {
    return this.mpc.playback.next();
  }

  previous() {
    return this.mpc.playback.previous();
  }

  async addTrackToQueue(trackId: string) {
    await this.mpc.currentPlaylist.addId(trackId);
    return this.getQueueState();
  }

  async addAlbumToQueue(albumId: AlbumId) {
    const { albumName, albumArtistName } = this.parseAlbumId(albumId);
    console.log({ albumArtistName, albumName });
    await this.mpc.database.findAdd(
      [
        ["album", albumName],
        ["albumartist", albumArtistName],
      ],
      undefined,
      undefined,
      "track",
    );
    return await this.getQueue();
  }

  async getQueueState(): Promise<SoundSystemUpdate<"queue">> {
    return {
      type: "queue",
      payload: await this.getQueue(),
    };
  }

  async getQueue() {
    return {
      fullQueue: await this.mpc.currentPlaylist.playlistInfo(),
      currentIndex: (await this.mpc.status.status()).song,
    };
  }

  async getAlbums(): Promise<GetAlbumsReturnType> {
    const [uniqueAlbumNames] = Array.from(
      (await this.mpc.database.list("album")).values(),
    );
    const processedAlbums: Record<string, GetAlbumsReturnType[0]> = {};
    for (const albumName of uniqueAlbumNames) {
      const filter = `(album == "${albumName}")`;
      const tracks = await this.mpc.database.find(filter);
      const prettyAlbumName = albumName || "Unknown Album";
      for (const track of tracks) {
        const fullTrack = (
          await this.mpc.database.listAllInfo(track.path)
        )[0] as Song;
        const prettyArtistName =
          track.albumArtist || track.artist || "Unknown Artist";
        const albumEntryKey: AlbumId = this.generateAlbumId({
          albumName,
          artistName: prettyArtistName,
        });
        if (!processedAlbums[albumEntryKey]) {
          processedAlbums[albumEntryKey] = {
            albumId: albumEntryKey,
            albumName: prettyAlbumName,
            albumArtist: prettyArtistName,
            tracks: [],
          };
        }
        processedAlbums[albumEntryKey].tracks.push(fullTrack);
      }
    }
    return Object.values(processedAlbums);
  }

  private generateAlbumId({
    albumName,
    artistName,
  }: {
    artistName?: string;
    albumName?: string;
  }): AlbumId {
    const albumIdDelimiter = "#";
    const prettyArtistName =
      artistName?.replace(albumIdDelimiter, "") || "unknown";
    const prettyAlbumName =
      albumName?.replace(albumIdDelimiter, "") || "unknown";
    return `album#${prettyAlbumName}#artist#${prettyArtistName}`;
  }

  private parseAlbumId(albumId: AlbumId): {
    albumName: string;
    albumArtistName: string;
  } {
    const albumIdParts = albumId.split("#");
    return {
      albumName: albumIdParts[1],
      albumArtistName: albumIdParts[3],
    };
  }

  update() {
    return this.mpc.database.update();
  }
}

export const MpcService = new _MpcService({
  port: parseInt(process.env.MPD_PORT || "6600"),
});
