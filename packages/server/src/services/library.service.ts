import { AlbumId } from "src/types/api-contract";
import { getLocalAlbumArtPath } from "./library.helpers";
import { createReadStream, ReadStream } from "fs";

/**
 * Intended for interacting with the library (i.e. fetching album art)
 * This is a business-logic-heavy service that should probably only be called by controllers
 * It should delegate to lower-level services like MPCService when appropriate
 */
class _LibraryService {
  constructor() {}

  /**
   * Given an AlbumId, fetches its local cover art and returns it as a stream
   * Maybe in the future we can use an 3rd party API for fetching it, but for now
   * I'll just force the user to download and store it themselves.
   */
  async getAlbumCoverArt({
    albumId,
  }: {
    albumId: AlbumId;
  }): Promise<ReadStream | void> {
    const localAlbumArtPath = await getLocalAlbumArtPath(albumId);
    console.log("localAlbumArtPath", localAlbumArtPath);
    if (localAlbumArtPath) {
      return createReadStream(localAlbumArtPath);
    }
  }
}

export const LibraryService = new _LibraryService();
