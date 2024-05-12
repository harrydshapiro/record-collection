import { MPC } from "mpc-js";

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
    await this.mpc.connectTCP("localhost", port);
  }

  play() {
    return this.mpc.playback.play();
  }

  pause() {
    return this.mpc.playback.pause();
  }

  next() {
    return this.mpc.playback.next()
  }

  previous() {
    return this.mpc.playback.previous()
  }

  async addTrackToQueue(trackId: string) {
    await this.mpc.currentPlaylist.addId(trackId)
    return this.getQueue()
  }
  
  async addAlbumToQueue(albumId: string) {
    await this.mpc.currentPlaylist.add(albumId)
    return this.getQueue()
  }

  async getQueue() {
    return {
      fullQueue: await this.mpc.currentPlaylist.playlistInfo(),
      currentIndex: (await this.mpc.status.status()).song
    }
  }
  
  async getAlbums () {
    const result = await this.mpc.database.find()
    console.log('keys are', Array.from(result.values()))
    return Object.fromEntries(result)
  }
}

export const MpcService = new _MpcService({
  port: parseInt(process.env.MPD_PORT || '6600'),
});
