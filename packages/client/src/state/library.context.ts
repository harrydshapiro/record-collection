import { Song } from "mpc-js";
import { createContext } from "react";

type LibraryState = {
  albums: Array<{
    albumName: string;
    albumArtistName: string;
    songs: Song[];
  }>;
};

const initialState: LibraryState = {
  albums: [],
};

export const LibraryContext = createContext(initialState);
