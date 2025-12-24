import { MPC, Song } from "mpc-js";
import { Subject, Subscription } from "rxjs";
import { MpdSubsystem } from "../types/mpc";
import {
  AlbumId,
  GetAlbumsReturnType,
  SoundSystemUpdate,
  SoundSystemUpdates,
} from "../types/api-contract";
import {
  generateAlbumCoverArtUrl,
  generateAlbumId,
  parseAlbumId,
} from "./library.helpers";
import { memoize } from "lodash";
import { readThroughWithBackgroundRefresh } from "./cache.service";

class _MpcService {
  mpc!: MPC;
  private $stateStream = new Subject<SoundSystemUpdates>();

  constructor({ host, port }: { host: string; port: number }) {
    if (!port) {
      throw new Error("No MPD port MPC to connect to");
    }
    this.initMpc(host, port).catch((err) => {
      console.error("Error initializing MPD client");
      console.error(err);
    });
  }

  private async initMpc(host: string, port: number) {
    this.mpc = new MPC();
    this.attachConnectionEventListeners();
    this.attachMpdStateListener();
    await this.mpc.connectTCP(host, port);
  }

  private attachConnectionEventListeners() {
    this.mpc.on("socket-error", (e: unknown) => {
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
            break;
        }
      });
    });
  }

  async handlePlayerChanged() {
    await this.sendPlayerStateToStream();
    // This is stupid - but....
    // When the current song changes, there is no MPC event emitted for the playlist changing, which means we don't tell the UI
    // about the new currentIndex
    await this.sendQueueStateToStream();
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
    let currentSong = await this.mpc.status.currentSong();
    if (!currentSong || Object.keys(currentSong).length === 0) {
      currentSong = (await this.mpc.currentPlaylist.playlistInfo())?.[0];
    }
    return {
      type: "player",
      payload: {
        currentSong,
        status: await this.mpc.status.status(),
      },
    };
  }

  play() {
    return this.mpc.playback.play();
  }

  async pause() {
    return this.mpc.playback.pause();
  }

  async next() {
    try {
      if ((await this.mpc.status.status()).state !== "play") {
        await this.mpc.playback.play();
      }
      return await this.mpc.playback.next();
    } catch (err) {
      console.error("Error playing next song", err);
    }
  }

  async previous() {
    try {
      if ((await this.mpc.status.status()).state !== "play") {
        await this.mpc.playback.play();
      }
      return await this.mpc.playback.previous();
    } catch (err) {
      console.error("Error playing previous song", err);
    }
  }

  async addTrackToQueue(trackId: string) {
    await this.mpc.currentPlaylist.addId(trackId);
    return this.getQueueState();
  }

  async addAlbumToQueue(albumId: AlbumId) {
    const { albumName, albumArtistName } = parseAlbumId(albumId);
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

  getAlbums = () =>
    readThroughWithBackgroundRefresh<GetAlbumsReturnType>({
      cacheKey: "getAlbumsResponse",
      dataFetchCb: async () => {
        console.log('fetching new results')
        const groupedAlbumTags = await this.mpc.database.list(
          "Album",
          [],
          ["AlbumArtist"],
        );

        const albums: GetAlbumsReturnType = [];

        for (const entry of groupedAlbumTags) {
          const [[albumArtist], albumNames] = entry;
          if (!albumArtist) {
            continue;
          }
          for (const albumName of albumNames) {
            if (!albumName) {
              continue;
            }
            const albumId = generateAlbumId({
              albumName,
              artistName: albumArtist,
            });
            albums.push({
              albumArtist,
              albumName,
              albumId,
              albumCoverArtUrl: generateAlbumCoverArtUrl({
                albumId,
              }),
              albumAddedAt: await this.getAlbumAddedToLibraryEpoch({ albumId }),
            });
          }
        }

        return albums;
      },
    });

  getTracksForAlbum = memoize(async ({ albumId }: { albumId: AlbumId }) => {
    const { albumName, albumArtistName } = parseAlbumId(albumId);
    return await this.mpc.database.find([
      ["Album", albumName],
      ["AlbumArtist", albumArtistName],
    ]);
  });

  async getAlbumAddedToLibraryEpoch({ albumId }: { albumId: AlbumId }) {
    let tracks: Song[];
    try {
      tracks = await this.getTracksForAlbum({ albumId });
    } catch (err) {
      return -1;
    }
    const dateAdded = tracks.reduce<number>((dateAdded, track) => {
      const trackLastModified = track.lastModified?.getTime() || 0;
      return trackLastModified > dateAdded
        ? track.lastModified!.getTime()
        : dateAdded;
    }, 0);
    return dateAdded;
  }

  update() {
    this.getTracksForAlbum.cache.clear?.();
    return this.mpc.database.update();
  }

  removeItemsFromQueue(songIdsToDelete: number[]) {
    return Promise.all(
      songIdsToDelete.map((id) => this.mpc.currentPlaylist.deleteId(id)),
    );
  }
}

export const MpcService = new _MpcService({
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.MPD_PORT || "6600"),
});
