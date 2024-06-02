import { MPC, Song } from "mpc-js";

export type GetAlbumsReturnType = Array<{
  albumName: string;
  albumArtist: string;
  tracks: Song[];
}>;

class _MpcService {
  mpc!: MPC;

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
    await this.mpc.connectTCP("0.0.0.0", port);
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
