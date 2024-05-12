import { createWriteStream, readFileSync, writeFileSync } from "fs";
import path from "path";
import { MpcService } from "./mpc.service";

class LibraryCache {
  libraryCachePath!: string;

  constructor ({ libraryCachePath }: { libraryCachePath: string }) {
    this.libraryCachePath = libraryCachePath;
    // this.refreshCache()
  }

  getCache() {
    const buffer = readFileSync(this.libraryCachePath)
    const cacheData = JSON.parse(buffer.toString())
    return cacheData
  }

  async refreshCache () {
    const newCacheData = {
      albums: await MpcService.getAlbums()
    }
    await this.updateCache(JSON.stringify(newCacheData))
  }

  private updateCache (newCacheData: string) {
    return writeFileSync(this.libraryCachePath, newCacheData, { flag: 'w' })
  }
}

export const libraryCache = new LibraryCache({ libraryCachePath: process.env.LIBRARY_CACHE_PATH || path.join(__dirname, 'library-cache.json') })