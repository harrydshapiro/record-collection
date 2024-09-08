import { MPC, PlaylistItem, Song, Status } from "mpc-js";
import { Subject, Subscription } from "rxjs";

/**
 * database - the song database has been modified after update
 *
 * update - a database update has started or finished; if the database was modified during the update, the database event is also emitted
 *
 * stored_playlist - a stored playlist has been modified, renamed, created or deleted
 *
 * playlist - the current playlist has been modified
 *
 * player - the player has been started, stopped or seeked
 *
 * mixer - the volume has been changed
 *
 * output - an audio output has been enabled or disabled
 *
 * options - options like repeat, random, crossfade, replay gain
 *
 * sticker - the sticker database has been modified
 *
 * subscription - a client has subscribed or unsubscribed to a channel
 *
 * message - a message was received on a channel this client is subscribed to; this event is only emitted when the queue is empty
 */
type MpdSubsystem =
  | "database"
  | "update"
  | "stored_playlist"
  | "playlist"
  | "player"
  | "mixer"
  | "output"
  | "options"
  | "sticker"
  | "subscription"
  | "message";

type MpdSubsytemChangedUpdate = {
  type: "player";
  payload: {
    currentSong: PlaylistItem;
    status: Status;
  };
};

export type GetAlbumsReturnType = Array<{
  albumName: string;
  albumArtist: string;
  tracks: Song[];
}>;

type MPC2 = MPC;

class _MpcService {
  mpc!: MPC2;
  private $stateStream = new Subject<MpdSubsytemChangedUpdate>();

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
    stateStreamSubscribeFn: Subject<MpdSubsytemChangedUpdate>["next"],
  ): Promise<Subscription> {
    // Send current state so that UI has proper info on page load
    // Arguably should be a different route - stream open/clsoe != page load, maybe
    // diff data is needed on page load than SSE ...
    // Doing it this way bc I'm lazy and it's simplest for the current implementation.
    stateStreamSubscribeFn(await this.getCurrentPlayerState());
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
          default:
            console.log("subsystem changed:", subsystem);
        }
      });
    });
  }

  async handlePlayerChanged() {
    await this.sendPlayerStateToStream();
  }

  async sendPlayerStateToStream() {
    this.$stateStream.next(await this.getCurrentPlayerState());
  }

  async getCurrentPlayerState(): Promise<MpdSubsytemChangedUpdate> {
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
    return this.getQueue();
  }

  async addAlbumToQueue(albumId: string) {
    await this.mpc.currentPlaylist.add(albumId);
    return this.getQueue();
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
    const processedAlbums: Record<
      string,
      { albumName: string; albumArtist: string; tracks: Song[] }
    > = {};
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
        const albumEntryKey = `${prettyArtistName}_${prettyAlbumName}`;
        if (!processedAlbums[albumEntryKey]) {
          processedAlbums[albumEntryKey] = {
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

  update() {
    return this.mpc.database.update();
  }
}

export const MpcService = new _MpcService({
  port: parseInt(process.env.MPD_PORT || "6600"),
});
